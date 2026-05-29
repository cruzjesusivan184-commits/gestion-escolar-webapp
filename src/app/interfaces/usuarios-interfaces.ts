/**
 * usuarios-interfaces.ts
 * ----------------------------------------------------------
 * Define las interfaces TypeScript para los modelos de datos de usuarios.
 *
 * Se utilizan principalmente como tipo genérico del MatTableDataSource en
 * las pantallas de gestión (MaestrosScreen, AlumnosScreen). Por ejemplo:
 *   dataSource = new MatTableDataSource<DatosMaestro>([]);
 *
 * ¿Por qué MatTableDataSource en lugar de un array simple?
 *   MatTableDataSource es una clase de Angular Material que, además de
 *   almacenar los datos, gestiona automáticamente el filtrado, la paginación
 *   (MatPaginator) y el ordenamiento (MatSort). Con un array normal habría
 *   que implementar esa lógica manualmente.
 *
 * Centralizar las interfaces aquí evita duplicar definiciones en cada componente
 * y garantiza consistencia con los campos que devuelve la API Django.
 */

/// Interfaz datos de usuario de maestro
export interface DatosMaestro {
  id: number;
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  cubiculo: string;
  area_investigacion: number;
}

//TODO: Crear interfaces para alumno y administrador

// Interfaz datos de alumno
export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
}
