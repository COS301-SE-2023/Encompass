
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Component } from '@angular/core';


@Component({
    selector: 'challenge-description',
    templateUrl: './challenge-description.component.html',
    styleUrls: ['./challenge-description.component.scss']
  })
  export class ChallengeDescriptionComponent {
  
    @ViewChild(IonContent, { static: false })
    content!: IonContent;

    //fuctions here
    

  }