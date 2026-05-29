import { Component, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatTableDataSource } from '@angular/material/table';
import { DatosAlumno } from '../../interfaces/usuarios-interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { AlumnosService } from '../../services/alumnos-service';
import { NotificationService } from '../../services/tools/notification-service';
import { AuthServices } from '../../services/auth-services';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModal } from '../../modals/eliminar-user-modal/eliminar-user-modal';

/**
 * AlumnosScreen
 * ----------------------------------------------------------
 * Pantalla de gestión de alumnos del sistema.
 * Ruta: /alumnos (protegida por AuthGuard)
 * Endpoints consumidos: GET /lista-alumnos/, DELETE /alumnos/?id=X
 *
 * Usa MatTableDataSource<DatosAlumno> en lugar de un array simple porque:
 *   - Integra automáticamente MatPaginator (paginación) y MatSort (ordenamiento).
 *   - Permite setear dataSource.filter para búsqueda en tiempo real.
 *   - filterPredicate personalizado filtra por nombre completo (first_name + last_name).
 *   - sortingDataAccessor personalizado permite ordenar por la columna 'nombre'
 *     que concatena first_name y last_name.
 *
 * @ViewChild(MatPaginator) y @ViewChild(MatSort):
 *   Decoradores que obtienen una referencia a los componentes <mat-paginator> y
 *   [matSort] del template. Se asignan al dataSource en ngAfterViewInit()
 *   (NO en ngOnInit) porque el DOM aún no existe al inicializar el componente.
 *
 * La eliminación abre EliminarUserModal; si el modal devuelve isDelete=true,
 * se recarga la lista llamando a obtenerAlumnos() de nuevo.
 */
@Component({
  selector: 'app-alumnos-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './alumnos-screen.html',
  styleUrl: './alumnos-screen.scss',
})
export class AlumnosScreen implements OnInit {

  public name_user: string = '';
  public rol: string = '';
  public lista_alumnos: any[] = [];

  //Declaramos las columnas que se mostrarán en la tabla
  public displayedColumns: string[] = [
    'matricula',
    'nombre',
    'email',
    'fecha_nacimiento',
    'curp',
    'rfc',
    'edad',
    'telefono',
    'ocupacion',
    'direccion',
    'sexo',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<DatosAlumno>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthServices,
    private alumnosService: AlumnosService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserGroup();
    this.obtenerAlumnos();
  }

  /**
   * ngAfterViewInit (hook del ciclo de vida)
   * Se ejecuta DESPUÉS de que Angular ha inicializado la vista del componente.
   * Solo en este momento @ViewChild(MatPaginator) y @ViewChild(MatSort) tienen valor,
   * por eso se asignan aquí y NO en ngOnInit.
   * Si se hiciera en ngOnInit, paginator y sort serían undefined porque el DOM
   * aún no ha sido renderizado.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Filtro de búsqueda por nombre
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //Función para obtener la lista de alumnos registrados
  public obtenerAlumnos(): void {
    this.alumnosService.obtenerListaAlumnos().subscribe({
      next: (response) => {
        this.lista_alumnos = response;

        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach((usuario) => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
        }

        this.dataSource = new MatTableDataSource<DatosAlumno>(
          this.lista_alumnos as DatosAlumno[]
        );

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }

        // Sorting por nombre completo
        this.dataSource.sortingDataAccessor = (item: any, property: string) => {
          switch (property) {
            case 'nombre': return item.first_name + ' ' + item.last_name;
            default: return item[property];
          }
        };

        // Filtro por nombre completo
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const nombre = (data.first_name + ' ' + data.last_name).toLowerCase();
          return nombre.includes(filter);
        };
      },
      error: () => {
        this.notificationService.error('No se pudo obtener la lista de alumnos');
      }
    });
  }

  // Redirige a la pantalla de edición del alumno con el id seleccionado
  public goEditar(idUser: number) {
    this.router.navigate(['/registro-usuarios', 'alumno', idUser]);
  }

  // Abre el modal de confirmación para eliminar el alumno con el id seleccionado
  public delete(idUser: number) {
    const dialogRef = this.dialog.open(EliminarUserModal, {
      data: { id: idUser, rol: 'alumno' },
      height: '288px',
      width: '328px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        this.obtenerAlumnos();
      }else{
        this.notificationService.error("Alumno no se ha podido eliminar.");
      }
    });
  }
}