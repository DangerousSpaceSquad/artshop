using Microsoft.EntityFrameworkCore;
using artshop.Server.Models;

namespace artshop.Server.Data;

public class DemoModelContext : DbContext
{
    public DbSet<DemoModel> DemoModels { get; set; }

    // DbContextOptions is chosen dynamically at build time based on Program.cs.
    // This lets us use different options for different use cases without modifying the code.
    // For example, we can use a lightweight DB like SQLite for testing, then switch to a more heavyweight DB like
        // MSSQL for production/staging, where we can afford the increased startup times.
    // Without DI, we'd have to write our own helper class to automatically switch DBs under the hood.
    // If we did DI by hand, we'd have to write lots of interfaces to allow us to swap DB classes.
    // With built-in DI, we only need define what the DB needs to do, and .NET will handle wiring everything together.
    public DemoModelContext (DbContextOptions<DemoModelContext> options)
        : base(options)
    {
    }
}