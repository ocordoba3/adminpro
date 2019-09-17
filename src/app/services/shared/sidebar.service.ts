import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

menu: any = [
  {
    titulo: 'Principal',
    icono: 'mdi mdi-gauge',
    submenu: [
      {titulo: 'Dashboard', url: '/dashboard'},
      {titulo: 'Gráficas', url: '/graficas1'},
      {titulo: 'ProgressBar', url: '/progress'},
      {titulo: 'Promesas', url: '/promesas'},
      {titulo: 'RXJS', url: '/rxjs'},

    ]
  },
  {
    titulo: 'Mantenimientos',
    icono: 'mdi mdi-folder-lock-open',
    submenu: [
      {titulo: 'Hospitales', url: '/hospitales'},
      {titulo: 'Medicos', url: '/medicos'},
      {titulo: 'Usuarios', url: '/usuarios'}
    ]
  }
];

  constructor() { }
}
