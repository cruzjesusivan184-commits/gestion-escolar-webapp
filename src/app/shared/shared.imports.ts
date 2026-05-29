import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

/* =========================
   Router
   ========================= */
import { RouterModule } from '@angular/router';
//Agregar ngClass para el navbar
import { NgClass } from '@angular/common';

/*Elementos de angular material*/
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';

/* =========================
   ngx-mask (inputs de código)
   ========================= */
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

/* =========================
   GRÁFICAS
   ========================= */
import { BaseChartDirective } from 'ng2-charts';

/**
 * SHARED_IMPORTS
 * ---------------------------------------------------------
 * Colección centralizada de módulos y directivas que se reutilizan
 * en todos los componentes standalone de la app.
 *
 * ¿Por qué existe este archivo?
 *   Con Angular standalone, cada componente declara sus propias importaciones.
 *   Sin este archivo, habría que repetir la misma lista de 15+ módulos en cada
 *   componente. SHARED_IMPORTS agrupa todo y se esparce con el spread operator:
 *     imports: [...SHARED_IMPORTS]
 *
 * Módulos incluidos y su propósito:
 *   - CommonModule / NgClass: directivas *ngIf, *ngFor, NgClass (aunque Angular 17+
 *     puede usar @if/@for, algunos componentes aún usan la sintaxis antigua).
 *   - FormsModule: habilita [(ngModel)] para el two-way data binding en formularios.
 *   - ReactiveFormsModule: habilita FormGroup/FormControl para formularios reactivos.
 *   - RouterModule: habilita routerLink, routerLinkActive, router-outlet en templates.
 *   - MatTableModule + MatPaginatorModule + MatSortModule: tabla Material con
 *     paginación y ordenamiento.
 *   - MatDialogModule: modales de confirmación (EliminarUserModal).
 *   - NgxMaskDirective / NgxMaskPipe: máscaras de entrada (teléfono, RFC, CURP).
 *   - BaseChartDirective: directiva de ng2-charts para renderizar gráficas Chart.js.
 */

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  NgOptimizedImage,
  RouterModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatRadioModule,
  MatDatepickerModule,
  MatSelectModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSidenavModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  NgxMaskDirective,
  NgxMaskPipe,
  NgClass,
  MatDialogModule,
  BaseChartDirective,
 ];
