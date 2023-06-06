import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent {
  constructor(private modalController: ModalController) { }

  closePopup() {
    this.modalController.dismiss();
  }
}
