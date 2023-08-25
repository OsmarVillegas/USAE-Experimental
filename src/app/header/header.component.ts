import { Component } from '@angular/core';
import { AuthService, LogoutOptions } from '@auth0/auth0-angular';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(
    public auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  loginWithRedirect(): void {
    this.auth.loginWithRedirect({ appState: { target: '/admin' } });
  }

  logout(): void {
    this.auth.logout({ returnTo: window.location.origin } as LogoutOptions);
  }

  async descargaDocumentoAdmin() {
    try {
      const pdfUrl = '../../assets/formats/Manual_Para_Administrador.pdf';
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'Manual_De_Administrador.pdf';
      a.target = '_blank'; // Abre el enlace en una nueva ventana o pestaña (opcional)
      a.click();

      this.toastr.success(
        'Se ha descargado el manual de administrador',
        'Manual de administrador ha sido descargado',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          progressBar: true,
        }
      );

    } catch (err) {
      console.log(err);
    }
  }

  async descargaDocumentoUsuario() {
    try {
      const pdfUrl = 'https://experimental-kteg.vercel.app/api/files/Usuario';
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'Manual_De_Usuario.pdf';
      a.target = '_blank'; // Abre el enlace en una nueva ventana o pestaña (opcional)
      a.click();

      this.toastr.success(
        'Se ha descargado el manual de usuario',
        'Manual de usuario descargado',
        {
          timeOut: 5000,
          positionClass: 'toast-top-right',
          progressBar: true,
        }
      );

    } catch (err) {
      console.log(err);
    }
  }
  
}
