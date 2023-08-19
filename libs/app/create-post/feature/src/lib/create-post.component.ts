import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, ModalController} from '@ionic/angular';
// import './create-post.component.scss';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreatePost, UploadFile } from '@encompass/app/create-post/util';
import { Select, Store } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { CreatePostApi, CreatePostState } from '@encompass/app/create-post/data-access';
import { PostDto } from '@encompass/api/post/data-access';
import { HttpClient } from '@angular/common/http';
import { fileReturn } from '@encompass/app/create-post/data-access';
import { IonSelect } from '@ionic/angular';
import { calendarPopoverComponent } from '@encompass/app/calendarPopover/feature';


@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  categories: string[]=["Action", "Adventure", "Animation", "Anime", "Arts", "Business",
   "Comedy", "Documentary", "Drama", "Fantasy", "Geography", "History", "Horror", 
   "Hospitality", "Life-Science", "Mathematics", "Musical", "Mystery", "Physics", 
   "Romance", "Science-Fiction", "War", "Western"]  

  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  // @Select(CreatePostState.url) url$! : Observable<string | null>;

  clickedButton = '';
  profile! : ProfileDto | null;
  hasImage = false;
  fileName! : string;
  file! : File;
  spoilers = false;
  agerestricted = false;
  isValid = false;
  inputValue! : string;
  inputValue2! : string;

  createPost=true;
  createEvent=false;

  constructor(private modalController: ModalController,private formBuilder: FormBuilder, private store: Store, private createPostApi: CreatePostApi, private popoverController: PopoverController) {
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
    category: [[] as string[], Validators.required]
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

  // async openPopover(event: any) {
  //   const popover = await this.popoverController.create({
  //     component: 'popovercontent', // Use a unique name for identification
  //     event,
  //     translucent: true,
  //     componentProps: {
  //       // You can pass any additional data to the popover here if needed
  //     },
  //   });
  
  //   await popover.present();
  // }

  

  async closePopover() {
    await this.popoverController.dismiss();
  }

   months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
   currentDate = new Date();
  
   formattedDate = `${this.months[this.currentDate.getMonth()]} ${this.currentDate.getDate()}, ${this.currentDate.getFullYear()}`;

  change(type: string){
    if(type=="Post"){
      this.createPost=true;
      this.createEvent=false;
    }
    else{
      this.createPost=false;
      this.createEvent=true;
    }
  }

  

  selections!: string[];

  limitSelection() {
    if(this.category?.value){
      this.selections=this.category?.value;
    }
    if(this.selections.length > 3){
      this.selections=this.selections.slice(0,3);
    }

    const newCategoryValues = this.selections;
    const categoryControl = this.postForm.get('category');
    if (categoryControl) { 
      categoryControl.patchValue(newCategoryValues);
    }
}

  Spoilers(){
    this.spoilers = !this.spoilers;
  }
  AgeRestricted(){
    this.agerestricted = !this.agerestricted;
  }
  checkInput(){
    if(this.community?.value == null || this.community?.value == undefined 
        || this.title?.value == null || this.title?.value == undefined
        || this.community?.value =="" || this.title?.value =="" ){

      this.isValid = false;
          // console.log(this.community?.value);
          // console.log(this.title?.value);
    }else{
      this.isValid = true;
    }
    
  }


  async onSubmit() {
    const emptyArray : string[] = [];

    let communityData : string;
    let titleData : string;
    let textData : string;
    let categoryData : string[] | null;
    let imageUrl : string | null = null;

    if(this.file && this.hasImage){
      imageUrl = await this.uploadFile();
      console.log(imageUrl);
    }

    else{
      imageUrl = null;
    }

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
      categoryData = emptyArray;
    }

    else{

      categoryData = this.category?.value;
    }

    if(this.profile == null || this.profile == undefined){
      return;
    }

    const data = {
      community: communityData,
      title: titleData,
      text: textData, 
      username: this.profile.username,
      imageUrl: imageUrl,
      communityImageUrl: null,
      categories: categoryData,
      likes: emptyArray,
      spoiler: this.spoilers,
      ageRestricted: this.agerestricted
    };
    console.log(data.imageUrl)
    this.store.dispatch(new CreatePost(data, this.profile));
    
  }

  

  closePopup() {
    this.modalController.dismiss();
  }

  insertImage() {
    this.hasImage = !this.hasImage;
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {
        this.file = file;
        this.fileName = file.name;
    }
  }

  // async uploadFile() : Promise<string | null>{
    
  //   return new Promise((resolve) =>{
  //     const formData = new FormData();
  //     formData.append('file', this.file, this.fileName);

  //     this.store.dispatch(new UploadFile(formData));
  //     this.url$.subscribe((response) => {
  //       if(response){
  //         console.log(response);
  //         resolve(response);
  //       }
  //     })
      
  //   })
    
  // }

  selectedDate!: string;

  markSelectedDate() {
    const selectedDateCell = document.querySelector(`.custom-datetime td[data-value="${this.selectedDate}"]`);
    if (selectedDateCell) {
      selectedDateCell.classList.add('selected-date');
    }
  }

  async uploadFile() : Promise<string | null>{
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', this.file, this.fileName);

      const uploadFile = this.createPostApi.uploadFile(formData)
      console.log(uploadFile);
      resolve(uploadFile);
    })
  }

  //async chooseDate() {
    // const modal = await this.modalController.create({
    //   component: calendarModal,
    //   cssClass: 'custom-modal', // Replace with the component or template for your popup
    //   componentProps: {
    //     // Add any input properties or data you want to pass to the popup component
    //   }
    // });
  
    

    // async openCalendarPopup() {
    //   const popOver = await this.popOverController.create({
    //     component: calendarPopoverComponent,
    //     cssClass: 'custom-modal', // Replace with the component or template for your popup
    //     componentProps: {
    //       id:  'popOverActivate'
    //       // Add any input properties or data you want to pass to the popup component
    //     }
    //   });
    
    //   return await popOver.present();
    // }

    // closeCalendarPopup() {
    //   this.popOverController.dismiss();
    // }
}
