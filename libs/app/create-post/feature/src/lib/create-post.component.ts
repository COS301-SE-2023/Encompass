import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import './create-post.component.scss';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import the FormsModule



@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup | undefined;
  communities: any[] =['Hobbits and all thatsdadwadawda','Community2222']; // Replace with the actual type of the communities array
  categories: any[]=["Mathematics","Information-Technology","Geography"]; 

  
  constructor(private modalController: ModalController,private formBuilder: FormBuilder) { 
  }
  
  ngOnInit() {
    this.postForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(250)]],
      text: ['', Validators.maxLength(1000)],
      community: ['', Validators.required],
      categories: [[]]
    });

  }
  
  onSubmit() {}

  closePopup() {
    this.modalController.dismiss();
  }


   
  
}
