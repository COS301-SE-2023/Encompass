import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  RendererFactory2,
  Injectable,
  Renderer2,
} from '@angular/core';
import { ProfileDto } from '@encompass/api/profile/data-access';
import {
  SettingsDto,
  ThemesSettingsDto,
} from '@encompass/api/settings/data-access';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ThemesApi, ThemesState } from '@encompass/app/themes/data-access';
import { GetUserSettings, UpdateThemes } from '@encompass/app/themes/util';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
})
export class ThemesPage {
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(ThemesState.settings) settings$!: Observable<SettingsDto | null>;

  file!: File;
  fileName!: string;
  profile!: ProfileDto | null;
  settings!: SettingsDto | null;

  activeButton!: string;
  loading = true;

  changeBorder(btnName: string) {
    const btn = document.getElementById(btnName);
    const activeBtn = document.getElementById(this.activeButton);

    if (btn && this.activeButton !== btnName) {
      if (activeBtn) {
        activeBtn.style.border = 'none';
      }
      if (btnName.startsWith('dark')) {
        btn.style.border = '4px solid var(--ion-color-warning-contrast)';
      } else {
        btn.style.border = '4px solid var(--ion-color-warning)';
      }

      this.activeButton = btnName;
    }
  }

  activeImage = '';

  changeBorderImage(imgName: string, url: string) {
    const btn = document.getElementById(imgName);
    const activeImg = document.getElementById(this.activeImage);
    const page = document.getElementById('theme-page');

    if (btn && this.activeImage !== imgName && page) {
      if (activeImg) {
        activeImg.style.border = 'none';
      }
      btn.style.border = '4px solid var(--ion-color-warning)';
      this.activeImage = imgName;
      page.style.backgroundImage = `url(${url})`;
    } else if (btn && this.activeImage === imgName && page) {
      btn.style.border = 'none';
      this.activeImage = '';
      page.style.backgroundImage = `none`;
      url = '';
    }

    if (this.settings === null || this.profile === null) {
      return;
    }

    const data: ThemesSettingsDto = {
      themeImage: url,
      themeColor: this.settings?.themes.themeColor,
    };

    this.store.dispatch(new UpdateThemes(this.profile?._id, data));
  }

  active = false;
  getImg() {
    const fileInput = document.getElementById('backgroundFile');
    this.active = !this.active;
    if (this.active) {
      if (fileInput) {
        fileInput.style.display = 'none';
        this.active = false;
      }
    } else {
      if (fileInput) {
        fileInput.style.display = 'block';
        this.active = true;
      }
    }
  }

  profilePictureUrl = '';

  async onProfilePictureSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.fileName = file.name;
    }

    if (this.settings === null || this.profile === null) {
      return;
    }

    let imageUrl: string | null;

    imageUrl = await this.uploadFile();

    if (imageUrl == null) {
      imageUrl = this.settings?.themes.themeImage;
    }

    const data: ThemesSettingsDto = {
      themeImage: imageUrl,
      themeColor: this.settings?.themes.themeColor,
    };

    this.store.dispatch(new UpdateThemes(this.profile?._id, data));
    this.profilePictureUrl = imageUrl;

    const page = document.getElementById('theme-page');
    if (page) {
      page.style.backgroundImage = `url(${this.profilePictureUrl})`;
    }
  }

  async uploadFile(): Promise<string | null> {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append('file', this.file, this.fileName);

      const uploadFile = this.themesApi.uploadFile(formData);
      // console.log(uploadFile);
      resolve(uploadFile);
    });
  }

  renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private store: Store,
    private themesApi: ThemesApi
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.store.dispatch(new SubscribeToProfile());
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.profile = profile;

        this.store.dispatch(new GetUserSettings(profile._id));
        this.settings$.subscribe((settings) => {
          if (settings) {
            // console.log(settings);
            this.settings = settings;

            const page = document.getElementById('theme-page');
            if (page) {
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
              this.document.body.setAttribute(
                'color-theme',
                this.settings.themes.themeColor
              );
              this.activeButton = this.settings.themes.themeColor;

              const btn = document.getElementById(this.activeButton);

              if (btn !== null) {
                if (this.activeButton.startsWith('dark')) {
                  btn.style.border =
                    '4px solid var(--ion-color-warning-contrast)';
                } else {
                  btn.style.border = '4px solid var(--ion-color-warning)';
                }
              }

              const activeBackground = this.settings.themes.themeImage;
              let background;

              if (
                activeBackground ==
                'https://wallpapercave.com/dwp2x/wp10352811.jpg'
              ) {
                background = 'img-purple';
              } else if (
                activeBackground ==
                'https://wallpapercave.com/dwp2x/wp7857731.jpg'
              ) {
                background = 'img-red';
              } else if (
                activeBackground ==
                'https://wallpapercave.com/dwp2x/wp9339593.jpg'
              ) {
                background = 'img-blue';
              } else if (
                activeBackground ==
                'https://wallpapercave.com/dwp2x/wp10352814.jpg'
              ) {
                background = 'img-green';
              } else if (
                activeBackground ==
                'https://wallpapercave.com/dwp2x/wp10352821.jpg'
              ) {
                background = 'img-orange';
              } else {
                background = 'img-own';
              }

              const button = document.getElementById(background);

              if (button) {
                button.style.border = '4px solid var(--ion-color-warning)';
              }
              this.activeImage = background;
            }

            this.loading = false;
          }
        });
      }
    });
  }

  enableDark() {
    const color = 'dark';

    this.document.body.setAttribute('color-theme', 'dark');
    this.updateThemeColour(color);
  }

  enableLight() {
    const color = 'light';
    this.document.body.setAttribute('color-theme', 'light');
    this.updateThemeColour(color);
  }

  enableDarkRed() {
    const color = 'dark-red';

    this.document.body.setAttribute('color-theme', 'dark-red');
    this.updateThemeColour(color);
  }

  enableLightRed() {
    const color = 'light-red';

    this.document.body.setAttribute('color-theme', 'light-red');
    this.updateThemeColour(color);
  }

  enableDarkBlue() {
    const color = 'dark-blue';
    // console.log('here');
    this.document.body.setAttribute('color-theme', 'dark-blue');
    this.updateThemeColour(color);
  }

  enableLightBlue() {
    const color = 'light-blue';

    this.document.body.setAttribute('color-theme', 'light-blue');
    this.updateThemeColour(color);
  }

  enableDarkGreen() {
    const color = 'dark-green';

    this.document.body.setAttribute('color-theme', 'dark-green');
    this.updateThemeColour(color);
  }

  enableLightGreen() {
    const color = 'light-green';

    this.document.body.setAttribute('color-theme', 'light-green');
    this.updateThemeColour(color);
  }

  enableDarkOrange() {
    const color = 'dark-orange';

    this.document.body.setAttribute('color-theme', 'dark-orange');
    this.updateThemeColour(color);
  }

  enableLightOrange() {
    const color = 'light-orange';

    this.document.body.setAttribute('color-theme', 'light-orange');
    this.updateThemeColour(color);
  }

  updateThemeColour(colour: string) {
    if (this.settings == null || this.profile == null) {
      return;
    }

    const data: ThemesSettingsDto = {
      themeImage: this.settings.themes.themeImage,
      themeColor: colour,
    };

    this.store.dispatch(new UpdateThemes(this.profile?._id, data));
  }

  mobileview = false;

  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
  }

  ngOnInit() {
    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));
  }
}
