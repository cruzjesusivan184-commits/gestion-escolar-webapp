import { Component, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatTableDataSource } from '@angular/material/table';
import { DatosMaestro } from '../../interfaces/usuarios-interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MaestrosService } from '../../services/maestros-service';
import { NotificationService } from '../../services/tools/notification-service';
import { AuthServices } from '../../services/auth-services';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModal } from '../../modals/eliminar-user-modal/eliminar-user-modal';

/**
 * MaestrosScreen
 * ----------------------------------------------------------
 * Pantalla de gestión de maestros del sistema.
 * Ruta: /maestros (protegida por AuthGuard)
 * Endpoints consumidos: GET /lista-maestros/, DELETE /maestros/?id=X
 *
 * Idéntica en estructura a AlumnosScreen: usa MatTableDataSource<DatosMaestro>
 * con @ViewChild para MatPaginator y MatSort (asignados en ngAfterViewInit).
 *
 * Diferencia importante en delete():
 *   Un maestro puede eliminarse a sí mismo, pero solo el administrador puede
 *   eliminar a otros maestros. La lógica verifica el rol y el id del usuario
 *   autenticado antes de abrir el modal de confirmación.
 */
@Component({
  selector: 'app-maestros-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './maestros-screen.html',
  styleUrl: './maestros-screen.scss',
})
export class MaestrosScreen implements OnInit {

  public name_user: string = '';
  public rol: string = '';
  public lista_maestros: any[] = [];

  //Declaramos las columnas que se mostrarán en la tabla
  public displayedColumns: string[] = [
    'id_trabajador',
    'nombre',
    'email',
    'fecha_nacimiento',
    'telefono',
    'rfc',
    'cubiculo',
    'area_investigacion',
    'campus',
    'sueldo_estimado',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<DatosMaestro>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private authService: AuthServices,
    private maestrosService: MaestrosService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.name_user = this.authService.getUserCompleteName();
    this.rol = this.authService.getUserGroup();
    this.obtenerMaestros();
  }

  /**
   * ngAfterViewInit: asigna el paginador y el sort al dataSource.
   * Se hace aquí (no en ngOnInit) porque @ViewChild solo tiene valor
   * después de que Angular renderiza el DOM con los elementos <mat-paginator> y [matSort].
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

  //Función para obtener la lista de maestros registrados
  public obtenerMaestros(): void {
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (response) => {
        this.lista_maestros = response;

        if (this.lista_maestros.length > 0) {
          this.lista_maestros.forEach((usuario) => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
        }

        this.dataSource = new MatTableDataSource<DatosMaestro>(
          this.lista_maestros as DatosMaestro[]
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
        this.notificationService.error('No se pudo obtener la lista de maestros');
      }
    });
  }

  // Redirige a la pantalla de edición del maestro con el id seleccionado
  public goEditar(idUser: number) {
    this.router.navigate(['/registro-usuarios', 'maestro', idUser]);
  }

  // Abre el modal de confirmación para eliminar el maestro con el id seleccionado
  public delete(idUser: number) {
    const idUserSession = Number(this.authService.getUserId());

    if (this.rol === 'administrador' || (this.rol === 'maestro' && idUserSession === idUser)) {
      const dialogRef = this.dialog.open(EliminarUserModal,{
        data: { id: idUser, rol: 'maestro' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.isDelete){
          this.obtenerMaestros();
        }else{
          this.notificationService.error("Maestro no se ha podido eliminar.");
        }
      });
    }else{
      this.notificationService.error("No tienes permiso para eliminar a este maestro.");
    }

  }
}