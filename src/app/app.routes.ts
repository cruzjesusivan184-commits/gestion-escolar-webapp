/**
 * app.routes.ts
 * ----------------------------------------------------------
 * Define las rutas principales de la aplicación Angular.
 * Estructura:
 *   - AuthLayout: rutas públicas (/login, /registro-usuarios, /registro-usuarios/:rol/:id)
 *   - DashboardLayout + AuthGuard: rutas protegidas (/home, /administrador, /alumnos, /maestros, /graficas)
 *   - Wildcard (**): redirige a /login
 *
 * Lazy loading con loadComponent:
 *   En lugar de importar cada pantalla al inicio, Angular solo descarga el
 *   código de una pantalla cuando el usuario navega a ella. Esto reduce
 *   el tamaño del bundle inicial y mejora el tiempo de carga.
 *   Sintaxis: loadComponent: () => import('./ruta').then(m => m.NombreClase)
 *
 * canActivate: [AuthGuard] protege las rutas del dashboard. Si el guard
 *   devuelve false (no hay token), Angular cancela la navegación y redirige
 *   al usuario a /login antes de mostrar cualquier pantalla protegida.
 */
import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [

  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./screens/login-screen/login-screen').then(m => m.LoginScreen),
      },
      {
        path: 'registro-usuarios',
        loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen').then(m => m.RegistroUsuariosScreen),
      },
      {
        path: 'registro-usuarios/:rol/:id',
        loadComponent: () => import('./screens/registro-usuarios-screen/registro-usuarios-screen').then(m => m.RegistroUsuariosScreen),
      },
    ]
  },

  {
    path: '',
    component: DashboardLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./screens/home-screen/home-screen').then(m => m.HomeScreen),
      },
      {
        path: 'administrador',
        loadComponent: () => import('./screens/admin-screen/admin-screen').then(m => m.AdminScreen),
      },
      {
        path: 'alumnos',
        loadComponent: () => import('./screens/alumnos-screen/alumnos-screen').then(m => m.AlumnosScreen),
      },
      {
        path: 'maestros',
        loadComponent: () => import('./screens/maestros-screen/maestros-screen').then(m => m.MaestrosScreen),
      },
      {
        path: 'graficas',
        loadComponent: () => import('./screens/graficos-screen/graficos-screen').then(m => m.GraficosScreen),
    },
    ]
  },

  // Retorna a la ruta de login para cualquier ruta no reconocida

  { path: '**', redirectTo: 'login' },
];
