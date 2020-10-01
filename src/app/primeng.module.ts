import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';


const myModule = [
  DialogModule,
  ButtonModule,
  MessagesModule,
  MessageModule,
  ToastModule,
  TableModule,
  CheckboxModule,
  ProgressSpinnerModule,
  InputTextModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myModule],
  exports: [myModule],
})
export class PrimeNGModule {}