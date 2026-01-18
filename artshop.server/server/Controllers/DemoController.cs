// Boilerplate
// We're using the MVC framework from .NET
using Microsoft.AspNetCore.Mvc;
// We need to do some text encoding (for web, specifically HTML)
using System.Text.Encodings.Web;
// We're creating instances of our custom data models.
using artshop.Server.Models;
// We're interacting with our data stores.
using artshop.Server.Data;

// Group this code under the name "artshop.Server.Controllers", so other code can import it.
namespace artshop.Server.Controllers;
// This controller handles all routes to {base URL}/api/Demo.
// The [controller] part is replaced with the name of the class, minus "Controller", so in this case, it's "Demo".
    // If you prefer, you can hardcode this name instead, e.g. [Route("api/customdemoroutename")]
[Route("api/[controller]")]
public class DemoController : Controller
{
    // This route is for GET requests to the main URL ({base url}/api/demo/) with no parameters.
    [HttpGet]
    // Inform clients that this should return a status of either 200 or 404.
    [ProducesResponseType(StatusCodes.Status200OK)]
    public String TestRoute()
    {
        // This simply returns a string, "hi".
        // Note that all styling should be handled in the client, so all backend routes should return pure data.
            // The MVC framework that we use is designed to use Views, but we won't be using those.
            // (We benefit from the Models and Controllers it adds, which is why we're still using it over Minimal API)
        return "hi";
    }

    // This route is also for GET requests.
    // This one asks for a single parameter ("quotation"), so it handles all requests to the base URL with parameters
    [HttpGet("{quotation}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public String OtherRoute(String quotation)
    {
        // Remember: Whenever you send the user data of any sort, consider if it might have been manipulated by a user (even if it's the same user).
        // If it has, you MUST encode it appropriately. This is necessary to prevent injection attacks.
        return HtmlEncoder.Default.Encode($"hello {quotation}");
    }

    // This route handles POST requests to the main URL. Any POST requests to the URL with no further specification go here.
    [HttpPost]
    // Inform any clients that this method should return either 201 or 400.
    // This is typical for POST methods, 201 is a success and 400 is a failure.
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // Take JSON as input.
    [Consumes("application/json")]
    public int TestPost(int number)
    {
        return number * 10;
    }
}

[Route("api/[controller]")]
public class DemoModelController : Controller
{
    // This refers to a data context, AKA a repository of data.
    // In C# (and in most languages), starting a variable with an underscore indicates that it's private.
        // i.e. No other code should interact with this.
    // It's readonly because the Context object is an intermediary to interact with the data store.
        // The data store itself is not readonly.
    // A better name would be "_repository"; it's named this to match the sources I'm researching from.
    private readonly DemoModelContext _context;

    // Note that no code explicitly initializes this. This is because .NET works on a Dependency Injection model.
    // In other words, the framework decides how to initialize it at build time, based on configurable build settings.
    // At time of writing, this is defined in Program.cs, which is typical for small codebases.
    // See DemoModelContext.cs for an example of why that's useful.
    public DemoModelController(DemoModelContext context)
    {
        _context = context;
    }

    // Bind this method to the route POST "api/DemoModel/create"
    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    // Take JSON as input.
    [Consumes("application/json")]
    // The ActionResult type is effectively an HTTP response, e.g. "200: "Hi!"", "404".
        // There are various .NET methods to interact with ActionResults to get the status code, metadata, and of course the actual returned data.
    // The "I" prefix indicates an interface, so here we return something that conforms to the Action Result interface.
    // In practice, you use IActionResult when you want to return various types of action results depending on input,
    // and you use ActionResult when you only want to return one type of action result regardless.
    // Because we use both 201 and 400 here, we use IActionResult.
    // For simple queries, you can return a raw data type and .NET will figure it out.
    // The other complex data type is HttpResult, which is lower level and can be useful in niche scenarios.
    public IActionResult TestCreate(int id, int value)
    {
        DemoModel? demoModel = new DemoModel{Id=id, Value=value};
        _context.Add(demoModel);
        _context.SaveChanges();
        return demoModel == null ? BadRequest() : CreatedAtAction(nameof(TestRead), new { id = id }, demoModel);
    }

    // ":int" - Only bind to routes ending in an integer; other types go elsewhere (or nowhere, in this case)
    [HttpGet("read/{id:int}")]
    // 200 on success, 404 on failures; this is typical for GET methods.
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult TestRead(int id)
    {
        DemoModel? demoModel = _context.DemoModels.Find(id);
        return demoModel == null ? NotFound() : Ok(demoModel);
    }

    [HttpPatch("update/{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    public IActionResult TestUpdate(int id, int newValue)
    {
        DemoModel? demoModel = _context.DemoModels.Find(id);
        if (demoModel is null)
        {
            return NotFound();
        }
        demoModel.Value = newValue;
        _context.SaveChanges();
        return NoContent();
    }

    [HttpDelete("delete/{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Consumes("application/json")]
    public IActionResult TestDelete(int id)
    {
        DemoModel? demoModel = _context.DemoModels.Find(id);
        if (demoModel is null)
        {
            return NotFound();
        }
        _context.Remove(demoModel);
        _context.SaveChanges();
        return NoContent();
    }
}