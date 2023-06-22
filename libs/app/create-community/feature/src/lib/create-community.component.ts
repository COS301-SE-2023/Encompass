import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import './create-post.component.scss';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePost } from '@encompass/app/create-post/util';
import { Select, Store } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';

@Component({
  selector: 'create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss']
})
export class CreateCommunityComponent {

  communities: string[] =["Hobbits and all thatsdadwadawda","Community2222"]; // Replace with the actual type of the communities array
  categories: string[]=["Movies","Mathematics","Action","Science-Fiction"
  ,"Drama","Romance","Anime","Books","Hospitality","Animation","Documentary"
  ,"Physics","Geography","Series","Western","Mystery","Fantasy","Life-Science"
  ,"War","IT","Arts","Business","Musical","Horror","Adventure","History","Comedy"]; 

  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;

  profile! : ProfileDto;

  constructor(private modalController: ModalController,private formBuilder: FormBuilder, private store: Store) {
      if(!this.profile){
      this.store.dispatch(new SubscribeToProfile());
      this.profile$.subscribe((profile) => {
        if(profile){
          console.log(profile);
          this.profile = profile;
        }
      })
    }
  }

  postForm = this.formBuilder.group({
    title: ['', [ Validators.required, Validators.maxLength(100)]],
    text: ['', Validators.maxLength(1000)],
    community: ['', Validators.required],
    category: [[]]
  });


  
  onSubmit(){
    console.log(this.postForm.value);
  }
  closePopup() {
    this.modalController.dismiss();
  }

}
