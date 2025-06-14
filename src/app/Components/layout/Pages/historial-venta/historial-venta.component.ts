import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from "moment";

import { ModalDetalleventaComponent } from '../../Modales/modal-detalleventa/modal-detalleventa.component';

import { Venta } from 'src/app/Interfaces/venta';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMM YYYY' },
};

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {
  formularioBusqueda: FormGroup;
  opcionesBusqueda = [
    { value: 'fecha', descripcion: 'Fecha' },
    { value: 'numero', descripcion: 'Numero Venta' },
  ];
  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  datosListaVenta = new MatTableDataSource<Venta>([]);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventasServicio: VentaService,
    private _utilidadServicio: UtilidadService,
    private dialog: MatDialog
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha', Validators.required],
      numero: ['', Validators.pattern('^[0-9]*$')],
      fechaInicio: [null],
      fechaFin: [null],
    });

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(() => {
      this.formularioBusqueda.patchValue({ numero: '', fechaInicio: '', fechaFin: '' });
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas(): void {
    let _fechaInicio = '';
    let _fechaFin = '';

    if (this.formularioBusqueda.value.buscarPor === 'fecha') {
      if (!this.formularioBusqueda.value.fechaInicio || !this.formularioBusqueda.value.fechaFin) {
        this._utilidadServicio.mostrarAlerta('Debe ingresar ambas fechas', 'error');
        return;
      }

      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if (_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date') {
        this._utilidadServicio.mostrarAlerta('Formato de fecha inválido', 'error');
        return;
      }
    }

    this._ventasServicio
      .historial(
        this.formularioBusqueda.value.buscarPor,
        this.formularioBusqueda.value.numero,
        _fechaInicio,
        _fechaFin
      )
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.datosListaVenta.data = data.value;
          } else {
            this._utilidadServicio.mostrarAlerta('No se encontraron registros', 'info');
          }
        },
        error: (e) => {
          console.error('Error al buscar ventas:', e);
          this._utilidadServicio.mostrarAlerta('Ocurrió un error al realizar la búsqueda', 'error');
        },
      });
  }

  verDetalleVenta(_venta: Venta): void {
    this.dialog.open(ModalDetalleventaComponent, {
      data: _venta,
      disableClose: true,
      width: '700px',
    });
  }
}
