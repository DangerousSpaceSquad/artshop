using Xunit;
using artshop.Server.Controllers;

namespace Server.Tests;

public class DemoController_Tests
{
    private readonly DemoController _demoController;

    public DemoController_Tests()
    {
        _demoController = new DemoController();
    }

    [Fact]
    public void TestRoute_returnHi()
    {
        var result = _demoController.TestRoute();
        Assert.Equal("hi", result);
    }
}