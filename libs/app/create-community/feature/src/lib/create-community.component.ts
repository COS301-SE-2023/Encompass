import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
// import './create-post.component.scss';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateCommunity,
  UploadFile,
} from '@encompass/app/create-community/util';
import { Select, Store } from '@ngxs/store';
import { ProfileState } from '@encompass/app/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { CreateCommunityRequest } from '@encompass/api/community/data-access';
import {
  CreateCommunityApi,
  CreateCommunityState,
} from '@encompass/app/create-community/data-access';

@Component({
  selector: 'create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss'],
})
export class CreateCommunityComponent {
  categories: string[] = [
    'Action',
    'Adventure',
    'Animation',
    'Anime',
    'Arts',
    'Business',
    'Comedy',
    'Documentary',
    'Drama',
    'Fantasy',
    'Geography',
    'History',
    'Horror',
    'Hospitality',
    'IT',
    'Life-Science',
    'Mathematics',
    'Musical',
    'Mystery',
    'Physics',
    'Romance',
    'Science-Fiction',
    'War',
    'Western',
  ];

  requiredFileType = ['image/png', 'image/jpg', 'image/jpeg'];

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  // @Select(CreateCommunityState.communityUrl) url$! : Observable<FileUpload | null>;

  profile!: ProfileDto;
  hasImage = false;
  ageRestricted = false;
  type = 'Public';
  fileName!: string;
  file!: File;
  inputValue!: string;
  inputValue2!: string;
  isValid!: boolean;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private store: Store,
    private createCommunityApi: CreateCommunityApi,
    private toastController: ToastController
  ) {
    if (!this.profile) {
      this.store.dispatch(new SubscribeToProfile());
      this.profile$.subscribe((profile) => {
        if (profile) {
          console.log(profile);
          this.profile = profile;
        }
      });
    }
  }

  postForm = this.formBuilder.group({
    title: ['', [Validators.required, Validators.maxLength(250)]],
    category: [[] as string[], Validators.required],
  });

  get title() {
    return this.postForm.get('title');
  }

  get category() {
    return this.postForm.get('category');
  }

  insertImage() {
    this.hasImage = !this.hasImage;
  }

  isAgeRestricted() {
    this.ageRestricted = !this.ageRestricted;
    // console.log(this.ageRestricted)
  }

  setPublic() {
    this.type = 'Public';
  }

  setPrivate() {
    this.type = 'Private';
  }

  setRestricted() {
    this.type = 'Restricted';
  }

  selections!: string[];

  checkInput() {
    if (
      this.title?.value == null ||
      this.title?.value == undefined ||
      this.category?.value == null ||
      this.category?.value == undefined ||
      this.title?.value == ''
    ) {
      this.isValid = false;
    } else {
      this.isValid = true;
    }

    if (this.category?.value) {
      this.selections = this.category?.value;
    }
    if (this.selections.length > 3) {
      this.selections = this.selections.slice(0, 3);
    }

    const newCategoryValues = this.selections;
    const categoryControl = this.postForm.get('category');
    if (categoryControl) {
      categoryControl.patchValue(newCategoryValues);
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }

  async onSubmit() {
    let communityData: string;
    let titleData: string;
    let textData: string;
    let categoryData: string[] | null;
    let imageUrl: string | null;


    const toast = await this.toastController.create({
      message: 'Creating Community',
      color: 'success'
    })

    toast.present();

    if (this.file) {
      imageUrl = await this.uploadFile();

      if (imageUrl == null) {
        imageUrl = '';
      }
    } else {
      imageUrl = '';
    }

    if (this.title?.value == null || this.title?.value == undefined) {
      titleData = '';
    } else {
      titleData = this.title?.value;
    }

    if (this.category?.value == null || this.category?.value == undefined) {
      categoryData = [];
    } else {
      categoryData = this.category?.value;
    }

    const data: CreateCommunityRequest = {
      name: titleData,
      type: this.type,
      admin: this.profile.username,
      about: 'Group Description',
      rules: '',
      groupImage: imageUrl,
      bannerImage: '',
      categories: categoryData,
      events: [],
      posts: [],
      members: [this.profile.username],
      ageRestricted: this.ageRestricted,
      communityEP: this.profile.ep,
    };

    this.store.dispatch(new CreateCommunity(data, this.profile));

    toast.dismiss();
    this.closePopup();
  }

  closePopup() {
    this.modalController.dismiss();
  }

  async uploadFile(): Promise<string | null> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', this.file, this.fileName);

      const uploadFile = this.createCommunityApi.uploadFile(formData);
      console.log(uploadFile);
      resolve(uploadFile);
    });
  }
}
