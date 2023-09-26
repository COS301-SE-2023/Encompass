import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { PostsState } from "./posts.state";
import { PostsApi } from "./posts.api";

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([PostsState])],
  providers: [PostsApi],
})

export class PostsModule{}