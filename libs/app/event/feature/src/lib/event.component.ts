import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LeaderboardComponent } from '@encompass/app/leaderboard/feature';
import { Select, Store } from '@ngxs/store';
import { ProfileLeaderboardDto } from '@encompass/api/profile/data-access';
import { Observable, Subject, filter, takeUntil } from 'rxjs';
import { EventState } from '@encompass/app/event/data-access';
import { GetEvents, GetLeaderboard, GetUserEvents } from '@encompass/app/event/util';
import { Router } from '@angular/router';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { EventDto } from '@encompass/api/event/data-access';
import { UserEventsDto } from '@encompass/api/user-events/data-access';


@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventPage {
  @Select(EventState.leaderboard) leaderboard$!: Observable<ProfileLeaderboardDto[] | null>;
  @Select(EventState.events) events$!: Observable<EventDto[] | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(EventState.userEvents) userEvents$!: Observable<UserEventsDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  profile!: ProfileDto | null;
  events!: EventDto[] | null;
  allEvents!: EventDto[] | null;
  userEvents!: UserEventsDto | null;
  leaderboard!: ProfileLeaderboardDto[] | null;
  topFive!: ProfileLeaderboardDto[] | null;

  isLeaderboardFetched = false;
  isEventsFetched = false;

  hasExpired: boolean[] = [];
  hasJoined: boolean[] = [];
  isPartOfCommunity: boolean[] = [];
  hasCompleted: boolean[] = [];
  found = false;
  mobileview = false;
  colSize = 0;
  loading = true;

  constructor(private formBuilder: FormBuilder,private modalController: ModalController, private store: Store, private router: Router) {
    this.store.dispatch(new SubscribeToProfile());
    this.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((profile) => {
      if(profile){
        this.profile = profile;

        if(!this.isEventsFetched){
          this.isEventsFetched = true;

          if(this.profile === null){
            return;
          }
          this.store.dispatch(new GetUserEvents(this.profile._id));
          this.userEvents$.pipe(takeUntil(this.unsubscribe$)).subscribe((userEvents) => {
            if(userEvents){
              this.userEvents = userEvents;

              this.store.dispatch(new GetEvents(profile.communities));
              this.events$.pipe(takeUntil(this.unsubscribe$)).subscribe((events) => {
                if(events){
                  console.log(events)
                  this.allEvents = events;
                  this.events = events;
                  
                  for(let i=0;i<events.length;i++){
                    this.hasCompleted.push(false);
                    this.hasExpired.push(false);
                    this.hasJoined.push(false);
                  }
    
                  for(let i =0;i<events.length;i++){
                    if(events[i].members.includes(profile.username)){
                      this.hasJoined[i]=true;
                    }

                    if(this.daysLeft(events[i].endDate) == 0){
                      this.hasExpired[i]=true;
                    }
                   
                     userEvents.events.forEach((event) => {
                        if(event.eventId === events[i]._id){
                          console.log("!!!!!!!!!!!!!!!!!!!!FOUND "+events[i].name);
                          if(event.quizComplete){
                            this.hasCompleted[i]=true;
                          }
                        }
                      })
                     

                      console.log("EVENT:");
                      console.log(events[i].name);
                      console.log("Joined: "+this.hasJoined[i]);
                      console.log("Expired: "+this.hasExpired[i]);
                      console.log("Completed: "+this.hasCompleted[i]);

                    }
                }
              })
            }
          })

         
        }

        this.loading = false;
      }
    })

    
  }
  ngOnInit() {

    this.updateMobileView();
    window.addEventListener('resize', this.updateMobileView.bind(this));

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

    // this.checkInput();
  }
  updateMobileView() {
    this.mobileview = window.innerWidth <= 992;
    if (this.mobileview) {
      this.colSize = 12.5;
    } else {
      this.colSize = 5;
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
  inputValue = '';

  sendMessage() {
    return;
  }
  checkInput() {
    if(this.allEvents === null){
      return;
    }
    let filterEvents = [...this.allEvents]

    filterEvents = this.allEvents.filter(event => {
      return event.name.toLowerCase().includes(this.inputValue.toLowerCase())
    })

    this.events = filterEvents;
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
