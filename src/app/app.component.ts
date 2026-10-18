import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatalogoService } from './services/catalogo.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { NotificationComponent } from './components/notification/notification.component';
import { Producto, LineaPedido, Pedido } from './models/pedido.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  catalogoService = inject(CatalogoService);
  storageService = inject(StorageService);
  notificationService = inject(NotificationService);

  isOnline: boolean = navigator.onLine;
  carrito: LineaPedido[] = [];
  historialPedidos: Pedido[] = [];

  // Variable para controlar el modal de detalle del pedido
  pedidoSeleccionado: Pedido | null = null;

  ngOnInit() {
    this.cargarHistorial();
  }

  // Escuchar eventos reales de red del navegador
  @HostListener('window:online')
  async handleOnline() {
    this.isOnline = true;
    this.notificationService.mostrar('Conexión a internet restablecida. Sincronizando pedidos...', 'info');

    const pedidos = await this.storageService.obtenerPedidos();
    const pendientes = pedidos.filter(p => p.estado === 'PENDIENTE');

    for (const pedido of pendientes) {
      pedido.estado = 'SINCRONIZADO';
      await this.storageService.actualizarPedido(pedido);
    }

    if (pendientes.length > 0) {
      this.notificationService.mostrar(`¡${pendientes.length} pedido(s) sincronizado(s) con el servidor!`, 'success');
    }

    await this.cargarHistorial();
  }

  @HostListener('window:offline')
  handleOffline() {
    this.isOnline = false;
    this.notificationService.mostrar('Estás offline. Los pedidos se guardarán localmente como PENDIENTE.', 'warning');
  }

  onBuscar(event: any) {
    const valor = event.target.value;
    this.catalogoService.filtrarPorNombre(valor);
  }

  onFiltrarCategoria(event: any) {
    const valor = event.target.value;
    this.catalogoService.filtrarPorCategoria(valor);
  }

  agregarAlCarrito(producto: Producto) {
    const index = this.carrito.findIndex(item => item.productoId === producto.id);
    
    if (index >= 0) {
      this.carrito[index].cantidad += 1;
      this.carrito[index].subtotal = this.carrito[index].cantidad * this.carrito[index].precioUnitario;
    } else {
      this.carrito.push({
        productoId: producto.id,
        producto: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: 1,
        subtotal: producto.precio
      });
    }
    this.notificationService.mostrar(`Agregado: ${producto.nombre}`, 'success', 2000);
  }

  actualizarCantidad(index: number, event: any) {
    const valor = Number(event.target.value);

    if (!Number.isInteger(valor) || valor <= 0) {
      this.notificationService.mostrar('La cantidad debe ser un número entero mayor a cero', 'error');
      event.target.value = this.carrito[index].cantidad;
      return;
    }

    this.carrito[index].cantidad = valor;
    this.carrito[index].subtotal = valor * this.carrito[index].precioUnitario;
  }

  removerLinea(index: number) {
    this.carrito.splice(index, 1);
    this.notificationService.mostrar('Producto removido del carrito', 'info', 2000);
  }

  get totalGeneral(): number {
    return this.carrito.reduce((acc, curr) => acc + curr.subtotal, 0);
  }

  async confirmarPedido() {
    if (this.carrito.length === 0) {
      this.notificationService.mostrar('No se puede registrar un pedido vacío', 'warning');
      return;
    }

    const nuevoPedido: Pedido = {
      fecha: new Date().toLocaleString(),
      lineas: [...this.carrito],
      total: this.totalGeneral,
      estado: 'PENDIENTE',
      origen: this.isOnline ? 'ONLINE' : 'OFFLINE'
    };

    const exito = await this.storageService.guardarPedido(nuevoPedido);
    
    if (exito) {
      if (this.isOnline) {
        this.notificationService.mostrar('Pedido guardado correctamente (Online)', 'success');
      } else {
        this.notificationService.mostrar('Sin API: Pedido guardado en el dispositivo (Offline)', 'warning');
      }

      this.carrito = [];
      await this.cargarHistorial();
    }
  }

  async cargarHistorial() {
    this.historialPedidos = await this.storageService.obtenerPedidos();
  }

  // Métodos para abrir y cerrar el modal de detalles
  verDetalle(pedido: Pedido) {
    this.pedidoSeleccionado = pedido;
  }

  cerrarDetalle() {
    this.pedidoSeleccionado = null;
  }
}