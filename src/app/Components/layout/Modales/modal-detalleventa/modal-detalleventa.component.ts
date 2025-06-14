import { Component, OnInit, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';

@Component({
  selector: 'app-modal-detalleventa',
  templateUrl: './modal-detalleventa.component.html',
  styleUrls: ['./modal-detalleventa.component.css']
})
export class ModalDetalleventaComponent implements OnInit {

  fechaRegistro: string = "";
  numeroDocuemento: string = "";
  tipoPago: string = "";
  total: string = "";
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor( @Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = this._venta.fechaRegistro!;
    this.numeroDocuemento = this._venta.numeroDocumento!;
    this.tipoPago = this._venta.tipoPago!;
    this.total = this._venta.totalTexto;
    this.detalleVenta = this._venta.detalleVenta!;
   }

  ngOnInit(): void {
  }

}
