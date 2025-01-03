using FluentValidation;
using ProductManagementSys.DTOs;
using ProductManagementSys.Models;

namespace ProductManagementSys.Validators
{
    public class ProductValidator : AbstractValidator<ProductDto>
    {
        public ProductValidator()
        {
            RuleFor(p => p.Name).NotEmpty().MaximumLength(100).WithMessage("Name Exceded the Maximum Length");
            RuleFor(p => p.Description).NotEmpty().MaximumLength(500).WithMessage("Description Exceded the Maximum Length");
            RuleFor(p => p.Price).GreaterThan(0).WithMessage("Price Cannot Be Zero");
        }
    }
}
