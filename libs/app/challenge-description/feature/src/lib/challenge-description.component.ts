
import { ViewChild } from '@angular/core';
import { IonContent, ToastController } from '@ionic/angular';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { SubscribeToProfile, UpdateProfile } from '@encompass/app/profile/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { Observable } from 'rxjs';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { EventState } from '@encompass/app/event/data-access';
import { EventDto } from '@encompass/api/event/data-access';
import { AddUser, AddUserEvent, GetEventById, GetUserEvents } from '@encompass/app/event/util';
import { UserEventsDto } from '@encompass/api/user-events/data-access';


@Component({
    selector: 'challenge-description',
    templateUrl: './challenge-description.component.html',
    styleUrls: ['./challenge-description.component.scss']
  })
  export class ChallengeDescriptionComponent {
  
    @ViewChild(IonContent, { static: false })
    content!: IonContent;

    @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
    @Select(EventState.singleEvent) event$!: Observable<EventDto | null>;
    @Select(EventState.userEvents) userEvents$!: Observable<UserEventsDto | null>;

    profile!: ProfileDto | null;
    userEvents!: UserEventsDto | null;
    event!: EventDto | null;

    hasExpired = false;
    hasJoined = false;
    isPartOfCommunity = false;

    isProfileFetched = false;
    isEventFetched = false;
    isUserEventsFetched = false;

    isFound = false;
    hasCompleted = false;
    challengeId: string | null;
    mobileview = false;
    colSize=0;

    loading = true;

    constructor(private route: ActivatedRoute, private store: Store, private router: Router, private toastController: ToastController) {
      const challengeId = this.route.snapshot.paramMap.get('id');
      this.challengeId = challengeId;

      if(challengeId == null) {
        return;
      }

      if(!this.isProfileFetched){
        this.isProfileFetched = true;

        this.store.dispatch(new SubscribeToProfile());
        this.profile$.subscribe((profile) => {
          if (profile) {
            this.profile = profile;

            if(!this.isEventFetched){
              this.isEventFetched = true;
      
              this.store.dispatch(new GetEventById(challengeId));
              this.event$.subscribe((event) => {
                if (event) {
                  this.event = event;
      
                  if(this.daysLeft(event.endDate) == 0){
                    this.hasExpired = true;
                  }
      
                  if(event.members.includes(profile.username)){
                    this.hasJoined = true;
                  }

                  if(profile.communities.includes(event.community)){
                    this.isPartOfCommunity = true;
                  }

                  this.loading = false;
                }
              })
            }

            if(!this.isUserEventsFetched){
              this.isEventFetched = true;

              this.store.dispatch(new GetUserEvents(profile._id));
              this.userEvents$.subscribe((userEvents) => {
                if(userEvents){
                  this.userEvents = userEvents;

                  userEvents.events.forEach((event) => {
                    if(event.eventId === challengeId){
                      this.isFound = true;
                      this.hasCompleted = event.quizComplete;
                    }
                  })
                }
              })
            }
          }
        })
      }
    }

    daysLeft(targetDateStr: Date): number {
      const currentDate = new Date();
      const targetDate = new Date(targetDateStr);
      const timeDifference = targetDate.getTime() - currentDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return daysDifference >= 0 ? daysDifference : 0;
    }

    ngOnInit() {

      this.updateMobileView();
      window.addEventListener('resize', this.updateMobileView.bind(this));
    }
    updateMobileView() {
      this.mobileview = window.innerWidth <= 992;
      if (this.mobileview) {
        this.colSize = 12.5;
      } else {
        this.colSize = 5;
      }
    }
    goToQuiz(){
      if(this.challengeId == null){
        return
      }

      this.router.navigate(['home/quiz/' + this.challengeId]);
    }

    async joinChallenge(){
      if(this.event === null || this.profile === null){
        return;
      }

      this.hasJoined = true;

      await this.store.dispatch(new AddUser(this.event._id, this.profile.username))
      await this.store.dispatch(new AddUserEvent(this.event._id, this.profile._id))


      const data  = {
        username: this.profile.username,
        name: this.profile.name,
        lastName: this.profile.lastName,
        categories: this.profile.categories,
        communities: this.profile.communities,
        awards: this.profile.awards,
        events: [...this.profile.events, this.event._id],
        followers: this.profile.followers,
        following: this.profile.following,
        posts: this.profile.posts,
        reviews: this.profile.reviews,
        profileImage: this.profile.profileImage,
        profileBanner: this.profile.profileBanner,
        bio: this.profile.bio,
      }
  
      this.store.dispatch(new UpdateProfile(data, this.profile._id));

      const toast = await this.toastController.create({
        message: 'Event Joined',
        color: 'success',
        duration: 2000
      });
  
      await toast.present();
    }

    goToCommunity(event: Event){
      event.preventDefault(); 

      if(this.event === null){
        return;
      }
      this.router.navigate(['/home/community-profile/' + this.event.community]);
    }
  }