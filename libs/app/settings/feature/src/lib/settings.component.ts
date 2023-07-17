import { ProfileDto } from '@encompass/api/profile/data-access';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { GetUserSettings } from '@encompass/app/settings/util';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsPage{
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;

  profile!: ProfileDto | null;
  settings!: SettingsDto | null;

  @ViewChild(IonContent, { static: false })
  content!: IonContent;

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop, 500);
    }
  }


  labelHidden = true;

  constructor(private store: Store){
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if(profile){
        this.profile = profile;

        this.store.dispatch(new GetUserSettings(profile._id));
        this.settings$.subscribe((settings) => {
          if(settings){
            this.settings = settings;
          }
        })
      }
    })
  }

  toggleLabel(show: boolean) {
    this.labelHidden = !show;
  }

  eventChange(btnName : string){
    
    const accBtn = document.getElementById('accBtn');
    const proBtn = document.getElementById('proBtn');
    const notBtn = document.getElementById('notBtn');
    const messBtn = document.getElementById('messBtn');
    const privBtn = document.getElementById('privBtn');

    if (accBtn && proBtn && notBtn && messBtn && privBtn) {
      if (btnName == 'accBtn'){
        accBtn.classList.add('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'proBtn'){
        
        accBtn.classList.remove('active-button');
        proBtn.classList.add('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'notBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.add('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'messBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.add('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'privBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        privBtn.classList.add('active-button');
      }
      
    }else{
      if (accBtn == null){
        console.log('accBtn is null');
      }else if (proBtn == null){
        console.log('proBtn is null');
      }else if (notBtn == null){
        console.log('notBtn is null');
      }else if (messBtn == null){
        console.log('messBtn is null');
      }else if (privBtn == null){
        console.log('privBtn is null');
      }
    }
  }

}
