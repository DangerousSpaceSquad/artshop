using Microsoft.AspNetCore.Mvc;

using Square;
using Square.Checkout.PaymentLinks;
using Square.Catalog;
using Square.Core;
using Square.Catalog.Object;

using artshop.Server.Models;

namespace artshop.Server.Controllers;

[Route("api/[controller]")]
public class SquareController : Controller
{
    // A WIP controller for the connection to the Square API. Expect routes to be deleted and added in the near future.
    private readonly SquareClient client;
    public SquareController()
    {
        client = new SquareClient(
            clientOptions: new ClientOptions{
                BaseUrl = SquareEnvironment.Production
            }
        );
    }

    /// <summary>
    /// Given a list of catalog object displays, and a dictionary containing their associated images,
    /// add the image URLs to the catalog objects.
    /// </summary>
    /// <param name="catalogObjectDisplays">The list of CatalogObjectDisplay objects to add images to</param>
    /// <param name="catalogImageDict">The dictionary of CatalogObjectImages to pull image URLs from</param>
    private static void PairImagesToCatalogDisplayObjects(
        List<CatalogVariationDisplay> catalogObjectDisplays,
        Dictionary<string, CatalogObjectImage> catalogImageDict)
    {
        foreach (CatalogVariationDisplay displayObject in catalogObjectDisplays)
        {
            if (displayObject.ImageId == null || !catalogImageDict.ContainsKey(displayObject.ImageId)) continue;
            CatalogImage? imageData = catalogImageDict[displayObject.ImageId].ImageData;

            if (imageData == null) continue;
            if (imageData.Url == null) continue;
            displayObject.ImageURL = imageData.Url;
        }
    }

    /// <summary>
    /// Given an item from the Square catalog, retrieve all contained Variations for display
    /// </summary>
    /// <param name="item"></param>
    /// <returns></returns>
    private static List<CatalogVariationDisplay> GetDisplayVariationsFromItem(CatalogObject item)
    {
        // Note: There's no particular reason this needs to retrieve *display* variations instead of Square ItemVariations, besides ease of implementation.
        // If it's justified in the future, consider refactoring accordingly.
        List<CatalogVariationDisplay> displayVariations = [];

        CatalogObjectItem retrievedItem = item.AsItem();
        if (retrievedItem.ItemData == null) return displayVariations;

        var variations = retrievedItem.ItemData.Variations;
        if (variations == null) return displayVariations;

        foreach (CatalogObject variation in variations)
        {
            CatalogObjectItemVariation retrievedVariation = variation.AsItemVariation();
            if (retrievedVariation.ItemVariationData == null) continue;
            if (retrievedVariation.ItemVariationData.PriceMoney == null) continue;

            CatalogVariationDisplay displayObject = new()
            {
                ItemId = retrievedItem.Id,
                VariationId = retrievedVariation.Id,
                ItemName = retrievedItem.ItemData.Name ?? "ERROR: Item name not found",
                VariationName = retrievedVariation.ItemVariationData.Name,
                Price = retrievedVariation.ItemVariationData.PriceMoney,
                DescriptionHTML = retrievedItem.ItemData.DescriptionHtml ?? "ERROR: Item description not found",
                ImageId = retrievedItem.ItemData.ImageIds?.First()
            };
            displayVariations.Add(displayObject);
        }
        return displayVariations;
    }

    // TODO: Add caching - Locations change extremely rarely.
    /// <summary>
    /// Get a valid Location ID from the Square API.
    /// </summary>
    /// <returns>A string ID for a valid Location for this Square account</returns>
    /// <exception cref="SquareException">In case a valid location cannot be identified</exception>
    private async Task<string> GetLocationId()
    {
        var response = await client.Locations.ListAsync();
        if (response.Locations == null)
        {
            // TODO: Try the call multiple times on failure
            throw new SquareException("No Locations were found in Square.");
        }
        Location location = response.Locations.First();
        if (location.Id == null)
        {
            throw new SquareException("A Location was found in Square, but it has no Id.");
        }
        return location.Id;
    }

