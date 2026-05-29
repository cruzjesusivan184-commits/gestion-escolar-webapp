import { Component, Input, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros-service';
import { NotificationService } from '../../services/tools/notification-service';

/**
 * RegistroMaestros
 * ----------------------------------------------------------
 * Formulario de registro y edición de maestros.
 * Recibe los datos del usuario por @Input cuando está en modo edición.
 * Incluye select de área de investigación, checkboxes de materias y datepicker.
 *
 * Endpoint(s) consumido(s): POST /maestros/, PUT /maestros/
 */
@Component({
  selector: 'app-registro-maestros',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros implements OnInit {

  @Input() rol:string = "";
  @Input() datos_user:any = {};

  public maestro: any = {};
  public errors: any = {};
  public editar:boolean = false;
  public idUser: number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Desarrollo Web'},
    {value: '2', viewValue: 'Programación'},
    {value: '3', viewValue: 'Bases de datos'},
    {value: '4', viewValue: 'Redes'},
    {value: '5', viewValue: 'Matemáticas'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programación 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologías Web'},
    {value: '5', nombre: 'Minería de datos'},
    {value: '6', nombre: 'Desarrollo móvil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administración de redes'},
    {value: '9', nombre: 'Ingeniería de Software'},
    {value: '10', nombre: 'Administración de S.O.'},
  ];

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private maestrosService: MaestrosService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['id'] !== undefined){
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      // Igual que admin: asignamos los datos que vienen del padre
      this.maestro = this.datos_user;
    }else{
      this.maestro = this.maestrosService.esquemaMaestro();
      this.maestro.rol = this.rol;
    }
  }

  //Funciones para password
  public showPassword() {
    if(this.inputType_1 === 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar() {
    if(this.inputType_2 === 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    this.errors = {};
    console.log("Datos del maestro: ", this.maestro);
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    if(this.maestro.password === this.maestro.confirmar_password){
      this.maestrosService.registrarMaestro(this.maestro).subscribe({
        next: (response) => {
          this.notificationService.success("Maestro registrado exitosamente");
          this.router.navigate(['/maestros']);
        },
        error: (error) => {
          console.error("Error al registrar el maestro: ", error);
          this.notificationService.error("Error al registrar el maestro. Por favor, inténtalo de nuevo.");
        }
      });
    } else {
      this.notificationService.error("Las contraseñas no coinciden");
      this.maestro.password="";
      this.maestro.confirmar_password="";
    }
  }

 public actualizar(){
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    this.maestro.id = this.idUser;
    this.maestrosService.actualizarMaestro(this.maestro).subscribe({
      next: (response) => {
        this.notificationService.success("Maestro actualizado exitosamente");
        this.router.navigate(['/maestros']);
      },
      error: (error) => {
        console.error("Error al actualizar el maestro: ", error);
        this.notificationService.error("Error al actualizar el maestro.");
      }
    });
  }
  // Convierte la fecha seleccionada en el datepicker al formato YYYY-MM-DD para el backend
  public changeFecha(event :any){
    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
  }

  // Agrega o quita una materia del array según el estado del checkbox
  public checkboxChange(event:any){
    if(event.checked){
      this.maestro.materias_array.push(event.source.value)
    } else {
      this.maestro.materias_array.forEach((materia: any, i: any) => {
        if(materia === event.source.value){
          this.maestro.materias_array.splice(i,1)
        }
      });
    }
  }

  // Retorna true si la materia con ese nombre ya está seleccionada; se usa para marcar los checkboxes en modo edición
  public revisarSeleccion(nombre: string){
    if(this.maestro.materias_array){
      const busqueda = this.maestro.materias_array.find((element: string)=>element===nombre);
      return busqueda !== undefined;
    }
    return false;
  }

}