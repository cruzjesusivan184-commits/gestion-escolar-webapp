import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { AuthServices } from '../../services/auth-services';
import { NotificationService } from '../../services/tools/notification-service';

/**
 * LoginScreen
 * ----------------------------------------------------------
 * Pantalla de autenticación del sistema.
 * Ruta: /login (pública, sin AuthGuard)
 * Endpoint consumido: POST /login/ (vía AuthServices.login)
 *
 * Flujo del login:
 *   1. El usuario escribe email y contraseña.
 *   2. login() llama a AuthServices.validarLogin() para validar en frontend.
 *   3. Si hay errores, se muestran debajo de los campos (no se llama al backend).
 *   4. Si pasa validación → POST /login/ → respuesta con token + rol.
 *   5. AuthServices.saveUserData() guarda el token en cookies.
 *   6. Se redirige a /home sin importar el rol (todos van al mismo dashboard).
 *
 * Variable `load`: se activa mientras el backend procesa el login para
 * deshabilitar el botón y evitar múltiples peticiones simultáneas.
 *
 * Variable `type`: alterna entre 'password' y 'text' para mostrar/ocultar
 * la contraseña con el ícono del ojo en el formulario.
 */
@Component({
  selector: 'app-login-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
})
export class LoginScreen implements OnInit {

  // Aquí van las variables globales
  public username: string = '';
  public password: string = '';
  public load: boolean = false;
  public errors: any = {};
  public type: string = "password";

  constructor(
    public router: Router,
    private authServices: AuthServices,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

  }

  public login(){
    // Inicializo el objeto de errores para evitar que se muestren errores anteriores o datos anteriores al momento de registrar un nuevo admin
    this.errors = {};
    console.log("Datos del user: ", this.username, this.password);

    // Validar datos y mostrar errores
    this.errors = this.authServices.validarLogin(this.username, this.password);
    //Verificamos si el objeto de errores está vacío, lo que indica que no hay errores de validación
    if(Object.keys(this.errors).length > 0){
      return;
    }

    console.log("Pasó la validación");
    this.load = true;
    //Agregamos la función para llamar la función que está en authService y realizar el login
    this.authServices.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log("Respuesta del login: ", response);
        // Guardar el token de sesión y los datos del usuario en cookies
        this.authServices.saveUserData(response);
        //Redirigir al usuario a la pantalla principal después de iniciar sesión
        const role = response.rol;
        if (role === 'administrador') {
          this.router.navigate(['home']);
        } else if (role === 'maestro') {
          this.router.navigate(['home']);
        } else if (role === 'alumno') {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['']);
        }
        this.load = false;
      },
      error: (error) => {
        console.log("Error en el login: ", error);
        this.load = false;
        this.notificationService.error("Error en el login: " + error.message);
        if (error.status === 401) {
          this.errors.general = "Credenciales incorrectas";
        } else {
          this.errors.general = "Error en el servidor, por favor intenta más tarde";
        }
      }
    });

  }

  // Redirige a la pantalla de registro de usuarios
  public registrar() {
    this.router.navigate(['registro-usuarios']);
  }

  // Alterna la visibilidad del campo de contraseña (pendiente de implementar)
  public showPassword() {

  }

}
