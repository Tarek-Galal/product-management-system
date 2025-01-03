using FluentValidation;
using Microsoft.EntityFrameworkCore;
using ProductManagementSys.Data;
using ProductManagementSys.DTOs;
using ProductManagementSys.Models;

namespace ProductManagementSys.Endpoints
{
    public static class ProductEndpoints
    {
        /// <summary>
        /// Configures API endpoints for product management.
        /// </summary>
        /// <param name="app">The application builder used to define endpoints.</param>
        public static void MapProductEndpoints(this WebApplication app)
        {
            // Create a route group for the "/api/" path
            var group = app.MapGroup("/api/");

            // Gets the list of all products.
            // returns: A list of products
            group.MapGet("products/", async (AppDbContext db) => await db.Products.ToListAsync());

            // Gets a specific product by ID.
            // returns: The product if found; otherwise, a NotFound result.
            group.MapGet("product/{id}", async (int id, AppDbContext db) =>
                await db.Products.FindAsync(id) is Product product ? Results.Ok(product) : Results.NotFound());

            // Adds a new product.
            // returns: A Created result with the created product if successful; otherwise, a BadRequest result with validation errors.
            group.MapPost("add", async (ProductDto dto, IValidator<ProductDto> validator, AppDbContext db) =>
            {
                var validationResult = await validator.ValidateAsync(dto);
                if (!validationResult.IsValid)
                {
                    return Results.BadRequest(validationResult.Errors);
                }
                var product = new Product
                {
                    Name = dto.Name,
                    Description = dto.Description,
                    Price = dto.Price
                };

                db.Products.Add(product);
                await db.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                };

                return Results.Created($"/api/product/{product.Id}", productDto);
            });

            // Updates an existing product by ID.
            // returns: An Ok result with the updated product if successful; otherwise, NotFound or BadRequest result.
            group.MapPut("update/{id}", async (int id, ProductDto dto, IValidator<ProductDto> validator, AppDbContext db) =>
            {
                var validationResult = await validator.ValidateAsync(dto);
                if (!validationResult.IsValid)
                {
                    return Results.BadRequest(validationResult.Errors);
                }

                var existingProduct = await db.Products.FindAsync(id);
                if (existingProduct is null) return Results.NotFound();

                existingProduct.Name = dto.Name;
                existingProduct.Description = dto.Description;
                existingProduct.Price = dto.Price;

                await db.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Name = existingProduct.Name,
                    Description = existingProduct.Description,
                    Price = existingProduct.Price,
                };

                return Results.Ok(productDto);
            });

            // Deletes a product by ID.
            // returns: A NoContent result if successful; otherwise, a NotFound result.
            group.MapDelete("delete/{id}", async (int id, AppDbContext db) =>
            {
                var product = await db.Products.FindAsync(id);
                if (product is null) return Results.NotFound();

                db.Products.Remove(product);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });
        }
    }
}
