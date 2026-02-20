using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

using Square;
using Square.Checkout.PaymentLinks;
using Square.Catalog;
using Square.Core;

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
                BaseUrl = SquareEnvironment.Sandbox
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
        List<CatalogObjectDisplay> catalogObjectDisplays,
        Dictionary<string, CatalogObjectImage> catalogImageDict)
    {
        foreach (CatalogObjectDisplay displayObject in catalogObjectDisplays)
        {
            if (displayObject.ImageId == null || !catalogImageDict.ContainsKey(displayObject.ImageId)) continue;
            CatalogImage? imageData = catalogImageDict[displayObject.ImageId].ImageData;

            if (imageData == null) continue;
            if (imageData.Url == null) continue;
            displayObject.ImageURL = imageData.Url;
        }
    }

    /// <summary>
    /// Retrieve an overview of all items in the catalog for display.
    /// </summary>
    /// <returns>A list of CatalogObjectDisplay objects, which have minimal information about each item in the Square catalog</returns>
    /// <exception cref="SquareException">If an item retrieved from the Square API doesn't match the expected type</exception>
    [HttpGet("ListCatalog")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<List<CatalogObjectDisplay>> ListCatalogItemsForDisplay()
    {
        Pager<CatalogObject> catalogItems = await client.Catalog.ListAsync(
            new ListCatalogRequest{
                Types = "ITEM,IMAGE"
            }
        );
        List<CatalogObjectDisplay> displayObjects = new();
        Dictionary<string, CatalogObjectImage> catalogImages = new();

        await foreach (CatalogObject item in catalogItems)
        {
            if (item.IsItem)
            {
                // If the item has no data, skip it
                CatalogObjectItem retrievedItem = item.AsItem();
                if (retrievedItem.ItemData == null) continue;
                
                CatalogObjectDisplay displayObject = new()
                {
                    ItemId = retrievedItem.Id,
                    Name = retrievedItem.ItemData.Name ?? "ERROR: Item name not found",
                    DescriptionHTML = retrievedItem.ItemData.DescriptionHtml ?? "ERROR: Item description not found",
                    ImageId = retrievedItem.ItemData.ImageIds?.First()
                };

                displayObjects.Add(displayObject);
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

        return displayObjects;
    }

    [HttpGet("ListLocations")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ListLocationsResponse> ListLocations()
    {
        var locations = await client.Locations.ListAsync();
        return locations;
    }
    
    [HttpGet("ListLinks")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<List<PaymentLink>> ListLinks()
    {
        var pager = await client.Checkout.PaymentLinks.ListAsync(
            new ListPaymentLinksRequest()
        );

        List<PaymentLink> customerList = [];
        await foreach (var customer in pager)
        {
            customerList.Add(customer);
        }
        return customerList;
    }

    [HttpGet("CreateLink")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<PaymentLink> CreateLink()
    {
        var linkResponse =  await client.Checkout.PaymentLinks.CreateAsync(
            new CreatePaymentLinkRequest{
                QuickPay = new QuickPay{
                    Name = "Test Link",
                    PriceMoney = new Money{
                        Amount = 100,
                        Currency = Currency.Usd
                    },
                    LocationId = "TODO"
                }
            }
        );
        return linkResponse.PaymentLink;
    }
}