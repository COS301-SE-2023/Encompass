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

  // ngOnInit(){
  //   this.store.dispatch(new SubscribeToProfile());
  //   this.profile$.subscribe((profile) => {
  //     if(profile){
  //       console.log(profile);
  //       this.profile = profile;
  //     }
  //   })
  // }
  // @Select(actionsExecuting([CreatePost]))
  postForm = this.formBuilder.group({
    title: ['', [ Validators.required, Validators.maxLength(100)]],
    text: ['', Validators.maxLength(1000)],
    community: ['', Validators.required],
    category: [[]]
  });

  get title() {
    return this.postForm.get('title');
  }

  get text() {
    return this.postForm.get('text');
  }

  get community() {
    return this.postForm.get('community');
  }

  get category() {
    return this.postForm.get('category');
  }

  onSubmit() {
    let communityData : string;
    let titleData : string;
    let textData : string;
    let categoryData : string[] | null;

    if(this.community?.value == null || this.community?.value == undefined){
      communityData = "";
    }

    else{
      communityData = this.community?.value;
    }

    if(this.title?.value == null || this.title?.value == undefined){
      titleData = "";
    }

    else{
      titleData = this.title?.value;
    }

    if(this.text?.value == null || this.text?.value == undefined){
      textData = "";
    }

    else{
      textData = this.text?.value;
    }

    if(this.category?.value == null || this.category?.value == undefined){
      categoryData = null;
    }

    else{
      categoryData = this.category?.value;
    }

    const data = {
      community: communityData,
      title: titleData,
      text: textData, 
      username: this.profile.username,
      imageUrl: null,
      categories: categoryData,
      likes: null,
      spoiler: false,
      ageRestricted: false
    };

    this.store.dispatch(new CreatePost(data));
  }

  displayText() {
    console.log(this.title?.value);
    console.log(this.text?.value);
    console.log(this.community?.value);
    console.log(this.category?.value);
  }

  closePopup() {
    this.modalController.dismiss();
  }


   
  
}
