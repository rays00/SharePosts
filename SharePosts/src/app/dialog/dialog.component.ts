import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../post.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(public activeModal: NgbActiveModal, private postService: PostService) {}

  postForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    id: new FormControl('')
  });

  postOnSubmit() {
    let post = {
      "title": this.postForm.value.title,
      "description": this.postForm.value.description,
      "id": this.postForm.value.id,
    }

    if (post.id) {
      this.postService.editNewPost(post).subscribe({
        next: (v) => {
          this.postService.loadPosts()
          Swal.fire({
            title: 'Done!',
            text: 'Your post is now updated',
            icon: 'success',
            confirmButtonText: 'OK'
          })
        },
        error: (e) => {
          Swal.fire({
            title: 'Error!',
            text: "An error has occured",
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      })
      return
    }

    this.postService.addNewPost(post).subscribe({
      next: (v) => {
        this.postService.loadPosts()
        Swal.fire({
          title: 'Done!',
          text: 'Your post is now visible',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      },
      error: (e) => {
        Swal.fire({
          title: 'Error!',
          text: "An error has occured",
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }
}
