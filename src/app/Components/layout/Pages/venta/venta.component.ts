import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {
  listaProductos: Producto[] = [];
  listaProductoFiltro: Producto[] = [];

  listaProductoParaVentas: DetalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;

  productoSeleccionado!: Producto;
  tipoDePagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'acciones'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductoParaVentas);

  retornarProductoPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === 'string' ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]]
    });

    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo && p.stock > 0);
        }
      },
      error: () => {
        this._utilidadServicio.mostrarAlerta('Error al cargar productos', 'error');
      }
    });

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductoFiltro = this.retornarProductoPorFiltro(value);
    });
  }

  ngOnInit(): void { }

  

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(event: any): void {
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(): void {
    if (!this.productoSeleccionado) {
      this._utilidadServicio.mostrarAlerta('Seleccione un producto válido', 'error');
      return;
    }

    const _cantidad: number = this.formularioProductoVenta.value.cantidad;

    if (_cantidad > this.productoSeleccionado.stock) {
      this._utilidadServicio.mostrarAlerta('Cantidad excede el stock disponible', 'error');
      return;
    }

    const _precio: number = parseFloat(this.productoSeleccionado.precio.toString());
    const _total: number = _cantidad * _precio;

    // Reducir stock del producto seleccionado
    const productoEnLista = this.listaProductos.find(p => p.idProducto === this.productoSeleccionado.idProducto);
    if (productoEnLista) {
      productoEnLista.stock -= _cantidad;
    }

    this.totalPagar = parseFloat((this.totalPagar + _total).toFixed(2)); // Controlar precisión

    this.listaProductoParaVentas.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: _precio.toFixed(2),
      totalTexto: _total.toFixed(2)
    });

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductoParaVentas);
  
    this.formularioProductoVenta.patchValue({ producto: '', cantidad: '' });
    this.productoSeleccionado = undefined!;
  }

  eliminarProducto(detalle: DetalleVenta): void {
    const detalleEliminado = this.listaProductoParaVentas.find(p => p.descripcionProducto === detalle.descripcionProducto);

    if (detalleEliminado) {
      this.totalPagar = parseFloat((this.totalPagar - parseFloat(detalleEliminado.totalTexto)).toFixed(2));

      // Restaurar stock del producto eliminado
      const producto = this.listaProductos.find(p => p.idProducto === detalleEliminado.idProducto);
      if (producto) {
        producto.stock += detalleEliminado.cantidad;
      }

      this.listaProductoParaVentas = this.listaProductoParaVentas.filter(item => item !== detalleEliminado);
      this.datosDetalleVenta.data = this.listaProductoParaVentas;
    }
  }

  registrarVenta(): void {
    if (this.listaProductoParaVentas.length > 0) {
      this.bloquearBotonRegistrar = true;

      const venta = {
        tipoPago: this.tipoDePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductoParaVentas
        
      };
      
      this._ventaServicio.registrar(venta).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar = 0.00;
            this.listaProductoParaVentas = [];
            this.datosDetalleVenta.data = this.listaProductoParaVentas;

            Swal.fire({
              icon: 'success',
              title: 'Venta registrada',
              text: `NuevaVenta: ${response.value.numeroDocumento}`,
            });
          }
        },
        error: (e) => {
          console.error('Error al registrar la venta:', e);
          this._utilidadServicio.mostrarAlerta('Error al registrar la venta', 'error');
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        }
      });
    } else {
      this._utilidadServicio.mostrarAlerta(
        'Debe agregar al menos un producto para registrar la venta',
        'error'
      );
    }
  }
}



