import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Slider, SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    TableModule, 
    CommonModule, 
    ButtonModule, 
    InputTextModule, 
    FormsModule, 
    IconFieldModule, 
    InputIconModule,
    ConfirmDialogModule,
    ToastModule,
    SliderModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private productsService = inject(ProductsService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  loading: boolean = true;

  productList: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';
  
  maxPrice: number = 10000;
  priceRange: number[] = [0, this.maxPrice];
  
/**
 * Initializes the component by loading the product list.
 *
 * This method is called automatically when the component is initialized.
 * It triggers the `loadProducts` method to fetch and display the product list.
 *
 * @returns {void} This function does not return any value.
 */
  ngOnInit(): void {
    this.loadProducts();
  }

/**
 * Navigates to the edit product page for a specific product ID.
 *
 * This method takes an ID as a parameter, constructs a URL with the ID,
 * and navigates to the edit product page using Angular's router.
 *
 * @param {number} id - The ID of the product to be edited.
 * @returns {void} This function does not return any value.
 */
  onEdit(id: number): void {
    this.router.navigate(['/edit', id]);
  }

/**
 * Handles the search functionality for filtering products based on user input.
 *
 * This method captures the search input from the user, updates the search text,
 * and triggers the filtering process to display only the relevant products.
 *
 * @param {Event} event - The event object containing the search input.
 * @returns {void} This function does not return any value.
 */
  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText = searchValue;
    this.filterProducts();
  }
  
/**
 * Navigates to the create product page.
 *
 * This method redirects the user to the create product page, allowing them to add a new product.
 *
 * @returns {void} This function does not return any value.
 */
  createProduct(): void {
    this.router.navigate(['/create-product']);
  }

/**
 * Deletes a product based on the provided ID.
 *
 * This method triggers a confirmation dialog to ensure the user wants to delete the product.
 * If the user confirms, it sends a request to delete the product from the server.
 * Upon successful deletion, a success message is displayed, and the product list is refreshed.
 *
 * @param {number} id - The ID of the product to be deleted.
 * @returns {void} This function does not return any value.
 */
  onDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.productsService.deleteProduct(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully',
              life: 3000
            });
            this.loadProducts();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete product',
              life: 3000
            });
          }
        });
      }
    });
  }
  
/**
 * Loads the list of products from the service and initializes relevant data.
 *
 * This function retrieves the product list using the `productsService`, updates
 * the local product list (`productList`) and filtered products (`filteredProducts`),
 * and sets loading indicators. It also calculates the maximum price from the product
 * list, initializes the price range, and triggers the filtering logic.
 *
 * @returns {void} This function does not return any value.
 */
  loadProducts(): void {
    this.productsService.getProducts().subscribe(products => {
      this.productList = products;
      this.filteredProducts = [...products];
      this.loading = false;

      if (products.length > 0) {
        const prices = products.map(p => p.price);
        const maxPrice = Math.max(...prices);
        console.log(maxPrice);
        this.maxPrice = maxPrice;
        this.priceRange = [0, maxPrice];
      }
      this.filterProducts();
      this.loading = false;
    });
  }

/**
 * Handles the price range change event to filter products based on the selected price range.
 *
 * This method updates the price range and triggers the filtering process to display only the relevant products.
 *
 * @returns {void} This function does not return any value.
 */
  onPriceRangeChange(): void {
    this.filterProducts();
  }

/**
 * Filters the product list based on the search text and price range.
 *
 * This method checks if the product matches the search text and price range,
 * and updates the filtered products list accordingly.
 *
 * @returns {void} This function does not return any value.
 */
  filterProducts(): void {
    this.filteredProducts = this.productList.filter(product => {
      const matchesSearch = !this.searchText || 
        product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchText.toLowerCase());
        
      const matchesPrice = product.price >= this.priceRange[0] && 
                          product.price <= this.priceRange[1];
      
      return matchesSearch && matchesPrice;
    });
  }
}
