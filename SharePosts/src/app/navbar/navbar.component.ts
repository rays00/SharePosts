import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private authenticationService:AuthenticationService) {}

  isLoggedIn() {
    return this.authenticationService.isLoggedIn()
  }

  logout() {
    this.authenticationService.deleteCookie("AUTH")
  }
}
