import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {


  imagenSubir: File;
  imagenTemp: any;

  constructor( public _subirArchivoService: SubirArchivoService,
               public _modalService: ModalUploadService ) { }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0) {
      swal( 'Formato inválido', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;


  }

  subirImagen( archivo: File) {

    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalService.tipo, this._modalService.id  )
      .then( resp => {
        this._modalService.notificacion.emit( resp );
        this.cerrarModal();
      })
      .catch( err => {
        console.log( 'Error en la carga...');
      });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;

    this._modalService.ocultarModal();
  }



}
