import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-create-product',
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
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  router = inject(Router);
  private messageService = inject(MessageService);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    price: [null, [Validators.required, Validators.min(0)]]
  });
  
/**
 * Handles the submission of the product creation form.
 *
 * If the form is valid, this method sends the form data to the `productsService` to create a new product.
 * Upon successful creation, a success message is displayed, and the user is redirected to the homepage.
 * If the form is invalid, it marks all invalid controls as touched to trigger validation error messages.
 *
 * @returns {void} This function does not return any value.
 */
  onSubmit(): void {
    if (this.productForm.valid) {
      this.productsService.createProduct(this.productForm.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Product created successfully",
            life: 3000
          });

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
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
