import { NgModule } from "@angular/core";
import { CreatePostApi } from "./create-post.api";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgxsModule } from "@ngxs/store";
import { CreatePostState } from "./create-post.state";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([CreatePostState])],
  providers: [CreatePostApi],
})

export class CreatePostModule{}