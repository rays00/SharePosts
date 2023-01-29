import { Component, Input } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../dialog/dialog.component';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() post: any

  constructor(private postService: PostService, private modalService: NgbModal, private http: HttpClient, private authenticationService: AuthenticationService) {}

  ownPost(userId: string) {
    let currentUserId = this.authenticationService.getCurrentUserId()
    if (currentUserId) {
      return userId == currentUserId
    }
    return false
  }

  deletePost(postId: any) {
    this.postService.deletePost(postId).subscribe({
      next: (v) => {
        this.postService.loadPosts()
        Swal.fire({
          title: 'Done!',
          text: 'Your post is deleted',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      },
      error: (e) => {
        Swal.fire({
          title: 'Error!',
          text: e.error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }

  editPost(post: any) {
    let modalRef = this.modalService.open(DialogComponent);
    modalRef.componentInstance.postForm.setValue({
      id: post._id,
      title: post.title,
      description: post.description
    })
  }

}
