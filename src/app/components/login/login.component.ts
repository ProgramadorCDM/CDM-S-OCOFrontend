// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
//Servicios
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;
  roles: string[];
  loginForm: FormGroup;
  errorMessage: string;
  config: any = {
    logo: null,
    logoLogin: null,
    max: null,
    min: null,
    name_site: null,
    num_users: null,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private fb: FormBuilder,
    private messageService: MessageService,
    public configService: ConfigService
  ) {
    this.getConfig();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      usuario: new FormControl(null, Validators.required),
      password: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
    });
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }
  getConfig() {
    this.configService.getData().subscribe((data) => {
      this.config = data;
    });
  }
  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe(
      (data) => {
        console.log(data);
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.messageService.add({
          severity: 'success',
          summary: '¡¡¡Correcto!!!',
          detail: 'Se ha Logueado Correctamente',
        });
        this.reloadPage();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed:',
          detail: this.errorMessage,
        });
      }
    );
  }
  reloadPage() {
    window.location.replace('#/resume');
    window.location.reload();
  }
}
