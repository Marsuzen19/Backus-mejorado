import { Injectable, inject } from '@angular/core';
import { Pedido } from '../models/pedido.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private dbName = 'BackusVentasDB';
  private storeName = 'pedidos';
  private dbVersion = 1;
  private notificationService = inject(NotificationService);

  // Inicializar la base de datos IndexedDB
  private abrirDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        this.notificationService.mostrar('Error al conectar con IndexedDB', 'error');
        reject(request.error);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  // Guardar un nuevo pedido en IndexedDB
  async guardarPedido(pedido: Pedido): Promise<boolean> {
    try {
      const db = await this.abrirDB();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        // Quitamos el id si viene undefined para que autoincremente
        const pedidoSinId = { ...pedido };
        delete pedidoSinId.id;

        const request = store.add(pedidoSinId);

        request.onsuccess = () => {
          this.notificationService.mostrar('Pedido guardado correctamente en el dispositivo', 'success');
          resolve(true);
        };

        request.onerror = () => {
          this.notificationService.mostrar('Error al guardar el pedido en IndexedDB', 'error');
          reject(false);
        };
      });
    } catch (error) {
      this.notificationService.mostrar('Fallo crítico en la persistencia local', 'error');
      return false;
    }
  }

  // Actualizar un pedido existente en IndexedDB para cambiar el estado a SINCRONIZADO
  async actualizarPedido(pedido: Pedido): Promise<boolean> {
    try {
      const db = await this.abrirDB();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        
        // actualiza el registro existente usando su id
        const request = store.put(pedido);

        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          this.notificationService.mostrar('Error al actualizar el pedido en IndexedDB', 'error');
          reject(false);
        };
      });
    } catch (error) {
      this.notificationService.mostrar('Fallo al actualizar el estado del pedido', 'error');
      return false;
    }
  }

  // Obtener todos los pedidos guardados 
  async obtenerPedidos(): Promise<Pedido[]> {
    try {
      const db = await this.abrirDB();
      return await new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result as Pedido[]);
        };

        request.onerror = () => {
          this.notificationService.mostrar('Error al consultar el historial de pedidos', 'error');
          reject([]);
        };
      });
    } catch (error) {
      return [];
    }
  }
}