    /// <summary>
    /// Retrieve an overview of all items in the catalog for display.
    /// </summary>
    /// <returns>A list of CatalogObjectDisplay objects, which have minimal information about each item in the Square catalog</returns>
    /// <exception cref="SquareException">If an item retrieved from the Square API doesn't match the expected type</exception>
    [HttpGet("ListCatalogVariationsForDisplay")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<List<CatalogVariationDisplay>> ListCatalogVariationsForDisplay()
    {
        Pager<CatalogObject> catalogItems = await client.Catalog.ListAsync(
            new ListCatalogRequest{
                Types = "ITEM,IMAGE"
            }
        );
        List<CatalogVariationDisplay> displayObjects = new();
        Dictionary<string, CatalogObjectImage> catalogImages = new();

        await foreach (CatalogObject item in catalogItems)
        {
            if (item.IsItem)
            {
                var retrievedVariations = GetDisplayVariationsFromItem(item);
                displayObjects.AddRange(retrievedVariations);
            }
            else if (item.IsImage)
            {
                catalogImages[item.AsImage().Id] = item.AsImage();
            }
            else
            {
                throw new SquareException("An object of type IMAGE or ITEM was expected from the Catalog, but an item of a different type was found.");
            }
        }

        PairImagesToCatalogDisplayObjects(displayObjects, catalogImages);

        Dictionary<string, CatalogVariationDisplay> filteredVariations = [];
        
        foreach (CatalogVariationDisplay item in displayObjects)
        {
            if (!filteredVariations.TryGetValue(item.ItemId, out CatalogVariationDisplay? value) || 
                    item.Price.Amount >= value.Price.Amount)
            {
                filteredVariations[item.ItemId] = item;
            }

        }

        return filteredVariations.Values.ToList();
    }

    // TODO: Revise this method to filter the response to just the relevant details
    [HttpGet("GetCatalogItem/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCatalogItem(string? id)
    {
        GetCatalogObjectResponse resp = await client.Catalog.Object.GetAsync(
            new GetObjectRequest{
                ObjectId = id ?? "",
                IncludeRelatedObjects = true
            }
        );

        return resp == null ? NotFound() : Ok(resp);
    }

    /// <summary>
    /// Create a payment link for a given order, allowing a user to purchase an arbitrary collection of items
    /// </summary>
    /// <param name="lineItems">A list of LineItems to purchase, including their Variation IDs and quantities of each</param>
    /// <returns>The URL of the payment link to direct the user to</returns>
    /// <exception cref="SquareException">If the Square API doesn't return the expected results</exception>
    [HttpPost("CreatePaymentLink")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Consumes("application/json")]
    public async Task<string> CreatePaymentLink([FromBody] List<LineItem> lineItems)
    {
        if (!ModelState.IsValid)
        {
            BadRequest("The request does not conform to the LineItem schema");
        }

        List<OrderLineItem> processedLineItems = [];
        foreach (LineItem lineItem in lineItems)
        {
            processedLineItems.Add(new OrderLineItem()
            {
                Quantity = lineItem.Quantity.ToString(),
                CatalogObjectId = lineItem.Id,
                ItemType = OrderLineItemItemType.Item
            });
        }

        var linkResponse = await client.Checkout.PaymentLinks.CreateAsync(
            new CreatePaymentLinkRequest
            {
                Order = new Order
                {
                    LocationId = await GetLocationId(),
                    LineItems = processedLineItems
                }
            }
        ) ?? throw new SquareException("The payment link request failed to generate a valid response from Square");
        // TODO: Handle Square errors in a more graceful way.
        if (linkResponse.PaymentLink == null) throw new SquareException("The payment link was created, but was invalid due to a Square error");
        if (linkResponse.PaymentLink.Url == null) throw new SquareException("The payment link was created, but it did not generate a valid URL");
        
        return linkResponse.PaymentLink.Url;
    }
}