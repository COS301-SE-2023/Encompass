import { Component } from '@angular/core';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfilePage {
  postChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.add('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.remove('active-button');
    }
      
    
  }

  commChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.add('active-button');
      eventBtn.classList.remove('active-button');
    }
  }

  eventChange(){
    const PostBtn = document.getElementById('PostBtn');
    const CommentsBtn = document.getElementById('CommentsBtn');
    const eventBtn = document.getElementById('eventBtn');

    if (PostBtn && CommentsBtn && eventBtn) {
      PostBtn.classList.remove('active-button');
      CommentsBtn.classList.remove('active-button');
      eventBtn.classList.add('active-button');
    }
  }
}
