import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private router: Router, private authenticationService: AuthenticationService) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  loginOnSubmit() {
    const user = {
      "email": this.loginForm.value.email,
      "password": this.loginForm.value.password,
    }
    this.http.post<any>("/api/users/login", user).subscribe({
      next: (v) => {
        this.router.navigateByUrl('/')
        this.authenticationService.setCookie("AUTH", v.token, 1)
      },
      error: (e) => {
        Swal.fire({
          title: 'Error!',
          text: e.error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
     }
    )
  }
}
