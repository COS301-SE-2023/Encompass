import { Component } from '@angular/core';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsPage{
  labelHidden = true;

  toggleLabel(show: boolean) {
    this.labelHidden = !show;
  }

  eventChange(btnName : string){
    const accBtn = document.getElementById('accBtn');
    const proBtn = document.getElementById('proBtn');
    const notBtn = document.getElementById('notBtn');
    const messBtn = document.getElementById('messBtn');
    const secBtn = document.getElementById('secBtn');
    const privBtn = document.getElementById('privBtn');

    if (accBtn && proBtn && notBtn && messBtn && secBtn && privBtn) {
      if (btnName == 'accBtn'){
        accBtn.classList.add('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        secBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'proBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.add('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        secBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'notBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.add('active-button');
        messBtn.classList.remove('active-button');
        secBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'messBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.add('active-button');
        secBtn.classList.remove('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'secBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        secBtn.classList.add('active-button');
        privBtn.classList.remove('active-button');
      }

      if (btnName == 'privBtn'){
        accBtn.classList.remove('active-button');
        proBtn.classList.remove('active-button');
        notBtn.classList.remove('active-button');
        messBtn.classList.remove('active-button');
        secBtn.classList.remove('active-button');
        privBtn.classList.add('active-button');
      }
      
    }
  }

}
