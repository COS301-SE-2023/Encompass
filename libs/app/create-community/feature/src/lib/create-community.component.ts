import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import './create-post.component.scss';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateCommunity } from '@encompass/app/create-community/util';
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
    category: [[]]
  });


  get title() {
    return this.postForm.get('title');
  }

  get category() {
    return this.postForm.get('category');
  }

  onSubmit() {
    let communityData : string;
    let titleData : string;
    let textData : string;
    let categoryData : string[] | null;



    if(this.title?.value == null || this.title?.value == undefined){
      titleData = "";
    }

    else{
      titleData = this.title?.value;
    }

    
    if(this.category?.value == null || this.category?.value == undefined){
      categoryData = null;
    }

    else{
      categoryData = this.category?.value;
    }

    const data = {
      title: titleData,
      username: this.profile.username,
      imageUrl: null,
      categories: categoryData,
      ageRestricted: false
    };

    this.store.dispatch(new CreateCommunity(data));
  }
  

  closePopup() {
    this.modalController.dismiss();
  }

}
