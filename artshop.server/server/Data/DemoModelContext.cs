using Microsoft.EntityFrameworkCore;
using artshop.Server.Models;

namespace artshop.Server.Data;

public class DemoModelContext : DbContext
{
    public DemoModelContext(DbContextOptions<DemoModelContext> options) : base(options) { }

    public DbSet<DemoModel> DemoModels => Set<DemoModel>();
}