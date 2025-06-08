import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false; // Corregido: Cambiado de mostrarLoafing a mostrarLoading

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Lógica inicial, si es necesario
  }

  iniciarSesion(): void {
    if (this.formularioLogin.invalid) {
      this._utilidadService.mostrarAlerta("Formulario inválido", "Error");
      return;
    }

    this.mostrarLoading = true; // Corregido: Usar mostrarLoading

    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    };

    this._usuarioServicio.inciarSecion(request).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilidadService.gurdarSesionUsuario(data.value);
          this.router.navigate(["pages"]);
        } else {
          this._utilidadService.mostrarAlerta("No se encontraron coincidencias", "Error");
        }
      },
      error: () => {
        this._utilidadService.mostrarAlerta("Hubo un error al iniciar sesión", "Error");
      },
      complete: () => {
        this.mostrarLoading = false; // Corregido: Usar mostrarLoading
      }
    });
  }
}
