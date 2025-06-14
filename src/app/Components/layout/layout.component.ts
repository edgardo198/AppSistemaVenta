import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/Interfaces/menu';
import { MenuService } from 'src/app/Services/menu.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  listaMenus: Menu[] = [];
  correoUsuario: string = '';
  rolUsuario: string = '';

  constructor(
    private _menuServicio: MenuService,
    private router: Router,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    const usuario = this._utilidadServicio.obtenerSesionUsuario();
    if (usuario && usuario.correo && usuario.rolDescripcion && usuario.idUsuario) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;
      this.cargarMenus(usuario.idUsuario);
    } else {
      this.router.navigate(['/login']);
    }
  }

  cargarMenus(idUsuario: number): void {
    this._menuServicio.lista(idUsuario).subscribe({
      next: (data) => {
        if (data.status) {
          this.listaMenus = data.value;
        }
      },
      error: (e) => {
        console.error('Error al cargar los menús:', e);
      }
    });
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this._utilidadServicio.eliminarSesionUsuario();
      this.router.navigate(['/login']);
    }
  }
}


