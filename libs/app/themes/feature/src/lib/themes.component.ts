import { Component } from '@angular/core';

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
    this.active = !this.active;
    if (this.active){
      console.log('active');
    }else{
      console.log('inactive');
    }
  }
}
