import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventPage {
  constructor(private formBuilder: FormBuilder) {}

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
  messageForm = this.formBuilder.group({
    messageInput: ['', Validators.maxLength(150)],
  });
}
