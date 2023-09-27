import { Component } from '@angular/core';

@Component({
  selector: 'help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
})
export class HelpPagePage {
  mobileview = false;

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }

  showFeed = false;
  showContent = false;
  showCommunity = true;
  showProfile = false;
  showSettings = false;
  showUsers = false;
  showSearch = false;
  showTheme = false;
  showEvnts = false;
  showMessage = false;
  showMenu = false;

  feed() {
    this.showFeed = true;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  content() {
    this.showFeed = false;
    this.showContent = true;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  community() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = true;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  profile() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = true;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  settings() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = true;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  user() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = true;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  search() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = true;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  theme() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = true;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = false;
  }

  events() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = true;
    this.showMessage = false;
    this.showMenu = false;
  }

  message() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = true;
    this.showMenu = false;
  }

  back() {
    this.showFeed = false;
    this.showContent = false;
    this.showCommunity = false;
    this.showProfile = false;
    this.showSettings = false;
    this.showUsers = false;
    this.showSearch = false;
    this.showTheme = false;
    this.showEvnts = false;
    this.showMessage = false;
    this.showMenu = true;
  }
}
