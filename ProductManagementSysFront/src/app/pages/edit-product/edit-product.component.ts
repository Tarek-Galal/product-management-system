import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TextareaModule,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss'
})
export class EditProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private messageService = inject(MessageService);
  
  productId!: number;
  
  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    price: [null, [Validators.required, Validators.min(0)]]
  });

  /**
 * Initializes the component by extracting the product ID from the route and loading the product data.
 *
 * This method is called automatically when the component is initialized. It retrieves the product ID
 * from the route parameters, converts it to a number, and invokes the `loadProduct` method to fetch
 * the product details.
 *
 * @returns {void} This function does not return any value.
 */
  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

/**
 * Loads product details based on the product ID and populates the form.
 *
 * This method fetches product data from the `productsService` using the provided `productId`.
 * If the product is successfully retrieved, its details are patched into the form.
 * In case of an error, an error message is displayed, and the user is redirected to the homepage.
 *
 * @returns {void} This function does not return any value.
 */
  loadProduct(): void {
    this.productsService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price
        });
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to load product",
          life: 3000
        });
        this.router.navigate(['/']);
      }
    });
  }

/**
 * Handles the submission of the product update form.
 *
 * This method checks if the form is valid, then sends the form data to the `productsService` to update the product.
 * Upon successful update, a success message is displayed, and the user is redirected to the homepage.
 * If the form is invalid, it marks all invalid controls as touched to trigger validation error messages.
 *
 * @returns {void} This function does not return any value.
 */
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productsService.updateProduct(this.productId, this.productForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Product updated successfully",
            life: 3000
          });

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to update product",
            life: 3000
          });
        }
      });
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}
