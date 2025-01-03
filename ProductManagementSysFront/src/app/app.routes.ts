import { Routes } from '@angular/router';
export const routes: Routes = [
    { path: '',loadComponent: () => import('./pages/products/products.component').then(c => c.ProductsComponent) },
    { path: 'create-product', loadComponent: () => import('./pages/create-product/create-product.component').then(c => c.CreateProductComponent) },
    { path: 'edit/:id', loadComponent: () => import('./pages/edit-product/edit-product.component').then(c => c.EditProductComponent) },
];
