import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { CommentsState } from "./comments.state";
import { CommentsApi } from './comments.api'

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([CommentsState])],
  providers: [CommentsApi],
})

export class CommentsModule{}