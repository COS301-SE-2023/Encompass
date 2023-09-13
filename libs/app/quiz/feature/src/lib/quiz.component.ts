import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDto } from '@encompass/api/event/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import {
  UpdateEventRequest,
  UserEventsDto,
} from '@encompass/api/user-events/data-access';
import { EventState } from '@encompass/app/event/data-access';
import {
  GetEventById,
  GetUserEvents,
  UpdateUserEvent,
} from '@encompass/app/event/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ToastController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizPage {
  @Select(EventState.singleEvent) event$!: Observable<EventDto | null>;
  @Select(EventState.userEvents) userEvents$!: Observable<UserEventsDto | null>;
  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  event!: EventDto | null;
  profile!: ProfileDto | null;
  userEvents!: UserEventsDto | null;
  currentEvent!: UpdateEventRequest;

  userAnswers: string[] = [];

  numberOfQuestions!: number;
  numberOfParticipants!: number;

  fillPercentage = 0;
  fillNumber = 0;
  totalNumber = 15;
  LessThanHalf = true;
  MoreThanHalf = false;
  points = 0;

  isQuizFetched = false;
  isProfileFetched = false;
  isProfileEventFetched = false;

  isComplete = false;

  constructor(private route: ActivatedRoute, private store: Store, private router: Router, private toastController: ToastController) {
    const quizId = this.route.snapshot.paramMap.get('id');

    if (quizId == null) {
      return;
    }

    if (!this.isQuizFetched) {
      this.isQuizFetched = true;

      this.store.dispatch(new GetEventById(quizId));
      this.event$.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
        if (event) {
          console.log(event);
          this.event = event;

          this.numberOfQuestions = event.quiz.length;
          this.numberOfParticipants = event.members.length;
          this.userAnswers = new Array(this.numberOfQuestions).fill(null);
         

          this.totalNumber = event.quiz.length;
        }
      });
    }

    if (!this.isProfileFetched) {
      this.isProfileFetched = true;

      this.store.dispatch(new SubscribeToProfile());
      this.profile$.pipe(takeUntil(this.unsubscribe$)).subscribe((profile) => {
        if (profile) {
          console.log(profile);
          this.profile = profile;

          if (!this.isProfileEventFetched) {
            this.isProfileEventFetched = true;
            // console.log(profile._id);
            this.store.dispatch(new GetUserEvents(profile._id));
            this.userEvents$
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((userEvents) => {
                if (userEvents) {
                  console.log(userEvents);
                  this.userEvents = userEvents;

                  userEvents.events.forEach((element) => {
                    if (element.eventId === quizId) {
                      this.currentEvent = element;
                      element.userAnswers.forEach((answer, index) => {
                        this.userAnswers[index] = answer;

                        if (answer === this.event?.quiz[index].answer) {
                          this.fillCircle();
                        }
                      })
                    }
                  });
                }
              });
          }

          if(!this.event?.members.includes(profile.username)){
            this.presentToast()
          }
        }
      });
    }

    
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You are not a member of this event',
      duration: 2000,
      color: 'danger'
    });

    await toast.present();

    this.router.navigate(['']);
  }

  answerQuestion(questionIndex: number, answer: string) {
    let numCorrect = this.currentEvent.numCorrect;

    if (this.event === null || this.event === undefined) {
      return;
    }

    if (answer === null) {
      return;
    }

    this.userAnswers[questionIndex] = answer;

    if (answer === this.event.quiz[questionIndex].answer) {
      numCorrect++;

      this.fillCircle();
    }
    

    this.isComplete = !this.userAnswers.some((el) => el === null);

    const updateEvent: UpdateEventRequest = {
      eventId: this.event._id,
      userAnswers: this.userAnswers,
      numCorrect: numCorrect,
      quizComplete: this.isComplete,
    };

    if (this.profile === null || this.profile === undefined) {
      return;
    }

    this.store.dispatch(new UpdateUserEvent(this.profile._id, updateEvent));
  }

  fillCircle() {
    this.fillPercentage += 1 / this.totalNumber; // Increase by 1/totalNumber
    this.fillNumber += 1;
    this.points += 50;
    if (this.fillPercentage >= 1) {
      this.fillPercentage = 0;
      this.fillNumber = 0;
      this.LessThanHalf = true;
      this.MoreThanHalf = false;
      this.points = 0;
    }

    if (this.fillNumber > Math.floor(this.totalNumber / 2) + 1) {
      this.LessThanHalf = false;
      this.MoreThanHalf = true;
    }
  }

  backToEvents(){
    this.router.navigate(['home/event']);
  }
}
