import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MessagesApi } from './messages.api';
import { NgxsModule } from '@ngxs/store';
import { MessagesState } from './messages.state';

@NgModule({
  imports: [CommonModule, HttpClientModule, NgxsModule.forFeature([MessagesState])],
  providers: [MessagesApi],
})

export class MessagesModule{}