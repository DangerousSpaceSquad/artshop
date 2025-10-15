using Microsoft.EntityFrameworkCore;
using artshop.Server.Models;

namespace artshop.Server.Data;

public class DemoModelContext : DbContext
{
    public DbSet<DemoModel> DemoModels { get; set; }

    public string DbPath { get; }

    public DemoModelContext()
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path = Environment.GetFolderPath(folder);
        DbPath = System.IO.Path.Join(path, "demo.db");
    }

    // The following configures EF to create a Sqlite database file in the
    // special "local" folder for your platform.
    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}");
}