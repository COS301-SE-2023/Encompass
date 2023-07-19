import { DOCUMENT } from '@angular/common';
import { Component, Inject, RendererFactory2, Injectable, Renderer2 } from '@angular/core';

@Component({
  selector: 'themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesPage {

  activeButton = 'ld';

  changeBorder(btnName:string){
    const btn = document.getElementById(btnName);
    const activeBtn = document.getElementById(this.activeButton);

    if (btn && this.activeButton !== btnName){
      if (activeBtn){
        activeBtn.style.border = 'none';
      }
      if (btnName.startsWith('d')){
        btn.style.border = '4px solid var(--ion-color-warning-contrast)';
      }else{
        btn.style.border = '4px solid var(--ion-color-warning)';
      }
      
      this.activeButton = btnName;
    }
  }

  activeImage = '';

  changeBorderImage(imgName:string, url:string){
    const btn = document.getElementById(imgName);
    const activeImg = document.getElementById(this.activeImage);
    const page = document.getElementById('theme-page');

    if (btn && this.activeImage !== imgName && page){

      if (activeImg){
      activeImg.style.border = 'none';
      }
      btn.style.border = '4px solid var(--ion-color-warning)';
      this.activeImage = imgName;
      page.style.backgroundImage = `url(${url})`;
    } else if (btn && this.activeImage === imgName && page){
      btn.style.border = 'none';
      this.activeImage = '';
      page.style.backgroundImage = `none`;
    }
    
  }

  active = false;
  getImg() {
    const fileInput = document.getElementById('backgroundFile');
    this.active = !this.active;
    if (this.active){
      console.log('active');
      if (fileInput){
        fileInput.style.display = 'none';
      }
    }else{
      console.log('inactive');
      if (fileInput){
        fileInput.style.display = 'block';
      }
    }
  }

  profilePictureUrl = '';

  onProfilePictureSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePictureUrl = e.target?.result as string;
  
        // Set the background image directly here
        const page = document.getElementById('theme-page');
        if (page) {
          page.style.backgroundImage = `url(${this.profilePictureUrl})`;
        }
      };
      reader.readAsDataURL(file);
      console.log('file: ', file);
    } 
  }

  renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2, @Inject(DOCUMENT) private document: Document) { 
    this.renderer = this.rendererFactory.createRenderer(null, null);

  }


  enableDark() {
    const color = "dark-purple";

    this.document.body.setAttribute('color-theme', 'dark');
  }

  enableLight() {
    const color = "light-purple";
    this.document.body.setAttribute('color-theme', 'light');
  }

  enableDarkRed() {
    const color = "dark-red";

    this.document.body.setAttribute('color-theme', 'dark-red');
  }

  enableLightRed() {
    const color = "light-red";

    this.document.body.setAttribute('color-theme', 'light-red');
  }

  enableDarkBlue() {
    const color = "dark-blue";

    this.document.body.setAttribute('color-theme', 'dark-blue');
  }

  enableLightBlue() {
    const color = "light-blue";

    this.document.body.setAttribute('color-theme', 'light-blue');
  }

  enableDarkGreen() {
    const color = "dark-green";

    this.document.body.setAttribute('color-theme', 'dark-green');
  }

  enableLightGreen() {
    const color = "light-green";

    this.document.body.setAttribute('color-theme', 'light-green');
  }

  enableDarkOrange() {
    const color = "dark-orange";

    this.document.body.setAttribute('color-theme', 'dark-orange');
  }

  enableLightOrange() {
    const color = "light-orange";

    this.document.body.setAttribute('color-theme', 'light-orange');
  }
  
}
