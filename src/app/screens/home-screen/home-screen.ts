import { Component, OnInit } from '@angular/core';
import { AdminScreen } from '../admin-screen/admin-screen';
import { MaestrosScreen } from '../maestros-screen/maestros-screen';
import { AlumnosScreen } from '../alumnos-screen/alumnos-screen';
import { AuthServices } from '../../services/auth-services';

/**
 * HomeScreen
 * ----------------------------------------------------------
 * Pantalla de inicio del dashboard tras iniciar sesión.
 * Muestra la tabla correspondiente según el rol del usuario autenticado:
 * administrador → AdminScreen, maestro → MaestrosScreen, alumno → AlumnosScreen.
 *
 * Ruta: /home
 */
@Component({
  selector: 'app-home-screen',
  imports: [
    AdminScreen,
    MaestrosScreen,
    AlumnosScreen
  ],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss',
})
export class HomeScreen implements OnInit {
  public rol: string = '';

  constructor(private authService: AuthServices) {}

  // Obtiene el rol del usuario desde la sesión para mostrar la tabla correspondiente
  ngOnInit(): void {
    this.rol = this.authService.getUserGroup() ?? '';
  }
}
