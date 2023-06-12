import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.scss']
})
export class CreateCommunityComponent {

  constructor(private modalController: ModalController) {}

  closePopup() {
    this.modalController.dismiss();
  }

}
