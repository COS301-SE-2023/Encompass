import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LeaderboardComponent } from '@encompass/app/leaderboard/feature';
import { Select, Store } from '@ngxs/store';
import { ProfileLeaderboardDto } from '@encompass/api/profile-leaderboard/data-access';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EventState } from '@encompass/app/event/data-access';
import { GetLeaderboard } from '@encompass/app/event/util';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';


@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventPage {
  @Select(EventState.leaderboard) leaderboard$!: Observable<ProfileLeaderboardDto[] | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  profile!: ProfileDto | null;
  leaderboard!: ProfileLeaderboardDto[] | null;
  topFive!: ProfileLeaderboardDto[] | null;

  isLeaderboardFetched = false;

  constructor(private formBuilder: FormBuilder,private modalController: ModalController, private store: Store, private router: Router) {
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((profile) => {
      if(profile){
        this.profile = profile;
      }
    })
  }
  ngOnInit() {
    if(!this.isLeaderboardFetched){
      this.isLeaderboardFetched = true;

      this.store.dispatch(new GetLeaderboard());
      this.leaderboard$.pipe(takeUntil(this.unsubscribe$)).subscribe((leaderboard) => {
        if(leaderboard){
          console.log(leaderboard);
          this.leaderboard = leaderboard;
          this.topFive = leaderboard.slice(0, 5);
        }
      })
    }
  }
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  GoToProfile(username: string) {
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

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
