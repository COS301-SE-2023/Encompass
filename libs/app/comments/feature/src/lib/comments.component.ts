import { Component } from '@angular/core';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
comment = false;
reply = false;
viewreply = false;


AddComment(){
  this.comment = !this.comment;
}

Reply(){
  this.reply = !this.reply;
}

viewReplies(){
  this.viewreply = !this.viewreply;
}
}
