using Xunit;
using artshop.Server.Controllers;
using artshop.Server.Models;
using artshop.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Server.Tests;

public class DemoModelController_Tests
{
    private readonly DemoModelContext _context;
    public DemoModelController_Tests()
    {
        var contextOptions = new DbContextOptionsBuilder<DemoModelContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new DemoModelContext(contextOptions);
    }

    [Theory]
    [InlineData(1, 1)]
    [InlineData(345, 2)]
    public void TestDBCreate(int id, int value)
    {
        // Arrange
        var controller = new DemoModelController(
            _context
        );

        // Act
        controller.TestCreate(id, value);

        // Assert
        DemoModel? actualModel = _context.DemoModels.Find(id);
        if (actualModel is null)
        {
            Assert.Fail("Model should be created but is null");
        }
        Assert.Equal(value, actualModel.Value);
    }

    [Theory]
    [InlineData(1, 1)]
    [InlineData(32,65)]
    public void TestDBRead(int id, int value)
    {
        // Arrange
        var controller = new DemoModelController(
            _context
        );
        DemoModel? demoModel = new DemoModel{Id=id, Value=value};
        _context.Add(demoModel);
        _context.SaveChanges();

        // Act
        var actionResult = controller.TestRead(id);
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var readModel = Assert.IsType<DemoModel>(okResult.Value);

        // Assert
        Assert.Equal(value, readModel.Value);
    }

    [Theory]
    [InlineData(1, 1, 5)]
    [InlineData(6, 14532, 2)]
    public void TestDBUpdate(int id, int value, int newValue)
    {
        // Arrange
        var controller = new DemoModelController(
            _context
        );
        DemoModel? demoModel = new DemoModel{Id=id, Value=value};
        _context.Add(demoModel);
        _context.SaveChanges();

        // Act
        controller.TestUpdate(id, newValue);

        // Assert
        DemoModel? actualModel = _context.DemoModels.Find(id);
        if (actualModel is null)
        {
            Assert.Fail("Model should be created but is null");
        }
        Assert.Equal(newValue, actualModel.Value);
    }

    [Theory]
    [InlineData(1, 1)]
    [InlineData(3, 5)]
    public void TestDBDelete(int id, int value)
    {
        // Create the model
        var controller = new DemoModelController(
            _context
        );
        DemoModel? demoModel = new DemoModel{Id=id, Value=value};
        _context.Add(demoModel);
        _context.SaveChanges();

        // Act
        controller.TestDelete(id);

        // Assert
        DemoModel? actualModel = _context.DemoModels.Find(id);
        if (actualModel is not null)
        {
            Assert.Fail("Model should be deleted but is not null");
        }
    }

}