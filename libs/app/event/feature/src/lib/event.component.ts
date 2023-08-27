import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LeaderboardComponent } from '@encompass/app/leaderboard/feature';


@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventPage {
  constructor(private formBuilder: FormBuilder,private modalController: ModalController,) {}

  categories = ['Action', 'Comedy', 'Fantasy'];
  events = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  isValid = false;
  inputValue!: string;

  sendMessage() {
    return;
  }
  checkInput() {
    return;
  }

  async openPopup() {
    const modal = await this.modalController.create({
      component: LeaderboardComponent,
      cssClass: 'custom-modal',
      componentProps: {
      },
    });

    return await modal.present();
  }

  messageForm = this.formBuilder.group({
    messageInput: ['', Validators.maxLength(150)],
  });
}
