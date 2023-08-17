import { Component } from '@angular/core';
import {PopoverController} from '@ionic/angular';


@Component({
  selector: 'calendarPopover',
  templateUrl: './calendarPopover.component.html',
  styleUrls: ['./calendarPopover.component.scss'],
})
export class calendarPopoverComponent {
  isPopoverOpen = false;
  constructor(private popoverController: PopoverController) {}

    // closePopup() {
    //   this.popoverController.dismiss();
    // };

 
};
