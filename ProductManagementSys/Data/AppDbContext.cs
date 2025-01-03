using Microsoft.EntityFrameworkCore;
using ProductManagementSys.Models;

namespace ProductManagementSys.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
    }
}
