using Xunit;
using artshop.Server.Controllers;
using artshop.Server.Models;
using artshop.Server.Data;

namespace Server.Tests;

public class DemoModelController_Tests : IDisposable
{
    private readonly DemoModelController _demoModelController;

    private readonly DemoModelContext _context;

    public DemoModelController_Tests()
    {
        /* var _connection = new SqliteConnection("Filename=:memory:");
        _connection.Open();
        _contextOptions = new DbContextOptionsBuilder<DemoModelContext>()
            .UseSqlite(_connection)
            .Options;
        */
        _context = new DemoModelContext();

        _demoModelController = new DemoModelController(
            _context
        );
    }

    public void Dispose()
    {
        _context.DemoModels.RemoveRange(_context.DemoModels);
        _context.SaveChanges();
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(1, 2)]
    async public void TestDBRead(int id, int value)
    {
        await _demoModelController.TestCreate(id, value);
        DemoModel? readModel = await _demoModelController.TestRead(id);
        if (readModel is null)
        {
            Assert.Fail("Model was created but couldn't be read.");
        }
        Assert.Equal(value, readModel.Value);
    }

    [Theory]
    [InlineData(0, 1, 5)]
    [InlineData(6, 14532, 2)]
    async public void TestDBUpdate(int id, int value, int newValue)
    {
        await _demoModelController.TestCreate(id, value);
        await _demoModelController.TestUpdate(id, newValue);
        DemoModel? readModel = await _demoModelController.TestRead(id);
        if (readModel is null)
        {
            Assert.Fail("Model was created but couldn't be read.");
        }
        Assert.Equal(newValue, readModel.Value);
    }

    [Theory]
    [InlineData(0, 1)]
    [InlineData(3, 5)]
    async public void TestDBDelete(int id, int value)
    {
        await _demoModelController.TestCreate(id, value);
        await _demoModelController.TestDelete(id);
        DemoModel? readModel = await _demoModelController.TestRead(id);
        if (readModel is not null)
        {
            Assert.Fail("Deleted model still exists");
        }
        var ex = await Assert.ThrowsAsync<Exception>(() => _demoModelController.TestUpdate(id, value));
        Assert.Equal(ex.Message, $"DemoModel {id} does not exist.");
    }

}