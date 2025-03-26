// Boilerplate
using Microsoft.AspNetCore.Mvc;

namespace artshop.Server.Controllers
{
    // This controller handles all routes to {base URL}/api/demo.
    [Route("api/demo")]
    public class DemoController : ControllerBase
    {
        // This route is for GET requests to the main URL ({base url}/api/demo/) with no parameters.
        [HttpGet]
        public String TestRoute()
        {
            // This simply returns a string, "hi". Note that all styling should be handled in the client, so all backend routes should return pure data (rather than pages)
            return "hi";
        }

        // This route is also for GET requests.
        // This one asks for a single parameter ("quotation"), so it handles all requests to the base URL with parameters
        [HttpGet("{quotation}")]
        public String OtherRoute(String quotation)
        {
            return "hello " + quotation;
        }

        // This route handles POST requests to the main URL. Any POST requests to the URL with no further specification go here.
        [HttpPost]
        public int TestPost(int number)
        {
            return number * 10;
        }
    }
}