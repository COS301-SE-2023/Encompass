import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LeaderboardComponent } from '@encompass/app/leaderboard/feature';
import { Select, Store } from '@ngxs/store';
import { ProfileLeaderboardDto } from '@encompass/api/profile-leaderboard/data-access';
import { Observable, Subject, takeUntil } from 'rxjs';
import { EventState } from '@encompass/app/event/data-access';
import { GetEvents, GetLeaderboard } from '@encompass/app/event/util';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { EventDto } from '@encompass/api/event/data-access';


@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventPage {
  @Select(EventState.leaderboard) leaderboard$!: Observable<ProfileLeaderboardDto[] | null>;
  @Select(EventState.events) events$!: Observable<EventDto[] | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  profile!: ProfileDto | null;
  events!: EventDto[] | null;
  leaderboard!: ProfileLeaderboardDto[] | null;
  topFive!: ProfileLeaderboardDto[] | null;

  isLeaderboardFetched = false;
  isEventsFetched = false;

  hasExpired = false;
  hasJoined = false;
  isPartOfCommunity = false;
  hasCompleted = false;


  constructor(private formBuilder: FormBuilder,private modalController: ModalController, private store: Store, private router: Router) {
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((profile) => {
      if(profile){
        this.profile = profile;

        if(!this.isEventsFetched){
          this.isEventsFetched = true;
          this.store.dispatch(new GetEvents(profile.communities));
          this.events$.pipe(takeUntil(this.unsubscribe$)).subscribe((events) => {
            if(events){
              console.log(events)
              this.events = events;
              for(let i =0;i<events.length;i++){
                if(events[i].members.includes(profile.username)){
                  this.hasJoined = true;
                }
                if(this.daysLeft(events[i].endDate) == 0){
                  this.hasExpired = true;
                }
                if(profile.communities.includes(events[i].community)){
                  this.isPartOfCommunity = true;
                }
              }
            }
          })
        }
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

  daysLeft(targetDateStr: Date): number {
    const currentDate = new Date();
    const targetDate = new Date(targetDateStr);
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference >= 0 ? daysDifference : 0;
  }

  categories = ['Action', 'Comedy', 'Fantasy'];
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

  async goToEvent(id: string){
    this.router.navigate(['home/challenge-description/' + id]);
  }

  messageForm = this.formBuilder.group({
    messageInput: ['', Validators.maxLength(150)],
  });
}
