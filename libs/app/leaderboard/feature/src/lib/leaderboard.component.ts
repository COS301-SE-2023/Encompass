import { Component } from '@angular/core';
import { ProfileLeaderboardDto } from '@encompass/api/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { EventState } from '@encompass/app/event/data-access';
import { GetLeaderboard } from '@encompass/app/event/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  @Select(EventState.leaderboard) leaderboard$!: Observable<ProfileLeaderboardDto[] | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  profile!: ProfileDto | null;
  leaderboard!: ProfileLeaderboardDto[] | null;
  topThree!: ProfileLeaderboardDto[] | null;

  isLeaderboardFetched = false;

  constructor(private modalController: ModalController, private store: Store, private router: Router) { 
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
          this.leaderboard = leaderboard.slice(3);
          this.topThree = leaderboard.slice(0, 3);
        }
      })
    }
  }
  
  getOrdinalSuffix(n: number): string {
    if (n % 100 >= 11 && n % 100 <= 13) {
      return 'th';
    }
    switch (n % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
  
  GoToProfile(username: string) {
    this.closePopup();
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 

  closePopup() {
    this.modalController.dismiss();
  }
}
