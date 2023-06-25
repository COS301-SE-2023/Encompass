import { Component } from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsPage{
  labelHidden = true;

  toggleLabel(show: boolean) {
    this.labelHidden = !show;
  }

}
