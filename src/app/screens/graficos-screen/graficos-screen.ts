import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from '../../services/administradores-service';
import { NotificationService } from '../../services/tools/notification-service';

/**
 * GraficosScreen
 * ----------------------------------------------------------
 * Pantalla de análisis visual del sistema.
 * Muestra 4 gráficas dinámicas con datos reales del backend:
 *   - Histograma (line): conteo de usuarios por rol
 *   - Barras (bar): conteo de eventos académicos (datos fijos por ahora)
 *   - Pastel (pie): distribución de usuarios por rol
 *   - Dona (doughnut): distribución de usuarios por rol
 *
 * Ruta: /graficas
 * Endpoint(s) consumido(s): GET /total-usuarios/
 *
 * Los datos de usuarios (admins, maestros, alumnos) se obtienen
 * llamando al endpoint GET /total-usuarios/ al inicializar.
 */
@Component({
  selector: 'app-graficos-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './graficos-screen.html',
  styleUrl: './graficos-screen.scss',
})
export class GraficosScreen implements OnInit {

  // Objeto que almacena la respuesta del backend con los totales de usuarios
  public total_user: any = {};

  // ─────────────────────────────────────────────
  // GRÁFICA DE LÍNEA (Histograma de usuarios)
  // ─────────────────────────────────────────────

  /** Datos de la gráfica de línea; se actualizan dinámicamente en obtenerTotalUsers() */
  lineChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0], // Valores iniciales vacíos; se reemplazan con datos reales
        label: 'Registro de usuarios',
        backgroundColor: '#F88406'
      }
    ]
  };

  /** Opciones de la gráfica de línea */
  lineChartOption = {
    responsive: false
  };

  /** Plugin de etiquetas de datos para la gráfica de línea */
  lineChartPlugins = [DatalabelsPlugin];

  // ─────────────────────────────────────────────
  // GRÁFICA DE BARRAS (Eventos Académicos)
  // ─────────────────────────────────────────────

  /** Datos de la gráfica de barras (eventos académicos — datos estáticos) */
  barChartData = {
    labels: ['Congreso', 'FePro', 'Presentación Doctoral', 'Feria Matemáticas', 'T-System'],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  };

  /** Opciones de la gráfica de barras */
  barChartOption = {
    responsive: false
  };

  /** Plugin de etiquetas de datos para la gráfica de barras */
  barChartPlugins = [DatalabelsPlugin];

  // ─────────────────────────────────────────────
  // GRÁFICA DE PASTEL (Usuarios por rol)
  // ─────────────────────────────────────────────

  /** Datos de la gráfica de pastel; se actualizan dinámicamente en obtenerTotalUsers() */
  pieChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0], // Valores iniciales vacíos; se reemplazan con datos reales
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  };

  /** Opciones de la gráfica de pastel */
  pieChartOption = {
    responsive: false
  };

  /** Plugin de etiquetas de datos para la gráfica de pastel */
  pieChartPlugins = [DatalabelsPlugin];

  // ─────────────────────────────────────────────
  // GRÁFICA DE DONA (Usuarios por rol)
  // ─────────────────────────────────────────────

  /** Datos de la gráfica de dona; se actualizan dinámicamente en obtenerTotalUsers() */
  doughnutChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [0, 0, 0], // Valores iniciales vacíos; se reemplazan con datos reales
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  };

  /** Opciones de la gráfica de dona */
  doughnutChartOption = {
    responsive: false
  };

  /** Plugin de etiquetas de datos para la gráfica de dona */
  doughnutChartPlugins = [DatalabelsPlugin];

  /**
   * Constructor
   * Se inyectan los servicios necesarios para obtener datos del backend
   * y para mostrar notificaciones al usuario.
   */
  constructor(
    private notificationService: NotificationService,
    private administradoresServices: AdministradoresService
  ) { }

  /**
   * ngOnInit
   * Se ejecuta al inicializar el componente.
   * Llama a obtenerTotalUsers() para cargar los datos reales del backend.
   */
  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  /**
   * obtenerTotalUsers
   * ----------------------------------------------------------
   * Llama al endpoint GET /total-usuarios/ del backend.
   * La respuesta tiene la forma:
   *   { total_admins: number, total_maestros: number, total_alumnos: number }
   *
   * Con esos valores actualiza los datos de las gráficas de línea,
   * pastel y dona para que muestren información real en tiempo de carga.
   */
  public obtenerTotalUsers(): void {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        // Guardamos la respuesta completa para uso general
        this.total_user = response;
        console.log('Total de usuarios: ', this.total_user);

        // Extraemos los valores del backend
        const admins   = response.total_admins   ?? 0;
        const maestros = response.total_maestros ?? 0;
        const alumnos  = response.total_alumnos  ?? 0;

        // Actualizamos la gráfica de línea con datos reales
        // Se crea un nuevo objeto para que Angular detecte el cambio
        this.lineChartData = {
          ...this.lineChartData,
          datasets: [{
            ...this.lineChartData.datasets[0],
            data: [admins, maestros, alumnos]
          }]
        };

        // Actualizamos la gráfica de pastel con datos reales
        this.pieChartData = {
          ...this.pieChartData,
          datasets: [{
            ...this.pieChartData.datasets[0],
            data: [admins, maestros, alumnos]
          }]
        };

        // Actualizamos la gráfica de dona con datos reales
        this.doughnutChartData = {
          ...this.doughnutChartData,
          datasets: [{
            ...this.doughnutChartData.datasets[0],
            data: [admins, maestros, alumnos]
          }]
        };

        this.notificationService.success('Total de usuarios registrados por cada rol obtenido correctamente');
      },
      (error) => {
        // Si el backend falla, se muestra un mensaje de error al usuario
        this.notificationService.error('No se pudo obtener el total de cada rol de usuarios');
      }
    );
  }
}
