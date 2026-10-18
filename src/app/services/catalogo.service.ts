import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  // Catálogo de productos
  private productosIniciales: Producto[] = [
    { id: 1, nombre: 'Cerveza Pilsen Callao 650ml', categoria: 'Cervezas', precio: 7.50, stock: 120 },
    { id: 2, nombre: 'Cerveza Cristal 650ml', categoria: 'Cervezas', precio: 7.00, stock: 150 },
    { id: 3, nombre: 'Cerveza Cusqueña Dorada 330ml', categoria: 'Cervezas Premium', precio: 6.50, stock: 95 },
    { id: 4, nombre: 'Cerveza Cusqueña Trigo 330ml', categoria: 'Cervezas Premium', precio: 6.20, stock: 80 },
    { id: 5, nombre: 'Cerveza Cusqueña Negra 330ml', categoria: 'Cervezas Premium', precio: 6.50, stock: 70 },
    { id: 6, nombre: 'Cerveza Cusqueña Roja 330ml', categoria: 'Cervezas Premium', precio: 6.50, stock: 65 },
    { id: 7, nombre: 'Cerveza Backus Ice 330ml', categoria: 'Cervezas', precio: 5.00, stock: 90 },
    { id: 8, nombre: 'Cerveza Corona Extra 355ml', categoria: 'Cervezas Importadas', precio: 8.50, stock: 110 },
    { id: 9, nombre: 'Cerveza Stella Artois 330ml', categoria: 'Cervezas Importadas', precio: 8.00, stock: 85 },
    { id: 10, nombre: 'Cerveza Michelob Ultra 355ml', categoria: 'Cervezas Importadas', precio: 9.00, stock: 60 },
    { id: 11, nombre: 'Agua San Mateo Sin Gas 625ml', categoria: 'Bebidas', precio: 2.50, stock: 200 },
    { id: 12, nombre: 'Agua San Mateo Con Gas 625ml', categoria: 'Bebidas', precio: 2.50, stock: 180 },
    { id: 13, nombre: 'Guaraná Backus 1.5L', categoria: 'Gaseosas', precio: 6.00, stock: 110 },
    { id: 14, nombre: 'Guaraná Backus Lata 355ml', categoria: 'Gaseosas', precio: 3.00, stock: 130 },
    { id: 15, nombre: 'Maltin Power 330ml', categoria: 'Bebidas', precio: 3.00, stock: 140 },
    { id: 16, nombre: 'Maltin Power 1L', categoria: 'Bebidas', precio: 5.50, stock: 95 }
  ];

  // Signals para el estado reactivo
  private productosSignal = signal<Producto[]>(this.productosIniciales);
  private filtroBusquedaSignal = signal<string>('');
  private filtroCategoriaSignal = signal<string>('');

  // Productos filtrados 
  readonly productosFiltrados = computed(() => {
    const busqueda = this.filtroBusquedaSignal().toLowerCase().trim();
    const categoria = this.filtroCategoriaSignal();

    return this.productosSignal().filter(producto => {
      const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
      const coincideCategoria = categoria ? producto.categoria === categoria : true;
      return coincideNombre && coincideCategoria;
    });
  });

  // Lista única de categorías para los filtros
  readonly categorias = computed(() => {
    const cats = this.productosSignal().map(p => p.categoria);
    return [...new Set(cats)];
  });

  // Métodos para actualizar los filtros
  filtrarPorNombre(termino: string) {
    this.filtroBusquedaSignal.set(termino);
  }

  filtrarPorCategoria(categoria: string) {
    this.filtroCategoriaSignal.set(categoria);
  }

  limpiarFiltros() {
    this.filtroBusquedaSignal.set('');
    this.filtroCategoriaSignal.set('');
  }
}