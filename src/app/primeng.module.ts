import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

const myModule = [
  ChartModule,
  DialogModule,
  ButtonModule,
  MessagesModule,
  MessageModule,
  ToastModule,
  TableModule,
  CheckboxModule,
  EditorModule,
  ProgressSpinnerModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myModule],
  exports: [myModule],
})
export class PrimeNGModule {}
