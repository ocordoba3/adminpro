import { NgModule } from '@angular/core';

// Components
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';

// Modulos
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  declarations: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent
  ],
  exports: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent
  ]
})
export class SharedModule { }