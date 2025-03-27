using Xunit;
// This line imports all code in the namespace "artshop.Server.Controllers".
// Most relevant to this file, that includes "artshop.Server/Controllers/DemoController.cs"
using artshop.Server.Controllers;

namespace Server.Tests;

public class DemoController_Tests
{
    // Declare a property to store a controller in
    private readonly DemoController _demoController;

    // Instantiate the controller to test it
    public DemoController_Tests()
    {
        _demoController = new DemoController();
    }

    // Create a "Fact" to ensure that TestRoute() correctly returns "hi".
    // A "Fact" is a single test by itself: We define a single fact that must be true of correct code.
    [Fact]
    public void TestRoute_returnHi()
    {
        var result = _demoController.TestRoute();
        Assert.Equal("hi", result);
        // Deliberately failing test
        Assert.Equal(false, true);
    }

    // Create a "Theory" to ensure that OtherRoute() correctly returns a greeting.
    // A "Theory" is a rule which the code must obey: We define the rule and some examples, 
    // and the code must follow the rule for all given examples.
    [Theory]
    // These are the example inputs to use.
    [InlineData("Kyle")]
    [InlineData("Chris")]
    [InlineData("Any other name for demonstration purposes")]
    public void OtherRoute_returnGreeting(string name)
    {
        var result = _demoController.OtherRoute(name);

        Assert.Equal("hello " + name, result);
    }

    // Remember: It's important that the tests cover as much of the code as possible; ideally every line.
    [Theory]
    [InlineData(2)]
    [InlineData(5)]
    public void TestPost_returnMultiple(int value)
    {
        var result = _demoController.TestPost(value);
        Assert.Equal(value * 10, result);
    }

}