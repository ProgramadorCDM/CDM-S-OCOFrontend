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
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { PickListModule } from 'primeng/picklist';
import { ListboxModule } from 'primeng/listbox';


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
  PanelModule,
  MenubarModule,
  PaginatorModule,
  SidebarModule,
  DropdownModule,
  ConfirmDialogModule,
  ScrollPanelModule,
  CardModule,
  DynamicDialogModule,
  ToolbarModule,
  PickListModule,
  ListboxModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myModule],
  exports: [myModule],
})
export class PrimeNGModule {}
