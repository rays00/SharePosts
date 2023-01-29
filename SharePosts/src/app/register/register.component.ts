import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private http: HttpClient, private router: Router, private authenticationService: AuthenticationService) { }

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")])
  });

  registerOnSubmit() {
    const user = {
      "email": this.registerForm.value.email,
      "password": this.registerForm.value.password,
      "name": this.registerForm.value.name
    }

    if (user.password != this.registerForm.value.confirmPassword) {
      Swal.fire({
        title: 'Error!',
        text: 'Passwords must match',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }

    this.http.post<any>("/api/users/", user).subscribe({
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

  get form() {
    return this.registerForm.controls
  }
}
