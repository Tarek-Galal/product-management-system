import { Injectable,inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  apiUrl = `${environment.apiUrl}`;
  private _http: HttpClient = inject(HttpClient);

  /**
   * Fetches the list of products from the server.
   *
   * @returns {Observable<Product[]>} An observable that emits an array of Product objects.
   */
  getProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(`${this.apiUrl}/products`);
  }

  /**
   * Fetches a single product by its ID from the server.
   *
   * @param {number} id - The ID of the product to fetch.
   * @returns {Observable<Product>} An observable that emits a single Product object.
   */
  getProduct(id: number): Observable<Product> {
    return this._http.get<Product>(`${this.apiUrl}/product/${id}`);
  }
  
  /**
   * Creates a new product on the server.
   *
   * @param {Product} product - The product object to be created.
   * @returns {Observable<Product>} An observable that emits the created Product object.
   */
  createProduct(product: Product): Observable<Product> {
    return this._http.post<Product>(`${this.apiUrl}/add`, product);
  } 

  /**
   * Updates an existing product on the server.
   *
   * @param {number} id - The ID of the product to update.
   * @param {Product} product - The updated product object.
   * @returns {Observable<Product>} An observable that emits the updated Product object.
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this._http.put<Product>(`${this.apiUrl}/update/${id}`, product);
  }

  /**
   * Deletes a product from the server.
   *
   * @param {number} id - The ID of the product to delete.
   * @returns {Observable<void>} An observable that emits nothing.
   */
  deleteProduct(id: number): Observable<void> {
      return this._http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
