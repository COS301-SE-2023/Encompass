import { Component } from '@angular/core';

@Component({
  selector: 'themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesPage {
  scrollImages() {
    const container = document.querySelector('.images');
    if (container) {
      container.scrollLeft += container.clientWidth;
    }
  }
}
