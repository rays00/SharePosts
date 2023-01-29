import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: any

  loadPosts() {
    return this.http.get<any>('/api/posts/').subscribe((data: any) => {
      data.sort((postA: any, postB: any) => postB.time.localeCompare(postA.time))
      this.posts = data
    });
  }

  getPosts() {
    return this.posts
  }

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    this.loadPosts()
  }

  editNewPost(post: any) {
    return this.http.put<any>(`/api/posts/${post.id}`, post, this.getAuthHeader())
  }

  addNewPost(post: any) {
    return this.http.post<any>("/api/posts/", post, this.getAuthHeader())
  }

  deletePost(id: string) {
    return this.http.delete<any>(`/api/posts/${id}`, this.getAuthHeader())
  }

  private getAuthHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.authenticationService.getCookie("AUTH")
      })
    }
  }

}
