/**
 * usuarios-interfaces.ts
 * ----------------------------------------------------------
 * Define las interfaces TypeScript para los modelos de datos de usuarios.
 * Se utilizan principalmente como tipo genérico del MatTableDataSource
 * en las pantallas de gestión (MaestrosScreen, AlumnosScreen).
 * Separar las interfaces aquí evita repetir definiciones en cada componente.
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
