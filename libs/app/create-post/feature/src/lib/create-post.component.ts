import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import './create-post.component.scss';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import the FormsModule
import { Select } from '@ngxs/store';
import { CreatePost } from '@encompass/app/create-post/util';
import {
  ActionsExecuting,
  actionsExecuting
} from '@ngxs-labs/actions-executing';



@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  // postForm: FormGroup | undefined;
  communities: string[] =["Hobbits and all thatsdadwadawda","Community2222"]; // Replace with the actual type of the communities array
  categories: string[]=["Movies","Mathematics","Action","Science-Fiction"
  ,"Drama","Romance","Anime","Books","Hospitality","Animation","Documentary"
  ,"Physics","Geography","Series","Western","Mystery","Fantasy","Life-Science"
  ,"War","IT","Arts","Business","Musical","Horror","Adventure","History","Comedy"];   

  
  constructor(private modalController: ModalController,private formBuilder: FormBuilder) { 
  }
  // @Select(actionsExecuting([CreatePost]))
  postForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(250)]],
    text: ['', Validators.maxLength(1000)],
    community: ['', Validators.required],
    categories: [[]]
  });

  // ngOnInit() {
   
  // }
  
  // title: string = '';

  get title() {
    return this.postForm.get('title');
  }

  onSubmit() {
    console.log(this.title);
  }

  displayText() {
    console.log(this.title?.value);
  }

  closePopup() {
    this.modalController.dismiss();
  }


   
  
}
