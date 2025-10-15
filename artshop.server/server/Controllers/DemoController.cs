// Boilerplate
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;
using artshop.Server.Models;
using artshop.Server.Data;

namespace artshop.Server.Controllers
{
    // This controller handles all routes to {base URL}/api/demo.
    [Route("api/demo")]
    public class DemoController : Controller
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
            // Remember to encode any user-supplied data appropriately (in this case, using HTML)
            return HtmlEncoder.Default.Encode($"hello {quotation}");
        }

        // This route handles POST requests to the main URL. Any POST requests to the URL with no further specification go here.
        [HttpPost]
        public int TestPost(int number)
        {
            return number * 10;
        }
    }

    [Route("api/db")]
    public class DemoModelController : Controller
    {
        private readonly DemoModelContext _context;

        public DemoModelController(DemoModelContext context)
        {
            _context = context;
        }

        [HttpPost]
        async public Task TestCreate(int id, int value)
        {
            DemoModel demoModel = new DemoModel{Id=id, Value=value};
            _context.Add(demoModel);
            await _context.SaveChangesAsync();
        }

        [HttpGet("{id}")]
        async public Task<DemoModel?> TestRead(int id)
        {
            return await _context.DemoModels.FindAsync(id);
        }

        [HttpPost]
        async public Task TestUpdate(int id, int newValue)
        {
            DemoModel? demoModel = await _context.DemoModels.FindAsync(id);
            if (demoModel is null)
            {
                throw new Exception($"DemoModel {id} does not exist.");
            }
            demoModel.Value = newValue;
           await _context.SaveChangesAsync();
        }

        [HttpPost]
        async public Task TestDelete(int id)
        {
            DemoModel? demoModel = await _context.DemoModels.FindAsync(id);
            if (demoModel is null)
            {
                throw new Exception($"DemoModel {id} does not exist.");
            }
            _context.Remove(demoModel);
            await _context.SaveChangesAsync();
        }
    }
}