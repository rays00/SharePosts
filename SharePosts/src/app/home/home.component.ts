import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { PostService } from '../post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  isUpdating = false

  constructor(private postService: PostService, private modalService: NgbModal, private http: HttpClient, private router: Router, private authenticationService: AuthenticationService) {
  }

  get posts() {
    return this.postService.getPosts()
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn()
  }

  openModal() {
    this.modalService.open(DialogComponent);
  }
}
