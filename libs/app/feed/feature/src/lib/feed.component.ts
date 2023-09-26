import { Component, Inject } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable, takeUntil, pipe, Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import {
  GetRecommendedCommunities,
  GetRecommendedBooks,
  GetRecommendedMovies,
  UpdateCommunity,
} from '@encompass/app/home-page/util';
import { GetRecommendedPodcasts } from '@encompass/app/home-page/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import {
  ProfileDto,
  UpdateProfileRequest,
} from '@encompass/api/profile/data-access';
import { SubscribeToProfile, UpdateProfile } from '@encompass/app/profile/util';
import { ModalController, ToastController } from '@ionic/angular';
import { CreatePostComponent } from '@encompass/app/create-post/feature';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import { CreateCommunityComponent } from '@encompass/app/create-community/feature';
// import { UpdatePost } from '@encompass/app/home-page/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { DatePipe } from '@angular/common';
import {
  CommunityDto,
  UpdateCommunityRequest,
} from '@encompass/api/community/data-access';
import {
  MovieDto,
  PodcastDto,
} from '@encompass/api/media-recommender/data-access';
import { BookDto } from '@encompass/api/media-recommender/data-access';
import { strict } from 'assert';
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { PostsState } from '@encompass/app/posts/data-access';
import {
  DislikePostArray,
  GetAllPosts,
  GetLatestPosts,
  GetPopularPosts,
  LikePostArray,
  UpdatePostArray,
} from '@encompass/app/posts/util';


