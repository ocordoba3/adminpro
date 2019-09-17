import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde = 0;
  totalRegistros = 0;
  cargando = true;

  constructor( public _usuarioService: UsuarioService,
               public _modalService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalService.notificacion
      .subscribe( resp => this.cargarUsuarios() );
  }

  cargarUsuarios() {

    this._usuarioService.cargarUsuarios( this.desde )
      .subscribe( (resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
            });

  }

  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    console.log( termino );
    this._usuarioService.buscarUsuarios( termino )
      .subscribe( (usuarios: Usuario[]) => {

        this.usuarios = usuarios;
        this.cargando = false;

      });
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this._usuarioService.usuario._id ) {
      swal( 'Acción indebida', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'De borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then( borrar => {
      console.log( borrar );

      if (borrar) {

        this._usuarioService.borrarUsuario( usuario._id )
          .subscribe( resp => {
            console.log( resp );
            this.cargarUsuarios();

          });

      }
    });

  }

  guardar( usuario: Usuario ) {

    this._usuarioService.actualizarUsuario( usuario )
      .subscribe();
  }

  mostrarModal( id: string ) {

    this._modalService.mostrarModal( 'usuarios', id );

  }

}
