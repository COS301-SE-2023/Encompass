import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommentDto } from "@encompass/api/comment/data-access";

@Injectable()
export class CommentsApi{
  constructor(private httpClient: HttpClient){}

  async getComments(postId: string){
    try{
      const response = await this.httpClient.get<CommentDto[]>('/api/comment/get-post-comments/' + postId).toPromise();

      return response;
    }

    catch(error){
      console.log(error);

      return null;
    }
  }
}