@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedPage {
  @ViewChild(IonContent, { static: false })
  content!: IonContent;

  scrollToTop() {
    const element = document.getElementById('header');
    if (element) {
      this.content.scrollToPoint(0, element.offsetTop, 500);
    }
  }

  @Select(ProfileState.profile) profile$!: Observable<ProfileDto | null>;
  @Select(PostsState.posts) homePosts$!: Observable<PostDto[] | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>;
  @Select(HomeState.getCommunities) communities$!: Observable<
    CommunityDto[] | null
  >;
  @Select(HomeState.getMovies) movies$!: Observable<MovieDto[] | null>;
  @Select(HomeState.getBooks) books$!: Observable<BookDto[] | null>;
  @Select(HomeState.getPodcasts) podcasts$!: Observable<PodcastDto[] | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  settings!: SettingsDto | null;
  profile!: ProfileDto | null;
  posts: PostDto[] = [];
  myCommunities!: CommunityDto[] | null;
  movies!: MovieDto[] | null;
  books!: BookDto[] | null;
  podcasts!: PodcastDto[] | null;

  BookTitle1!: string;
  BookTitle2!: string;
  BookAuthor1!: string;
  BookAuthor2!: string;

  BookGenres1!: string[];
  BookGenres2!: string[];
  myBookGenres1: string[] = [];
  myBookGenres2: string[] = [];
  

  MovieTitle1!: string;
  MovieTitle2!: string;

  PodcastTitle1!: string;
  PodcastTitle2!: string;

  MovieGenres1!: string[];
  MovieGenres2!: string[];
  myMovieGenres1: string[] = [];
  myMovieGenres2: string[] = [];

  PodcastGenres1!: string[];
  PodcastGenres2!: string[];
  myPodcastGenres1: string[] = [];
  myPodcastGenres2: string[] = [];

  reports: boolean[] = [];
  postReported: boolean[] = [];

  datesAdded: Date[] = [];
  comments: number[] = [];
  shares: number[] = [];
  likes: number[] = [];
  likedComments: boolean[] = [];
  sharing: boolean[] = [];
  size = 0;
  themeName!: string;
  colSize = 0;
  loading = true;

  isNewFetched = false;
  // type = "recommended";

  communitiesIsFetched = false;
  moviesIsFetched = false;
  booksIsFetched = false;
  podcastsIsFetched = false;
  postsIsFetched = false;
  settingsIsFetched = false;
  ShowBooks = true;
  ShowMovies = true;
  showPodcasts = true;
  mobileview = false;

  type = 'recommended';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private store: Store,
    private modalController: ModalController,
    private datePipe: DatePipe,
    private homeApi: HomeApi,
    private toastController: ToastController
  ) {
    this.load();
  }

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;
    }, 3500);
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

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    const page = document.getElementById('home-page');

    this.store.dispatch(new SubscribeToProfile());
    // this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if (profile) {
        console.log('Profile CALLED');
        console.log(profile);
        this.profile = profile;
        // this.addPosts("recommended");
        if(!this.isNewFetched){
          this.isNewFetched = true;
          this.newChange();
        }

        if (!this.settingsIsFetched) {
          this.settingsIsFetched = true;

          this.store.dispatch(new GetUserSettings(this.profile._id));

          this.settings$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((settings) => {
              if (settings) {
                this.settings = settings;

                this.document.body.setAttribute(
                  'color-theme',
                  this.settings.themes.themeColor
                );
                if (this.settings.themes.themeColor.startsWith('dark')) {
                  const icons = document.getElementById('genreicons');

                  if (icons) {
                    icons.style.filter = 'invert(1)';
                  }
                }

                this.themeName = this.settings.themes.themeColor;

                console.log(this.themeName);

                const defaultcloud = document.getElementById('cloud-default');
                const redcloud = document.getElementById('cloud-red');
                const bluecloud = document.getElementById('cloud-blue');
                const greencloud = document.getElementById('cloud-green');
                const orangecloud = document.getElementById('cloud-orange');

                if (
                  defaultcloud &&
                  redcloud &&
                  bluecloud &&
                  greencloud &&
                  orangecloud
                ) {
                  // console.log('default cloudsssssssssssssssssssssssssssssssss1');
                  console.log(this.themeName);
                  if (
                    this.themeName == 'light-red' ||
                    this.themeName == 'dark-red'
                  ) {
                    redcloud.classList.remove('visible');
                    defaultcloud.classList.add('visible');
                    bluecloud.classList.add('visible');
                    greencloud.classList.add('visible');
                    orangecloud.classList.add('visible');
                  } else if (
                    this.themeName == 'light-blue' ||
                    this.themeName == 'dark-blue'
                  ) {
                    // console.log('BLUEEEEEEEEEEEEEEEEEEEEEEEEEEEE');
                    bluecloud.classList.remove('visible');
                    defaultcloud.classList.add('visible');
                    redcloud.classList.add('visible');
                    greencloud.classList.add('visible');
                    orangecloud.classList.add('visible');
                  } else if (
                    this.themeName == 'light-green' ||
                    this.themeName == 'dark-green'
                  ) {
                    greencloud.classList.remove('visible');
                    defaultcloud.classList.add('visible');
                    redcloud.classList.add('visible');
                    bluecloud.classList.add('visible');
                    orangecloud.classList.add('visible');
                  } else if (
                    this.themeName == 'light-orange' ||
                    this.themeName == 'dark-orange'
                  ) {
                    orangecloud.classList.remove('visible');
                    defaultcloud.classList.add('visible');
                    redcloud.classList.add('visible');
                    bluecloud.classList.add('visible');
                    greencloud.classList.add('visible');
                  } else {
                    defaultcloud.classList.remove('visible');
                    redcloud.classList.add('visible');
                    bluecloud.classList.add('visible');
                    greencloud.classList.add('visible');
                    orangecloud.classList.add('visible');
                  }
                }

                if (page) {
                  console.log('testing the feed page');
                  console.log('hello ' + this.settings.themes.themeImage);
                  page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
                } else {
                  console.log('page is null');
                }
              }
            });
        }

        if (!this.communitiesIsFetched) {
          this.communitiesIsFetched = true;

          this.store.dispatch(
            new GetRecommendedCommunities(
              this.profile._id,
              this.profile.username
            )
          );
          this.communities$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((communities) => {
              if (communities) {
                console.log('Communities Found');
                console.log(communities);
                this.myCommunities = communities.slice(0, 3);
                console.log('COMMUNITIES: ');
                for (let k = 0; k < this.myCommunities.length; k++) {
                  console.log(this.myCommunities[k].name);
                }
                // console.log("END OF COMMUNITIES: ")
              }
            });
        }

        if (!this.booksIsFetched) {
          this.booksIsFetched = true;
          this.store.dispatch(new GetRecommendedBooks(this.profile._id));
          this.books$.pipe().subscribe((books) => {
            if (books) {
              if (books.length == undefined) {
                this.booksIsFetched = false;
              } else {
                console.log('Books:');
                console.log(books);
                this.books = books;
                console.log('My Books:');
                console.log(this.books);
                if (this.books) {
                  this.BookTitle1 = this.books[0].title;
                  this.BookTitle2 = this.books[1].title;
                  this.BookAuthor1 = this.books[0].author;
                  this.BookAuthor2 = this.books[1].author;
                  console.log('Book Titles:');
                  console.log(this.BookTitle1);
                  console.log(this.BookTitle2);
                  if (this.books[0].title.includes(',')) {
                    const Index = this.books[0].title.indexOf(',');
                    if (Index !== -1) {
                      this.BookTitle1 = this.books[0].title.substring(0, Index);
                    }
                  }

                  if (this.books[0].title.includes(':')) {
                    const Index = this.books[0].title.indexOf(':');
                    if (Index !== -1) {
                      this.BookTitle1 = this.books[0].title.substring(0, Index);
                    }
                  }

                  if (this.books[0].title.includes('/')) {
                    const Index = this.books[0].title.indexOf('/');
                    if (Index !== -1) {
                      this.BookTitle1 = this.books[0].title.substring(0, Index);
                    }
                  }

                  if (this.books[1].title.includes(',')) {
                    const Index = this.books[1].title.indexOf(',');
                    if (Index !== -1) {
                      this.BookTitle2 = this.books[1].title.substring(0, Index);
                    }
                  }

                  if (this.books[1].title.includes(':')) {
                    const Index = this.books[1].title.indexOf(':');
                    if (Index !== -1) {
                      this.BookTitle2 = this.books[1].title.substring(0, Index);
                    }
                  }

                  if (this.books[1].title.includes('/')) {
                    const Index = this.books[1].title.indexOf('/');
                    if (Index !== -1) {
                      this.BookTitle2 = this.books[1].title.substring(0, Index);
                    }
                  }

                  if (this.books[0].author.includes(',')) {
                    const Index = this.books[0].author.indexOf(',');
                    if (Index !== -1) {
                      this.BookAuthor1 = this.books[0].author.substring(
                        0,
                        Index
                      );
                    }
                  }
                  if (this.books[0].author.includes('(')) {
                    const Index = this.books[0].author.indexOf('(');
                    if (Index !== -1) {
                      this.BookAuthor1 = this.books[0].author.substring(
                        0,
                        Index
                      );
                    }
                  }
                  if (this.books[1].author.includes(',')) {
                    const Index = this.books[1].author.indexOf(',');
                    if (Index !== -1) {
                      this.BookAuthor2 = this.books[1].author.substring(
                        0,
                        Index
                      );
                    }
                  }
                  if (this.books[1].author.includes('(')) {
                    const Index = this.books[1].author.indexOf('(');
                    if (Index !== -1) {
                      this.BookAuthor2 = this.books[1].author.substring(
                        0,
                        Index
                      );
                    }
                  }

                  console.log('AUTHORS:');
                  console.log(this.books[0].author);
                  console.log(this.BookAuthor1);
                  console.log(this.books[1].author);
                  console.log(this.BookAuthor2);

                  if (this.books[0].genres) {
                    const sanitizedString = this.books[0].genres.replace(
                      /'/g,
                      '"'
                    );
                    this.BookGenres1 = JSON.parse(sanitizedString);
                  }

                  if (this.books[1].genres) {
                    const sanitizedString = this.books[1].genres.replace(
                      /'/g,
                      '"'
                    );
                    this.BookGenres2 = JSON.parse(sanitizedString);
                  }

                  console.log('GENRES:');
                  console.log(this.BookGenres1);
                  console.log(this.BookGenres2);

                  for (let i = 0; i < this.BookGenres1.length; i++) {
                    if (
                      this.BookGenres1[i] == 'Picture Books' ||
                      this.BookGenres1[i] == 'Kids' ||
                      this.BookGenres1[i] == 'Childrens' ||
                      this.BookGenres1[i] == 'Comics'
                    ) {
                      this.BookGenres1[i] = 'Animation';
                    } else if (
                      this.BookGenres1[i] == 'Anime' ||
                      this.BookGenres1[i] == 'Manga' ||
                      this.BookGenres1[i] == 'Comics Manga' ||
                      this.BookGenres1[i] == 'Japan' ||
                      this.BookGenres1[i] == 'Comics' ||
                      this.BookGenres1[i] == 'Graphic Novels'
                    ) {
                      this.BookGenres1[i] = 'Anime';
                    } else if (
                      this.BookGenres1[i] == 'Art' ||
                      this.BookGenres1[i] == 'Poetry' ||
                      this.BookGenres1[i] == 'Philosophy' ||
                      this.BookGenres1[i] == 'Photography'
                    ) {
                      this.BookGenres1[i] = 'Arts';
                    } else if (
                      this.BookGenres1[i] == 'Business' ||
                      this.BookGenres1[i] == 'Economics' ||
                      this.BookGenres1[i] == 'Finance' ||
                      this.BookGenres1[i] == 'Personal Finance'
                    ) {
                      this.BookGenres1[i] = 'Business';
                    } else if (
                      this.BookGenres1[i] == 'Comedy' ||
                      this.BookGenres1[i] == 'Humor'
                    ) {
                      this.BookGenres1[i] = 'Comedy';
                    } else if (
                      this.BookGenres1[i] == 'Nonfiction' ||
                      this.BookGenres1[i] == 'Biography Memoir' ||
                      this.BookGenres1[i] == 'Autobiography' ||
                      this.BookGenres1[i] == 'Memoir'
                    ) {
                      this.BookGenres1[i] = 'Documentary';
                    } else if (
                      this.BookGenres1[i] == 'High Fantasy' ||
                      this.BookGenres1[i] == 'Magic' ||
                      this.BookGenres1[i] == 'Dark Fantasy' ||
                      this.BookGenres1[i] == 'Supernatural'
                    ) {
                      this.BookGenres1[i] = 'Fantasy';
                    } else if (
                      this.BookGenres1[i] == 'Historical' ||
                      this.BookGenres1[i] == 'History' ||
                      this.BookGenres1[i] == 'Biography' ||
                      this.BookGenres1[i] == 'Memoir' ||
                      this.BookGenres1[i] == 'European History' ||
                      this.BookGenres1[i] == 'Biography Memoir' ||
                      this.BookGenres1[i] == 'Autobiography' ||
                      this.BookGenres1[i] == 'World History' ||
                      this.BookGenres1[i] == 'American History' ||
                      this.BookGenres1[i] == 'Military History' ||
                      this.BookGenres1[i] == 'Historical Fiction'
                    ) {
                      this.BookGenres1[i] = 'History';
                    } else if (
                      this.BookGenres1[i] == 'Horror' ||
                      this.BookGenres1[i] == 'Thriller' ||
                      this.BookGenres1[i] == 'Suspense'
                    ) {
                      this.BookGenres1[i] = 'Horror';
                    } else if (
                      this.BookGenres1[i] == 'Food' ||
                      this.BookGenres1[i] == 'Cooking' ||
                      this.BookGenres1[i] == 'Cookbooks' ||
                      this.BookGenres1[i] == 'Food Writing'
                    ) {
                      this.BookGenres1[i] = 'Hospitality';
                    } else if (
                      this.BookGenres1[i] == 'Biology' ||
                      this.BookGenres1[i] == 'Evolution'
                    ) {
                      this.BookGenres1[i] = 'Life-Science';
                    } else if (this.BookGenres1[i] == 'Music') {
                      this.BookGenres1[i] = 'Musical';
                    } else if (
                      this.BookGenres1[i] == 'Mystery' ||
                      this.BookGenres1[i] == 'Thriller' ||
                      this.BookGenres1[i] == 'Crime' ||
                      this.BookGenres1[i] == 'Suspense'
                    ) {
                      this.BookGenres1[i] = 'Mystery';
                    } else if (this.BookGenres1[i] == 'Science') {
                      this.BookGenres1[i] = 'Physics';
                    } else if (
                      this.BookGenres1[i] == 'Romance' ||
                      this.BookGenres1[i] == 'Love'
                    ) {
                      this.BookGenres1[i] = 'Romance';
                    } else if (
                      this.BookGenres1[i] == 'Science Fiction' ||
                      this.BookGenres1[i] == 'Science Fiction Fantasy' ||
                      this.BookGenres1[i] == 'Dystopia'
                    ) {
                      this.BookGenres1[i] = 'Science-Fiction';
                    } else if (this.BookGenres1[i] == 'Westerns') {
                      this.BookGenres1[i] = 'Western';
                    } else if (
                      this.BookGenres1[i] == 'World War II' ||
                      this.BookGenres1[i] == 'Holocaust'
                    ) {
                      this.BookGenres1[i] = 'War';
                    }
                  }

                  console.log('NEW GENRES AFTER REPLACING (1):');
                  console.log(this.BookGenres1);

                  this.BookGenres1 = Array.from(new Set(this.BookGenres1));

                  for (let i = 0; i < this.BookGenres1.length; i++) {
                    if (
                      this.BookGenres1[i] == 'Animation' ||
                      this.BookGenres1[i] == 'Anime' ||
                      this.BookGenres1[i] == 'Arts' ||
                      this.BookGenres1[i] == 'Business' ||
                      this.BookGenres1[i] == 'Comedy' ||
                      this.BookGenres1[i] == 'Documentary' ||
                      this.BookGenres1[i] == 'Fantasy' ||
                      this.BookGenres1[i] == 'History' ||
                      this.BookGenres1[i] == 'Horror' ||
                      this.BookGenres1[i] == 'Hospitality' ||
                      this.BookGenres1[i] == 'Life-Science' ||
                      this.BookGenres1[i] == 'Musical' ||
                      this.BookGenres1[i] == 'Mystery' ||
                      this.BookGenres1[i] == 'Physics' ||
                      this.BookGenres1[i] == 'Romance' ||
                      this.BookGenres1[i] == 'Science-Fiction' ||
                      this.BookGenres1[i] == 'War' ||
                      this.BookGenres1[i] == 'Western' ||
                      this.BookGenres1[i] == 'Drama' ||
                      this.BookGenres1[i] == 'Action' ||
                      this.BookGenres1[i] == 'Geography' ||
                      this.BookGenres1[i] == 'Mathematics' ||
                      this.BookGenres1[i] == 'Adventure'
                    ) {
                      this.myBookGenres1.push(this.BookGenres1[i]);
                      if (this.myBookGenres1.length == 3) {
                        break;
                      }
                    }
                  }

                  console.log('NEW GENRES AFTER FILTERING (1):');
                  console.log(this.myBookGenres1);

                  for (let i = 0; i < this.BookGenres2.length; i++) {
                    if (
                      this.BookGenres2[i] == 'Picture Books' ||
                      this.BookGenres2[i] == 'Kids' ||
                      this.BookGenres2[i] == 'Childrens'
                    ) {
                      this.BookGenres2[i] = 'Animation';
                    } else if (
                      this.BookGenres2[i] == 'Anime' ||
                      this.BookGenres2[i] == 'Manga' ||
                      this.BookGenres2[i] == 'Comics Manga' ||
                      this.BookGenres2[i] == 'Japan' ||
                      this.BookGenres2[i] == 'Comics' ||
                      this.BookGenres2[i] == 'Graphic Novels'
                    ) {
                      this.BookGenres2[i] = 'Anime';
                    } else if (
                      this.BookGenres2[i] == 'Art' ||
                      this.BookGenres2[i] == 'Poetry' ||
                      this.BookGenres2[i] == 'Philosophy' ||
                      this.BookGenres2[i] == 'Photography'
                    ) {
                      this.BookGenres2[i] = 'Arts';
                    } else if (
                      this.BookGenres2[i] == 'Business' ||
                      this.BookGenres2[i] == 'Economics' ||
                      this.BookGenres2[i] == 'Finance' ||
                      this.BookGenres1[i] == 'Personal Finance'
                    ) {
                      this.BookGenres2[i] = 'Business';
                    } else if (
                      this.BookGenres2[i] == 'Comedy' ||
                      this.BookGenres2[i] == 'Humor'
                    ) {
                      this.BookGenres2[i] = 'Comedy';
                    } else if (
                      this.BookGenres2[i] == 'Nonfiction' ||
                      this.BookGenres2[i] == 'Biography Memoir' ||
                      this.BookGenres2[i] == 'Autobiography' ||
                      this.BookGenres2[i] == 'Memoir'
                    ) {
                      this.BookGenres2[i] = 'Documentary';
                    } else if (
                      this.BookGenres2[i] == 'High Fantasy' ||
                      this.BookGenres2[i] == 'Magic' ||
                      this.BookGenres2[i] == 'Dark Fantasy' ||
                      this.BookGenres2[i] == 'Supernatural'
                    ) {
                      this.BookGenres2[i] = 'Fantasy';
                    } else if (
                      this.BookGenres2[i] == 'Historical' ||
                      this.BookGenres2[i] == 'History' ||
                      this.BookGenres2[i] == 'Biography' ||
                      this.BookGenres2[i] == 'Memoir' ||
                      this.BookGenres2[i] == 'European History' ||
                      this.BookGenres2[i] == 'Biography Memoir' ||
                      this.BookGenres2[i] == 'Autobiography' ||
                      this.BookGenres2[i] == 'World History' ||
                      this.BookGenres2[i] == 'American History' ||
                      this.BookGenres2[i] == 'Military History' ||
                      this.BookGenres2[i] == 'Historical Fiction'
                    ) {
                      this.BookGenres2[i] = 'History';
                    } else if (
                      this.BookGenres2[i] == 'Horror' ||
                      this.BookGenres2[i] == 'Thriller' ||
                      this.BookGenres2[i] == 'Suspense'
                    ) {
                      this.BookGenres2[i] = 'Horror';
                    } else if (
                      this.BookGenres2[i] == 'Food' ||
                      this.BookGenres2[i] == 'Cooking' ||
                      this.BookGenres2[i] == 'Cookbooks' ||
                      this.BookGenres2[i] == 'Food Writing'
                    ) {
                      this.BookGenres2[i] = 'Hospitality';
                    } else if (
                      this.BookGenres2[i] == 'Biology' ||
                      this.BookGenres2[i] == 'Evolution'
                    ) {
                      this.BookGenres2[i] = 'Life-Science';
                    } else if (this.BookGenres2[i] == 'Music') {
                      this.BookGenres2[i] = 'Musical';
                    } else if (
                      this.BookGenres2[i] == 'Mystery' ||
                      this.BookGenres2[i] == 'Thriller' ||
                      this.BookGenres2[i] == 'Crime' ||
                      this.BookGenres2[i] == 'Suspense'
                    ) {
                      this.BookGenres2[i] = 'Mystery';
                    } else if (this.BookGenres2[i] == 'Science') {
                      this.BookGenres2[i] = 'Physics';
                    } else if (
                      this.BookGenres2[i] == 'Romance' ||
                      this.BookGenres2[i] == 'Love'
                    ) {
                      this.BookGenres2[i] = 'Romance';
                    } else if (
                      this.BookGenres2[i] == 'Science Fiction' ||
                      this.BookGenres2[i] == 'Science Fiction Fantasy' ||
                      this.BookGenres2[i] == 'Dystopia'
                    ) {
                      this.BookGenres2[i] = 'Science-Fiction';
                    } else if (this.BookGenres2[i] == 'Westerns') {
                      this.BookGenres2[i] = 'Western';
                    } else if (
                      this.BookGenres2[i] == 'World War II' ||
                      this.BookGenres2[i] == 'Holocaust'
                    ) {
                      this.BookGenres2[i] = 'War';
                    }
                  }

                  console.log('NEW GENRES AFTER REPLACING (2):');
                  console.log(this.BookGenres2);

                  this.BookGenres2 = Array.from(new Set(this.BookGenres2));

                  for (let i = 0; i < this.BookGenres2.length; i++) {
                    if (
                      this.BookGenres2[i] == 'Animation' ||
                      this.BookGenres2[i] == 'Anime' ||
                      this.BookGenres2[i] == 'Arts' ||
                      this.BookGenres2[i] == 'Business' ||
                      this.BookGenres2[i] == 'Comedy' ||
                      this.BookGenres2[i] == 'Documentary' ||
                      this.BookGenres2[i] == 'Fantasy' ||
                      this.BookGenres2[i] == 'History' ||
                      this.BookGenres2[i] == 'Horror' ||
                      this.BookGenres2[i] == 'Hospitality' ||
                      this.BookGenres2[i] == 'Life-Science' ||
                      this.BookGenres2[i] == 'Musical' ||
                      this.BookGenres2[i] == 'Mystery' ||
                      this.BookGenres2[i] == 'Physics' ||
                      this.BookGenres2[i] == 'Romance' ||
                      this.BookGenres2[i] == 'Science-Fiction' ||
                      this.BookGenres2[i] == 'War' ||
                      this.BookGenres2[i] == 'Western' ||
                      this.BookGenres2[i] == 'Drama' ||
                      this.BookGenres2[i] == 'Action' ||
                      this.BookGenres2[i] == 'Geography' ||
                      this.BookGenres2[i] == 'Mathematics' ||
                      this.BookGenres2[i] == 'Adventure'
                    ) {
                      this.myBookGenres2.push(this.BookGenres2[i]);
                      if (this.myBookGenres2.length == 3) {
                        break;
                      }
                    }
                  }
                  console.log('NEW GENRES AFTER FILTERING (2):');
                  console.log(this.myBookGenres2);

                  console.log('REFINED GENRES:');
                  console.log(this.myBookGenres1);
                  console.log(this.myBookGenres2);
                }
              }
            }
          });
        }

        if (!this.moviesIsFetched) {
          console.log('Movies CALLED:');
          this.moviesIsFetched = true;
          this.store.dispatch(new GetRecommendedMovies(this.profile._id));
          this.movies$.pipe().subscribe((movies) => {
            if (movies) {
              if (movies.length == undefined) {
                this.moviesIsFetched = false;
              } else {
                console.log(movies);
                this.movies = movies;
                console.log('My Movies:');
                console.log(this.movies);
                if (this.movies) {
                  this.MovieTitle1 = this.movies[0].Title;
                  this.MovieTitle2 = this.movies[1].Title;

                  console.log('Movie Titles:');
                  console.log(this.MovieTitle1);
                  console.log(this.MovieTitle2);

                  if (this.movies[0].Genre) {
                    const newString = this.movies[0].Genre.replace(/\s/g, '');
                    this.MovieGenres1 = newString.split(',');
                    console.log('New String: ' + newString);
                  }

                  if (this.movies[1].Genre) {
                    const newString = this.movies[1].Genre.replace(/\s/g, '');
                    this.MovieGenres2 = newString.split(',');
                    console.log('New String2: ' + newString);
                  }

                  console.log('GENRES AGAIN:');
                  console.log(this.MovieGenres1);
                  console.log(this.MovieGenres2);

                  for (let i = 0; i < this.MovieGenres1.length; i++) {
                    if (
                      this.MovieGenres1[i] == 'Mystery' ||
                      this.MovieGenres1[i] == 'Thriller' ||
                      this.MovieGenres1[i] == 'Crime'
                    ) {
                      this.MovieGenres1[i] = 'Mystery';
                    } else if (this.MovieGenres1[i] == 'ScienceFiction') {
                      this.MovieGenres1[i] = 'Science-Fiction';
                    }
                  }

                 

                  this.MovieGenres1 = Array.from(new Set(this.MovieGenres1));

                  for (let i = 0; i < this.MovieGenres1.length; i++) {
                    if (
                      this.MovieGenres1[i] == 'Animation' ||
                      this.MovieGenres1[i] == 'Anime' ||
                      this.MovieGenres1[i] == 'Arts' ||
                      this.MovieGenres1[i] == 'Business' ||
                      this.MovieGenres1[i] == 'Comedy' ||
                      this.MovieGenres1[i] == 'Documentary' ||
                      this.MovieGenres1[i] == 'Fantasy' ||
                      this.MovieGenres1[i] == 'History' ||
                      this.MovieGenres1[i] == 'Horror' ||
                      this.MovieGenres1[i] == 'Hospitality' ||
                      this.MovieGenres1[i] == 'Life-Science' ||
                      this.MovieGenres1[i] == 'Musical' ||
                      this.MovieGenres1[i] == 'Mystery' ||
                      this.MovieGenres1[i] == 'Physics' ||
                      this.MovieGenres1[i] == 'Romance' ||
                      this.MovieGenres1[i] == 'Science-Fiction' ||
                      this.MovieGenres1[i] == 'War' ||
                      this.MovieGenres1[i] == 'Western' ||
                      this.MovieGenres1[i] == 'Drama' ||
                      this.MovieGenres1[i] == 'Action' ||
                      this.MovieGenres1[i] == 'Geography' ||
                      this.MovieGenres1[i] == 'Mathematics' ||
                      this.MovieGenres1[i] == 'Adventure'
                    ) {
                      this.myMovieGenres1.push(this.MovieGenres1[i]);
                      if (this.myMovieGenres1.length == 3) {
                        break;
                      }
                    }
                  }

                  for (let i = 0; i < this.MovieGenres2.length; i++) {
                    if (
                      this.MovieGenres2[i] == 'Mystery' ||
                      this.MovieGenres2[i] == 'Thriller' ||
                      this.MovieGenres2[i] == 'Crime'
                    ) {
                      this.MovieGenres2[i] = 'Mystery';
                    } else if (this.MovieGenres2[i] == 'ScienceFiction') {
                      this.MovieGenres2[i] = 'Science-Fiction';
                    }
                  }

                  this.MovieGenres2 = Array.from(new Set(this.MovieGenres2));

                  for (let i = 0; i < this.MovieGenres2.length; i++) {
                    if (
                      this.MovieGenres2[i] == 'Animation' ||
                      this.MovieGenres2[i] == 'Anime' ||
                      this.MovieGenres2[i] == 'Arts' ||
                      this.MovieGenres2[i] == 'Business' ||
                      this.MovieGenres2[i] == 'Comedy' ||
                      this.MovieGenres2[i] == 'Documentary' ||
                      this.MovieGenres2[i] == 'Fantasy' ||
                      this.MovieGenres2[i] == 'History' ||
                      this.MovieGenres2[i] == 'Horror' ||
                      this.MovieGenres2[i] == 'Hospitality' ||
                      this.MovieGenres2[i] == 'Life-Science' ||
                      this.MovieGenres2[i] == 'Musical' ||
                      this.MovieGenres2[i] == 'Mystery' ||
                      this.MovieGenres2[i] == 'Physics' ||
                      this.MovieGenres2[i] == 'Romance' ||
                      this.MovieGenres2[i] == 'Science-Fiction' ||
                      this.MovieGenres2[i] == 'War' ||
                      this.MovieGenres2[i] == 'Western' ||
                      this.MovieGenres2[i] == 'Drama' ||
                      this.MovieGenres2[i] == 'Action' ||
                      this.MovieGenres2[i] == 'Geography' ||
                      this.MovieGenres2[i] == 'Mathematics' ||
                      this.MovieGenres2[i] == 'Adventure'
                    ) {
                      this.myMovieGenres2.push(this.MovieGenres2[i]);
                      if (this.myMovieGenres2.length == 3) {
                        break;
                      }
                    }
                  }
                 
                }
              }
            }
          });
        }

        if(!this.podcastsIsFetched){
            this.podcastsIsFetched=true;
            this.store.dispatch(new GetRecommendedPodcasts(this.profile._id));
            this.podcasts$.pipe().subscribe((podcasts) => {
              if (podcasts) {
                if (podcasts.length == undefined) {
                  this.podcastsIsFetched = false;
                } else {
                  console.log(podcasts);
                  this.podcasts = podcasts;
                  console.log('My Podcasts:');
                  console.log(this.podcasts);
                  if (this.podcasts) {
                    this.PodcastTitle1 = this.podcasts[0].title;
                    this.PodcastTitle2 = this.podcasts[1].title;
  
                    console.log('Podcast Titles:');
                    console.log(this.PodcastTitle1);
                    console.log(this.PodcastTitle2);
  
                    if (this.podcasts[0].categories) {
                      const newString = this.podcasts[0].categories.replace(/\s/g, '');
                      this.PodcastGenres1 = newString.split('|');
                      console.log('New String: ' + newString);
                    }
  
                    if (this.podcasts[1].categories) {
                      const newString = this.podcasts[1].categories.replace(/\s/g, '');
                      this.PodcastGenres2 = newString.split('|');
                      console.log('New String2: ' + newString);
                    }
  
                    console.log('GENRES AGAIN:');
                    console.log(this.PodcastGenres1);
                    console.log(this.PodcastGenres2);
  
                    for (let i = 0; i < this.PodcastGenres1.length; i++) {
                      if (
                        this.PodcastGenres1[i] == "Places&Travel"||
                        this.PodcastGenres1[i] == "Regional"||
                        this.PodcastGenres1[i] == "Hobbies"||
                        this.PodcastGenres1[i] == "Games&Hobbies"||
                        this.PodcastGenres1[i] == "Outdoor"||
                        this.PodcastGenres1[i] == "Sports&Recreation")
                       {
                        this.PodcastGenres1[i] = 'Adventure';
                      } else if (
                        this.PodcastGenres1[i] == "PerformingArts" || 
                        this.PodcastGenres1[i] == "VisualArts" || 
                        this.PodcastGenres1[i] == "Arts" || 
                        this.PodcastGenres1[i] == "Literature" || 
                        this.PodcastGenres1[i] == "Design") 
                        {
                        this.PodcastGenres1[i] = 'Arts';
                      } else if (
                        this.PodcastGenres1[i] == "Professional" || 
                        this.PodcastGenres1[i] == "Management&Marketing" || 
                        this.PodcastGenres1[i] == "Government&Organizations" || 
                        this.PodcastGenres1[i] == "Self-Help" || 
                        this.PodcastGenres1[i] == "Business" || 
                        this.PodcastGenres1[i] == "BusinessNews" || 
                        this.PodcastGenres1[i] == "Careers" || 
                        this.PodcastGenres1[i] == "News&Politics" || 
                        this.PodcastGenres1[i] == "Training" || 
                        this.PodcastGenres1[i] == "Investing" || 
                        this.PodcastGenres1[i] == "Non-Profit"
                      ){
                        this.PodcastGenres1[i] == 'Business';
                      } else if (
                        this.PodcastGenres1[i] == "History"||
                        this.PodcastGenres1[i] == "Podcasting"||
                        this.PodcastGenres1[i] == "HigherEducation"||
                        this.PodcastGenres1[i] == "News&Politics"
                      ){
                        this.PodcastGenres1[i] == 'Documentary';

                      }else if (
                        this.PodcastGenres1[i] == "College&High School"||
                        this.PodcastGenres1[i] == "Society&Culture"
                      ){
                        this.PodcastGenres1[i] == 'Drama';
                      
                      }else if (
            
                        this.PodcastGenres1[i] == "EducationalTechnology"||
                        this.PodcastGenres1[i] == "Literature"
                      ){
                        this.PodcastGenres1[i] = 'Fantasy';
                      }else if (
                        this.PodcastGenres1[i] == "Food"
                      ){
                        this.PodcastGenres1[i] = 'Food';
                      }
                      else if(this.PodcastGenres1[i] == "Science&Medicine"||
                        this.PodcastGenres1[i] == "NaturalSciences"||
                        this.PodcastGenres1[i] == "Medicine")
                        {
                          this.PodcastGenres1[i] = 'Life-Science';
                        }
                        else if(this.PodcastGenres1[i] == "Music"){
                          this.PodcastGenres1[i] = 'Musical';
                        }
                        else if(this.PodcastGenres1[i] == "TechNews"||
                          this.PodcastGenres1[i] == "EducationalTechnology"||
                          this.PodcastGenres1[i] == "HigherEducation"||
                          this.PodcastGenres1[i] == "Technology"||
                          this.PodcastGenres1[i] == "Gadgets")
                        {
                          this.PodcastGenres1[i] = 'Physics';
                        }
                        else if(this.PodcastGenres1[i] == "TechNews"||
                          this.PodcastGenres1[i] == "EducationalTechnology"||
                          this.PodcastGenres1[i] == "Gadgets"||
                          this.PodcastGenres1[i] == "Technology"||
                          this.PodcastGenres1[i] == "SoftwareHow-To"){
                          this.PodcastGenres1[i] = 'Science-Fiction';
                          }
                       
                      
                    }
  
                
  
                    this.PodcastGenres1 = Array.from(new Set(this.PodcastGenres1));
  
                    for (let i = 0; i < this.PodcastGenres1.length; i++) {
                      if (
                        this.PodcastGenres1[i] == 'Animation' ||
                        this.PodcastGenres1[i] == 'Anime' ||
                        this.PodcastGenres1[i] == 'Arts' ||
                        this.PodcastGenres1[i] == 'Business' ||
                        this.PodcastGenres1[i] == 'Comedy' ||
                        this.PodcastGenres1[i] == 'Documentary' ||
                        this.PodcastGenres1[i] == 'Fantasy' ||
                        this.PodcastGenres1[i] == 'History' ||
                        this.PodcastGenres1[i] == 'Horror' ||
                        this.PodcastGenres1[i] == 'Hospitality' ||
                        this.PodcastGenres1[i] == 'Life-Science' ||
                        this.PodcastGenres1[i] == 'Musical' ||
                        this.PodcastGenres1[i] == 'Mystery' ||
                        this.PodcastGenres1[i] == 'Physics' ||
                        this.PodcastGenres1[i] == 'Romance' ||
                        this.PodcastGenres1[i] == 'Science-Fiction' ||
                        this.PodcastGenres1[i] == 'War' ||
                        this.PodcastGenres1[i] == 'Western' ||
                        this.PodcastGenres1[i] == 'Drama' ||
                        this.PodcastGenres1[i] == 'Action' ||
                        this.PodcastGenres1[i] == 'Geography' ||
                        this.PodcastGenres1[i] == 'Mathematics' ||
                        this.PodcastGenres1[i] == 'Adventure'
                      ) {
                        this.myPodcastGenres1.push(this.PodcastGenres1[i]);
                        if (this.myPodcastGenres1.length == 3) {
                          break;
                        }
                      }
                    }
  
                    
  
                    for (let i = 0; i < this.PodcastGenres2.length; i++) {
                      if (
                        this.PodcastGenres2[i] == "Places & Travel"||
                        this.PodcastGenres2[i] == "Regional"||
                        this.PodcastGenres2[i] == "Hobbies"||
                        this.PodcastGenres2[i] == "Games & Hobbies"||
                        this.PodcastGenres2[i] == "Outdoor"||
                        this.PodcastGenres2[i] == "Sports & Recreation")
                       {
                        this.PodcastGenres2[i] = 'Adventure';
                      } else if (
                        this.PodcastGenres2[i] == "Performing Arts" || 
                        this.PodcastGenres2[i] == "Visual Arts" || 
                        this.PodcastGenres2[i] == "Arts" || 
                        this.PodcastGenres2[i] == "Literature" || 
                        this.PodcastGenres2[i] == "Design") 
                        {
                        this.PodcastGenres2[i] = 'Arts';
                      } else if (
                        this.PodcastGenres2[i] == "Professional" || 
                        this.PodcastGenres2[i] == "Management & Marketing" || 
                        this.PodcastGenres2[i] == "Government & Organizations" || 
                        this.PodcastGenres2[i] == "Self-Help" || 
                        this.PodcastGenres2[i] == "Business" || 
                        this.PodcastGenres2[i] == "Business News" || 
                        this.PodcastGenres2[i] == "Careers" || 
                        this.PodcastGenres2[i] == "News & Politics" || 
                        this.PodcastGenres2[i] == "Training" || 
                        this.PodcastGenres2[i] == "Investing" || 
                        this.PodcastGenres2[i] == "Non-Profit"
                      ){
                        this.PodcastGenres2[i] == 'Business';
                      } else if (
                        this.PodcastGenres2[i] == "History"||
                        this.PodcastGenres2[i] == "Podcasting"||
                        this.PodcastGenres2[i] == "Higher Education"||
                        this.PodcastGenres2[i] == "News & Politics"
                      ){
                        this.PodcastGenres2[i] == 'Documentary';

                      }else if (
                        this.PodcastGenres2[i] == "College & High School"||
                        this.PodcastGenres2[i] == "Society & Culture"
                      ){
                        this.PodcastGenres2[i] == 'Drama';
                      
                      }else if (
            
                        this.PodcastGenres2[i] == "Educational Technology"||
                        this.PodcastGenres2[i] == "Literature"
                      ){
                        this.PodcastGenres2[i] = 'Fantasy';
                      }else if (
                        this.PodcastGenres2[i] == "Food"
                      ){
                        this.PodcastGenres2[i] = 'Food';
                      }
                      else if(this.PodcastGenres2[i] == "Science & Medicine"||
                        this.PodcastGenres2[i] == "Natural Sciences"||
                        this.PodcastGenres2[i] == "Medicine")
                        {
                          this.PodcastGenres2[i] = 'Life-Science';
                        }
                        else if(this.PodcastGenres2[i] == "Music"){
                          this.PodcastGenres2[i] = 'Musical';
                        }
                        else if(this.PodcastGenres2[i] == "Tech News"||
                          this.PodcastGenres2[i] == "Educational Technology"||
                          this.PodcastGenres2[i] == "Higher Education"||
                          this.PodcastGenres2[i] == "Technology"||
                          this.PodcastGenres2[i] == "Gadgets")
                        {
                          this.PodcastGenres2[i] = 'Physics';
                        }
                        else if(this.PodcastGenres2[i] == "Tech News"||
                          this.PodcastGenres2[i] == "Educational Technology"||
                          this.PodcastGenres2[i] == "Gadgets"||
                          this.PodcastGenres2[i] == "Technology"||
                          this.PodcastGenres2[i] == "Software How-To"){
                          this.PodcastGenres2[i] = 'Science-Fiction';
                          }
                       
                      
                    }
  
                
  
                    this.PodcastGenres2 = Array.from(new Set(this.PodcastGenres2));
  
                    for (let i = 0; i < this.PodcastGenres2.length; i++) {
                      if (
                        this.PodcastGenres2[i] == 'Animation' ||
                        this.PodcastGenres2[i] == 'Anime' ||
                        this.PodcastGenres2[i] == 'Arts' ||
                        this.PodcastGenres2[i] == 'Business' ||
                        this.PodcastGenres2[i] == 'Comedy' ||
                        this.PodcastGenres2[i] == 'Documentary' ||
                        this.PodcastGenres2[i] == 'Fantasy' ||
                        this.PodcastGenres2[i] == 'History' ||
                        this.PodcastGenres2[i] == 'Horror' ||
                        this.PodcastGenres2[i] == 'Hospitality' ||
                        this.PodcastGenres2[i] == 'Life-Science' ||
                        this.PodcastGenres2[i] == 'Musical' ||
                        this.PodcastGenres2[i] == 'Mystery' ||
                        this.PodcastGenres2[i] == 'Physics' ||
                        this.PodcastGenres2[i] == 'Romance' ||
                        this.PodcastGenres2[i] == 'Science-Fiction' ||
                        this.PodcastGenres2[i] == 'War' ||
                        this.PodcastGenres2[i] == 'Western' ||
                        this.PodcastGenres2[i] == 'Drama' ||
                        this.PodcastGenres2[i] == 'Action' ||
                        this.PodcastGenres2[i] == 'Geography' ||
                        this.PodcastGenres2[i] == 'Mathematics' ||
                        this.PodcastGenres2[i] == 'Adventure'
                      ) {
                        this.myPodcastGenres2.push(this.PodcastGenres2[i]);
                        if (this.myPodcastGenres2.length == 3) {
                          break;
                        }
                      }
                    }
                   
                   
                  }
                }
              }
            });
        }
      }
    });
  }

  async addPosts() {
    if (this.profile == null) {
      return;
    }
    // if(!this.postsIsFetched){
    if (this.type === 'recommended') {
      console.log('GETTING RECOMMENDED POSTS');
      this.store.dispatch(new GetAllPosts(this.profile?._id));
    } else if (this.type === 'latest') {
      this.store.dispatch(new GetLatestPosts(this.profile.username));
    } else {
      this.store.dispatch(new GetPopularPosts(this.profile.username));
    }

    this.postsIsFetched = true;
    await this.updatePosts();
    //   this.homePosts$.subscribe((posts) => {
    //   if(posts){
    //     // console.log("POSTS:")
    //     this.posts = [];
    //     const temp = posts;
    //     temp.forEach((post) => {
    //       if(post.isPrivate){
    //         if(this.profile?.communities.includes(post.community)){
    //           this.posts.push(post);
    //         }
    //       }

    //       else{
    //         this.posts.push(post);
    //       }
    //     })

    //     // this.posts = posts;
    //     this.size=posts.length-1;
    //     // console.log("SIZE: " + this.size)
    //     for(let i =0;i<posts.length;i++){
    //       this.likedComments.push(false);
    //       this.sharing.push(false);

    //       this.reports.push(false);
    //       this.postReported.push(false);

    //       if(posts[i].dateAdded!=null&&posts[i].comments!=null
    //         &&posts[i].shares!=null){
    //         this.datesAdded.push(posts[i].dateAdded);
    //         this.comments.push(posts[i].comments);
    //         this.shares.push(posts[i].shares);
    //       }

    //       if(posts!=null&&posts[i].likes!=null){
    //         this.likes.push(posts[i].likes?.length);

    //         if(this.profile==undefined){
    //           return;
    //         }
    //         if(posts[i].likes.includes(this.profile.username)){
    //           this.likedComments[i]=true;
    //         }
    //       }

    //     }

    //   }
    // })
    // }
  }

  async updatePosts() {
    this.homePosts$.subscribe((posts) => {
      if (posts) {
        // console.log("POSTS:")
        // this.posts = [];
        let temp = posts;
        // temp.forEach((post) => {
        //   if(post.isPrivate){
        //     if(this.profile?.communities.includes(post.community)){
        //       this.posts.push(post);
        //     }
        //   }

        //   else{
        //     this.posts.push(post);
        //   }
        // })

        this.posts = posts;

        //Filter posts to only show posts that are not private and if private user is a part of the community

        temp = temp.filter((post) => {
          if (post.isPrivate) {
            return this.profile?.communities.includes(post.community);
          } else {
            return true;
          }
        });

        // this.posts = temp

        this.size = posts.length - 1;
        // console.log("SIZE: " + this.size)
        for (let i = 0; i < posts.length; i++) {
          this.likedComments.push(false);
          this.sharing.push(false);

          this.reports.push(false);
          this.postReported.push(false);

          if (
            posts[i].dateAdded != null &&
            posts[i].comments != null &&
            posts[i].shares != null
          ) {
            this.datesAdded.push(posts[i].dateAdded);
            this.comments.push(posts[i].comments);
            this.shares.push(posts[i].shares);
          }

          if (posts != null && posts[i].likes != null) {
            this.likes.push(posts[i].likes?.length);

            if (this.profile == undefined) {
              return;
            }
            if (posts[i].likes.includes(this.profile.username)) {
              this.likedComments[i] = true;
            }
          }
        }
      }
    });
  }

  async openPopup() {
    const modal = await this.modalController.create({
      component: CreatePostComponent,
      cssClass: 'custom-modal',
      componentProps: {},
    });

    return await modal.present();
  }

  async openPopup2() {
    const modal = await this.modalController.create({
      component: CreateCommunityComponent,
      cssClass: 'custom-modal',
      componentProps: {},
    });

    return await modal.present();
  }

  Report(n: number) {
    if (this.posts?.length == null) {
      return;
    }

    if (this.reports[n] == true) {
      this.reports[n] = false;
      return;
    } else {
      for (let k = 0; k < this.reports.length; k++) {
        this.reports[k] = false;
      }
      this.reports[n] = true;
    }
  }

  GoToCommunity(communityName: string) {
    this.router.navigate(['home/community-profile/' + communityName]);
  }

  Like(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new LikePostArray(post._id, this.profile._id));
  }

  Dislike(n: number, post: PostDto) {
    if (this.profile == null) {
      return;
    }

    this.store.dispatch(new DislikePostArray(post._id, this.profile._id));
  }

  ReportPost(n: number, post: PostDto) {
    if (this.posts?.length == null) {
      return;
    }

    this.reports[n] = false;

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: post.likes,
      dislikes: post.dislikes,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares,
      comments: post.comments,
      reported: true,
    };

    this.store.dispatch(new UpdatePostArray(post._id, data));
    this.homeApi.removeCoins(post.username, 1);
  }

  async Share(n: number, post: PostDto) {
    this.shares[n]++;
    for (let i = 0; i < this.sharing.length; i++) {
      this.sharing[i] = false;
    }
    this.sharing[n] = true;

    const obj = location.origin;
    if (obj == undefined) {
      return;
    }

    const data: UpdatePostRequest = {
      title: post.title,
      text: post.text,
      imageUrl: post.imageUrl,
      communityImageUrl: post.communityImageUrl,
      categories: post.categories,
      likes: post.likes,
      dislikes: post.dislikes,
      spoiler: post.spoiler,
      ageRestricted: post.ageRestricted,
      shares: post.shares + 1,
      comments: post.comments,
      reported: post.reported,
    };

    this.store.dispatch(new UpdatePostArray(post._id, data));

    const link: string = obj + '/home/app-comments-feature/' + post._id;

    await navigator.clipboard.writeText(link);

    const toast = await this.toastController.create({
      message: 'Url Copied to Clipboard',
      duration: 2000,
      color: 'success',
    });

    await toast.present();
  }

  GoToProfile(username: string) {
    if (this.profile?.username !== username) {
      this.router.navigate(['home/user-profile/' + username]);
    } else {
      this.router.navigate(['home/profile']);
    }
  }

  selectedSegment = 'new';

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    if (this.selectedSegment === 'recommended') {
      this.recChange();
    } else if (this.selectedSegment === 'new') {
      this.newChange();
    } else if (this.selectedSegment === 'popular') {
      this.popChange();
    }
  }

  recChange() {
    for (let k = 0; k < this.reports.length; k++) {
      this.reports[k] = false;
    }

    this.postsIsFetched = false;

    this.type = 'recommended';
    this.addPosts();
  }

  newChange() {
    for (let k = 0; k < this.reports.length; k++) {
      this.reports[k] = false;
    }

    this.postsIsFetched = false;

    this.type = 'latest';
    this.addPosts();
  }

  popChange() {
    for (let k = 0; k < this.reports.length; k++) {
      this.reports[k] = false;
    }

    this.postsIsFetched = false;

    this.type = 'popular';
    this.addPosts();
  }

  GoToComments(postId: string) {
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }

  collapse1 = false;
  collapse2 = false;

  Collapse1() {
    this.collapse1 = !this.collapse1;
  }
  Collapse2() {
    this.collapse2 = !this.collapse2;
  }

  buttonStates: { [key: string]: boolean } = {}; // Object to track state for each button

  handleButtonClick(buttonId: string, CommunityName: string) {
    this.buttonStates[buttonId] = !this.buttonStates[buttonId];

    this.joinCommunity(CommunityName);
  }

  activebutton = 'all';

  changeFilter(btnname: string) {
    console.log(btnname);
    const all = document.getElementById('all');
    const books = document.getElementById('books');
    const movies = document.getElementById('movies');
    const podcasts = document.getElementById('podcasts');
    // const series = document.getElementById('series');
    if (all && books && movies && podcasts) {
      if (btnname == 'all') {
        this.ShowMovies = true;
        this.ShowBooks = true;
        this.showPodcasts = true;
        all.classList.add('active-select');
        books.classList.remove('active-select');
        movies.classList.remove('active-select');
        podcasts.classList.remove('active-select');
      } else if (btnname == 'books') {
        this.ShowMovies = false;
        this.ShowBooks = true;
        this.showPodcasts = false;
        all.classList.remove('active-select');
        books.classList.add('active-select');
        movies.classList.remove('active-select');
        podcasts.classList.remove('active-select');
      } else if (btnname == 'movies') {
        this.ShowMovies = true;
        this.ShowBooks = false;
        this.showPodcasts = false;
        all.classList.remove('active-select');
        books.classList.remove('active-select');
        movies.classList.add('active-select');
        podcasts.classList.remove('active-select'); 
      } else if (btnname == 'podcasts') {
        this.ShowMovies = false;
        this.ShowBooks = false;
        this.showPodcasts = true;
        all.classList.remove('active-select');
        books.classList.remove('active-select');
        movies.classList.remove('active-select');
        podcasts.classList.add('active-select');
      }
    }
  }

  joinCommunity(communityName: string) {
    if (this.profile === null) {
      return;
    }

    const data: UpdateProfileRequest = {
      username: this.profile.username,
      name: this.profile.name,
      lastName: this.profile.lastName,
      categories: this.profile.categories,
      communities: [...this.profile.communities, communityName],
      awards: this.profile.awards,
      events: this.profile.events,
      followers: this.profile.followers,
      following: this.profile.following,
      posts: this.profile.posts,
      reviews: this.profile.reviews,
      profileImage: this.profile.profileImage,
      profileBanner: this.profile.profileBanner,
      bio: this.profile.bio,
    };

    this.store.dispatch(new UpdateProfile(data, this.profile._id));

    const community = this.myCommunities?.find(
      (comm) => comm.name === communityName
    );

    if (community) {
      const members = [...community.members, this.profile.username];
      const newEP = community.communityEP + this.profile.ep;

      const data2: UpdateCommunityRequest = {
        name: community.name,
        type: community.type,
        admin: community.admin,
        about: community.about,
        rules: community.rules,
        groupImage: community.groupImage,
        bannerImage: community.bannerImage,
        categories: community.categories,
        events: community.events,
        posts: community.posts,
        members: members,
        ageRestricted: community.ageRestricted,
        communityEP: newEP,
      };

      this.store.dispatch(new UpdateCommunity(community._id, data2));
    }
  }

  showTooltip = false;

  getAuthorName(fullName: string): string {
    const commaIndex = fullName.indexOf(',');
    if (commaIndex !== -1) {
      return fullName.substring(0, commaIndex).trim();
    }
    return fullName;
  }
}
