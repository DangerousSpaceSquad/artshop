using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

using Square;
using Square.Checkout.PaymentLinks;
using Square.Catalog;

namespace artshop.Server.Controllers;

[Route("api/[controller]")]
public class SquareController : Controller
{
    // A WIP controller for the connection to the Square API. Expect routes to be deleted and added in the near future.
    private SquareClient client;
    public SquareController()
    {
        client = new SquareClient(
            clientOptions: new ClientOptions{
                BaseUrl = SquareEnvironment.Sandbox
            }
        );
    }
    
    [HttpGet("ListCatalog")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<List<CatalogObject>> ListCatalogItems()
    {
        var catalogItems = await client.Catalog.ListAsync(
            new ListCatalogRequest()
        );

        List<CatalogObject> itemIds = [];
        await foreach (var item in catalogItems)
        {
            itemIds.Add(item);
        }

        return itemIds;
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