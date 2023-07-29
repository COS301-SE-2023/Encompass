import { Component, Inject } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable, takeUntil, pipe, Subject, take } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { GetRecommendedCommunities,GetAllPosts, GetLatestPosts, GetPopularPosts, getHome, GetRecommendedBooks, GetRecommendedMovies } from '@encompass/app/home-page/util';
import { ProfileState } from '@encompass/app/profile/data-access';
import { ProfileDto } from '@encompass/api/profile/data-access';
import { SubscribeToProfile } from '@encompass/app/profile/util';
import { ModalController } from '@ionic/angular';
import {CreatePostComponent} from '@encompass/app/create-post/feature';
import { PostDto, UpdatePostRequest } from '@encompass/api/post/data-access';
import {CreateCommunityComponent} from '@encompass/app/create-community/feature';
import { UpdatePost } from '@encompass/app/home-page/util';
import { APP_BASE_HREF, DOCUMENT } from '@angular/common';
import { SettingsDto } from '@encompass/api/settings/data-access';
import { SettingsState } from '@encompass/app/settings/data-access';
import { GetUserSettings } from '@encompass/app/settings/util';
import { DatePipe } from '@angular/common';
import { CommunityDto } from '@encompass/api/community/data-access';
import { MovieDto } from '@encompass/api/media-recommender/data-access';
import { BookDto } from '@encompass/api/media-recommender/data-access';
import { strict } from 'assert';
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
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

  @Select(ProfileState.profile) profile$! : Observable<ProfileDto | null>;
  @Select(HomeState.homePosts) homePosts$! : Observable<PostDto[] | null>;
  @Select(SettingsState.settings) settings$!: Observable<SettingsDto | null>
  @Select(HomeState.getCommunities) communities$! : Observable<CommunityDto[] | null>;
  @Select(HomeState.getMovies) movies$! : Observable<MovieDto[] | null>;
  @Select(HomeState.getBooks) books$! : Observable<BookDto[] | null>;

  private unsubscribe$: Subject<void> = new Subject<void>();

  settings!: SettingsDto | null;
  profile! : ProfileDto | null;
  posts : PostDto[] = [];
  myCommunities! : CommunityDto[] | null;
  movies! : MovieDto[] | null;
  books! : BookDto[] | null;

  BookTitle1! : string;
  BookTitle2! : string;
  BookAuthor1! : string;
  BookAuthor2! : string; 

  BookGenres1!: string[];
  BookGenres2!: string[];
  myBookGenres1: string[]=[];
  myBookGenres2: string[]=[];

  MovieTitle1! : string;
  MovieTitle2! : string;
  

  MovieGenres1!: string[];
  MovieGenres2!: string[];
  myMovieGenres1: string[]=[];
  myMovieGenres2: string[]=[];

  selectedCommunity: string | undefined;
  selectedCommunities : string[]=[];

  reports : boolean[] =[];
  postReported : boolean[] = [];

  datesAdded : string[] = [];
  comments  : number[] = [];
  shares : number[] = [];
  likes: number[] =[] ;
  likedComments: boolean[] = [];
  sharing: boolean[] = [];
  size=0;
  // type = "recommended";

  communitiesIsFetched = false
  moviesIsFetched = false
  booksIsFetched = false
  postsIsFetched = false

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private store: Store, private modalController: ModalController, private datePipe: DatePipe){
    this.load();
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

load(){
  const page = document.getElementById('home-page');


    this.store.dispatch(new SubscribeToProfile())
    // this.store.dispatch(new SubscribeToProfile())
    this.profile$.subscribe((profile) => {
      if(profile){
        
        console.log("Profile CALLED")
        console.log(profile); 
        this.profile = profile;
        // this.addPosts("recommended");
        this.newChange();

        this.store.dispatch(new GetUserSettings(this.profile._id))
        
        this.settings$.subscribe(settings => {
          if(settings){
            this.settings = settings;
            
            this.document.body.setAttribute('color-theme', this.settings.themes.themeColor);
            if (this.settings.themes.themeColor.startsWith('dark')) {
              const icons = document.getElementById('genreicons');

              if (icons) {
                icons.style.filter = 'invert(1)';
              }
            }
            
            if(page){
              console.log("testing the feed page")
              console.log("hello " + this.settings.themes.themeImage);
              page.style.backgroundImage = `url(${this.settings.themes.themeImage})`;
            }else {
              console.log("page is null")
            }
          }
        })

        if(!this.communitiesIsFetched){
          this.communitiesIsFetched = true;

          this.store.dispatch(new GetRecommendedCommunities(this.profile._id));
          this.communities$
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((communities) => {
            if(communities){
              this.myCommunities = communities.slice(0, 3);
              console.log("COMMUNITIES: ");
              for(let k =0; k<this.myCommunities.length;k++){  
                console.log(this.myCommunities[k].name);
              }
              // console.log("END OF COMMUNITIES: ")

            }
          })
        }
       
        if(!this.booksIsFetched){
          this.booksIsFetched = true;
          this.store.dispatch(new GetRecommendedBooks(this.profile._id));
          this.books$.pipe().subscribe((books) => {
            if(books){
              if(books.length == undefined){
                this.booksIsFetched = false
              }

              else{
                console.log("Books:")
              console.log(books);
              this.books = books;
              console.log("My Books:")
              console.log(this.books);
              console.log("BOOKS are EQUAL")
              if(this.books){
                console.log("BOOKS are EQUAL2")
      
                  this.BookTitle1 = this.books[0].title;
                  this.BookTitle2 = this.books[1].title;
                  this.BookAuthor1 = this.books[0].author;
                  this.BookAuthor2 = this.books[1].author;
                console.log("Book Titles:");
                console.log(this.BookTitle1);
                console.log(this.BookTitle2);
                  if(this.books[0].title.includes(',')){
                    const Index = this.books[0].title.indexOf(',');
                    if (Index !== -1) {
                      this.BookTitle1 = this.books[0].title.substring(0, Index );
                    }
                  }
      
                  if(this.books[0].title.includes(':')){
                    const Index = this.books[0].title.indexOf(':');
                    if (Index !== -1) {
                      this.BookTitle1 = this.books[0].title.substring(0, Index);
                    }
                  }
      
                  if(this.books[0].title.includes('/')){
                    const Index = this.books[0].title.indexOf('/');
                    if (Index !== -1) {
                      this.BookTitle1 = this.books[0].title.substring(0, Index);
                    }
                  }
      
                  if(this.books[1].title.includes(',')){
                    const Index = this.books[1].title.indexOf(',');
                    if (Index !== -1) {
                      this.BookTitle2 = this.books[1].title.substring(0, Index );
                    }
                  }
      
                  if(this.books[1].title.includes(':')){
                    const Index = this.books[1].title.indexOf(':');
                    if (Index !== -1) {
                      this.BookTitle2 = this.books[1].title.substring(0, Index);
                    }
                  }
      
                  if(this.books[1].title.includes('/')){
                    const Index = this.books[1].title.indexOf('/');
                    if (Index !== -1) {
                      this.BookTitle2 = this.books[1].title.substring(0, Index);
                    }
                  }
      
                  if(this.books[0].author.includes(',')){
                    const Index = this.books[0].author.indexOf(',');
                    if (Index !== -1) {
                      this.BookAuthor1 = this.books[0].author.substring(0, Index );
                    }
                  }
                  if(this.books[0].author.includes('(')){
                    const Index = this.books[0].author.indexOf('(');
                    if (Index !== -1) {
                      this.BookAuthor1 = this.books[0].author.substring(0, Index );
                    }
                  }
                  if(this.books[1].author.includes(',')){
                    const Index = this.books[1].author.indexOf(',');
                    if (Index !== -1) {
                      this.BookAuthor2 = this.books[1].author.substring(0, Index );
                    }
                  }
                  if(this.books[1].author.includes('(')){
                    const Index = this.books[1].author.indexOf('(');
                    if (Index !== -1) {
                      this.BookAuthor2 = this.books[1].author.substring(0, Index );
                    }
                  }
      
                  
                
                console.log("AUTHORS:")
                console.log(this.books[0].author);
                console.log(this.BookAuthor1);
                console.log(this.books[1].author);
                console.log(this.BookAuthor2);

                if(this.books[0].genres){
                  const sanitizedString = this.books[0].genres.replace(/'/g, '"');
                  this.BookGenres1 = JSON.parse(sanitizedString);
                }
                
                if(this.books[1].genres){
                  const sanitizedString = this.books[1].genres.replace(/'/g, '"');
                  this.BookGenres2 = JSON.parse(sanitizedString);
                }
      
                console.log("GENRES:")                
                console.log(this.BookGenres1);
                console.log(this.BookGenres2);
                
      
                for(let i = 0; i < this.BookGenres1.length; i++){
                  if(this.BookGenres1[i]=='Picture Books'||this.BookGenres1[i]=='Kids'
                  ||this.BookGenres1[i]=='Childrens'||this.BookGenres1[i]=='Comics'){
                    this.BookGenres1[i]='Animation';
                  }else if(this.BookGenres1[i]=='Anime'||this.BookGenres1[i]=='Manga'
                  ||this.BookGenres1[i]=='Comics Manga'||this.BookGenres1[i]=='Japan'
                  ||this.BookGenres1[i]=='Comics'||this.BookGenres1[i]=='Graphic Novels'){
                    this.BookGenres1[i]='Anime';
                  }else if(this.BookGenres1[i]=='Art'||this.BookGenres1[i]=='Poetry'
                  ||this.BookGenres1[i]=='Philosophy'||this.BookGenres1[i]=='Photography'){
                    this.BookGenres1[i]='Arts';
                  }else if(this.BookGenres1[i]=='Business'||this.BookGenres1[i]=='Economics'
                  ||this.BookGenres1[i]=='Finance'||this.BookGenres1[i]=='Personal Finance'){
                    this.BookGenres1[i]='Business';
                  }else if(this.BookGenres1[i]=='Comedy'||this.BookGenres1[i]=='Humor'){
                    this.BookGenres1[i]='Comedy';
                  }else if(this.BookGenres1[i]=='Nonfiction'||this.BookGenres1[i]=='Biography Memoir'
                  ||this.BookGenres1[i]=='Autobiography'||this.BookGenres1[i]=='Memoir'){
                    this.BookGenres1[i]='Documentary';
                  }else if(this.BookGenres1[i]=='High Fantasy'||this.BookGenres1[i]=='Magic'
                  ||this.BookGenres1[i]=='Dark Fantasy'||this.BookGenres1[i]=='Supernatural'){
                    this.BookGenres1[i]='Fantasy';
                  }else if(this.BookGenres1[i]=='Historical'||this.BookGenres1[i]=='History'
                  ||this.BookGenres1[i]=='Biography'||this.BookGenres1[i]=='Memoir'
                  ||this.BookGenres1[i]=='European History'||this.BookGenres1[i]=='Biography Memoir'
                  ||this.BookGenres1[i]=='Autobiography'||this.BookGenres1[i]=='World History'
                  ||this.BookGenres1[i]=='American History'||this.BookGenres1[i]=='Military History'
                  ||this.BookGenres1[i]=='Historical Fiction'){
                    this.BookGenres1[i]='History';
                  }else if(this.BookGenres1[i]=='Horror'||this.BookGenres1[i]=='Thriller'
                  ||this.BookGenres1[i]=='Suspense'){
                    this.BookGenres1[i]='Horror';
                  }else if(this.BookGenres1[i]=='Food'||this.BookGenres1[i]=='Cooking'
                  ||this.BookGenres1[i]=='Cookbooks'||this.BookGenres1[i]=='Food Writing'){
                    this.BookGenres1[i]='Hospitality';
                  }else if(this.BookGenres1[i]=='Biology'||this.BookGenres1[i]=='Evolution'){
                    this.BookGenres1[i]='Life-Science';
                  }else if(this.BookGenres1[i]=='Music'){
                    this.BookGenres1[i]='Musical';
                  }else if(this.BookGenres1[i]=='Mystery'||this.BookGenres1[i]=='Thriller'
                  ||this.BookGenres1[i]=='Crime'||this.BookGenres1[i]=='Suspense'){
                    this.BookGenres1[i]='Mystery';
                  }else if(this.BookGenres1[i]=='Science'){
                    this.BookGenres1[i]='Physics';
                  }else if(this.BookGenres1[i]=='Romance'||this.BookGenres1[i]=='Love'){
                    this.BookGenres1[i]='Romance';
                  }else if(this.BookGenres1[i]=='Science Fiction'){
                    this.BookGenres1[i]='Science-Fiction';
                  }else if(this.BookGenres1[i]=='Westerns'){
                    this.BookGenres1[i]='Western';
                  }else if(this.BookGenres1[i]=='World War II'||this.BookGenres1[i]=='Holocaust'){
                    this.BookGenres1[i]='War';
                  }
              }

              console.log("NEW GENRES AFTER REPLACING (1):")
              console.log(this.BookGenres1);

              this.BookGenres1 = Array.from(new Set(this.BookGenres1));

              for(let i=0;i<this.BookGenres1.length;i++){
                if(this.BookGenres1[i]=='Animation'||this.BookGenres1[i]=='Anime'
                ||this.BookGenres1[i]=='Arts'||this.BookGenres1[i]=='Business'
                ||this.BookGenres1[i]=='Comedy'||this.BookGenres1[i]=='Documentary'
                ||this.BookGenres1[i]=='Fantasy'||this.BookGenres1[i]=='History'
                ||this.BookGenres1[i]=='Horror'||this.BookGenres1[i]=='Hospitality'
                ||this.BookGenres1[i]=='Life-Science'||this.BookGenres1[i]=='Musical'
                ||this.BookGenres1[i]=='Mystery'||this.BookGenres1[i]=='Physics'
                ||this.BookGenres1[i]=='Romance'||this.BookGenres1[i]=='Science-Fiction'
                ||this.BookGenres1[i]=='War'||this.BookGenres1[i]=='Western'
                ||this.BookGenres1[i]=='Thriller'||this.BookGenres1[i]=='Action'
                ||this.BookGenres1[i]=='Geography'||this.BookGenres1[i]=='Mathematics'
                ||this.BookGenres1[i]=='Adventure'){
                  this.myBookGenres1.push(this.BookGenres1[i]);
                  if(this.myBookGenres1.length==3){
                    break;
                  }
                }
              }
      
              console.log("NEW GENRES AFTER FILTERING (1):")
              console.log(this.myBookGenres1);


      
                
              for(let i = 0; i < this.BookGenres2.length; i++){
                if(this.BookGenres2[i]=='Picture Books'||this.BookGenres2[i]=='Kids'
                ||this.BookGenres2[i]=='Childrens'){
                  this.BookGenres2[i]='Animation';
                }else if(this.BookGenres2[i]=='Anime'||this.BookGenres2[i]=='Manga'
                ||this.BookGenres2[i]=='Comics Manga'||this.BookGenres2[i]=='Japan'
                ||this.BookGenres2[i]=='Comics'||this.BookGenres2[i]=='Graphic Novels'){
                  this.BookGenres2[i]='Anime';
                }else if(this.BookGenres2[i]=='Art'||this.BookGenres2[i]=='Poetry'
                ||this.BookGenres2[i]=='Philosophy'||this.BookGenres2[i]=='Photography'){
                  this.BookGenres2[i]='Arts';
                }else if(this.BookGenres2[i]=='Business'||this.BookGenres2[i]=='Economics'
                ||this.BookGenres2[i]=='Finance'||this.BookGenres1[i]=='Personal Finance'){
                  this.BookGenres2[i]='Business';
                }else if(this.BookGenres2[i]=='Comedy'||this.BookGenres2[i]=='Humor'){
                  this.BookGenres2[i]='Comedy';
                }else if(this.BookGenres2[i]=='Nonfiction'||this.BookGenres2[i]=='Biography Memoir'
                ||this.BookGenres2[i]=='Autobiography'||this.BookGenres2[i]=='Memoir'){
                  this.BookGenres2[i]='Documentary';
                }else if(this.BookGenres2[i]=='High Fantasy'||this.BookGenres2[i]=='Magic'
                ||this.BookGenres2[i]=='Dark Fantasy'||this.BookGenres2[i]=='Supernatural'){
                  this.BookGenres2[i]='Fantasy';
                }else if(this.BookGenres2[i]=='Historical'||this.BookGenres2[i]=='History'
                ||this.BookGenres2[i]=='Biography'||this.BookGenres2[i]=='Memoir'
                ||this.BookGenres2[i]=='European History'||this.BookGenres2[i]=='Biography Memoir'
                ||this.BookGenres2[i]=='Autobiography'||this.BookGenres2[i]=='World History'
                ||this.BookGenres2[i]=='American History'||this.BookGenres2[i]=='Military History'
                ||this.BookGenres2[i]=='Historical Fiction'){
                  this.BookGenres2[i]='History';
                }else if(this.BookGenres2[i]=='Horror'||this.BookGenres2[i]=='Thriller'
                ||this.BookGenres2[i]=='Suspense'){
                  this.BookGenres2[i]='Horror';
                }else if(this.BookGenres2[i]=='Food'||this.BookGenres2[i]=='Cooking'
                ||this.BookGenres2[i]=='Cookbooks'||this.BookGenres2[i]=='Food Writing'){
                  this.BookGenres2[i]='Hospitality';
                }else if(this.BookGenres2[i]=='Biology'||this.BookGenres2[i]=='Evolution'){
                  this.BookGenres2[i]='Life-Science';
                }else if(this.BookGenres2[i]=='Music'){
                  this.BookGenres2[i]='Musical';
                }else if(this.BookGenres2[i]=='Mystery'||this.BookGenres2[i]=='Thriller'
                ||this.BookGenres2[i]=='Crime'||this.BookGenres2[i]=='Suspense'){
                  this.BookGenres2[i]='Mystery';
                }else if(this.BookGenres2[i]=='Science'){
                  this.BookGenres2[i]='Physics';
                }else if(this.BookGenres2[i]=='Romance'||this.BookGenres2[i]=='Love'){
                  this.BookGenres2[i]='Romance';
                }else if(this.BookGenres2[i]=='Science Fiction'){
                  this.BookGenres2[i]='Science-Fiction';
                }else if(this.BookGenres2[i]=='Westerns'){
                  this.BookGenres2[i]='Western';
                }else if(this.BookGenres2[i]=='World War II'||this.BookGenres2[i]=='Holocaust'){
                  this.BookGenres2[i]='War';
                }
            }

            console.log("NEW GENRES AFTER REPLACING (2):")
            console.log(this.BookGenres2);

            this.BookGenres2 = Array.from(new Set(this.BookGenres2));

            for(let i=0;i<this.BookGenres2.length;i++){
              if(this.BookGenres2[i]=='Animation'||this.BookGenres2[i]=='Anime'
              ||this.BookGenres2[i]=='Arts'||this.BookGenres2[i]=='Business'
              ||this.BookGenres2[i]=='Comedy'||this.BookGenres2[i]=='Documentary'
              ||this.BookGenres2[i]=='Fantasy'||this.BookGenres2[i]=='History'
              ||this.BookGenres2[i]=='Horror'||this.BookGenres2[i]=='Hospitality'
              ||this.BookGenres2[i]=='Life-Science'||this.BookGenres2[i]=='Musical'
              ||this.BookGenres2[i]=='Mystery'||this.BookGenres2[i]=='Physics'
              ||this.BookGenres2[i]=='Romance'||this.BookGenres2[i]=='Science-Fiction'
              ||this.BookGenres2[i]=='War'||this.BookGenres2[i]=='Western'
              ||this.BookGenres2[i]=='Thriller'||this.BookGenres2[i]=='Action'
              ||this.BookGenres2[i]=='Geography'||this.BookGenres2[i]=='Mathematics'
              ||this.BookGenres2[i]=='Adventure'){
                this.myBookGenres2.push(this.BookGenres2[i]);
                if(this.myBookGenres2.length==3){
                  break;
                }
              }
            }
            console.log("NEW GENRES AFTER FILTERING (2):")
            console.log(this.myBookGenres2);

                          
             
            console.log("REFINED GENRES:")
            console.log(this.myBookGenres1);
            console.log(this.myBookGenres2);
          } 
              } 
              
            }
          })
        }
       

        if(!this.moviesIsFetched){
          console.log("Movies CALLED:")
          this.moviesIsFetched = true;
          this.store.dispatch(new GetRecommendedMovies(this.profile._id));
          this.movies$.pipe().subscribe((movies) => {
            if(movies){
              if(movies.length == undefined){
                this.moviesIsFetched = false
              }

              else{
                console.log("Movies:")
              console.log(movies);
              this.movies = movies;
              console.log("My Movies:")
              console.log(this.movies);
              console.log("Movies are EQUAL")
              if(this.movies){
                console.log("Movies are EQUAL2")
      
                  this.MovieTitle1 = this.movies[0].Title;
                  this.MovieTitle2 = this.movies[1].Title;
                 
                console.log("Movie Titles:");
                console.log(this.MovieTitle1);
                console.log(this.MovieTitle2);

                  if(this.movies[0].Title.includes(',')){
                    const Index = this.movies[0].Title.indexOf(',');
                    if (Index !== -1) {
                      this.MovieTitle1 = this.movies[0].Title.substring(0, Index );
                    }
                  }
      
                  if(this.movies[0].Title.includes(':')){
                    const Index = this.movies[0].Title.indexOf(':');
                    if (Index !== -1) {
                      this.MovieTitle1 = this.movies[0].Title.substring(0, Index);
                    }
                  }
      
                  if(this.movies[0].Title.includes('/')){
                    const Index = this.movies[0].Title.indexOf('/');
                    if (Index !== -1) {
                      this.MovieTitle1 = this.movies[0].Title.substring(0, Index);
                    }
                  }
      
                  if(this.movies[1].Title.includes(',')){
                    const Index = this.movies[1].Title.indexOf(',');
                    if (Index !== -1) {
                      this.MovieTitle2 = this.movies[1].Title.substring(0, Index );
                    }
                  }
      
                  if(this.movies[1].Title.includes(':')){
                    const Index = this.movies[1].Title.indexOf(':');
                    if (Index !== -1) {
                      this.MovieTitle2 = this.movies[1].Title.substring(0, Index);
                    }
                  }
      
                  if(this.movies[1].Title.includes('/')){
                    const Index = this.movies[1].Title.indexOf('/');
                    if (Index !== -1) {
                      this.MovieTitle2 = this.movies[1].Title.substring(0, Index);
                    }
                  }
      
                  

                if(this.movies[0].Genre){
                  const newString = this.movies[0].Genre.replace(/\s/g, '');
                  this.MovieGenres1 = newString.split(',');
                  console.log("New String: " + newString);
                }
                
                if(this.movies[1].Genre){
                  const newString = this.movies[1].Genre.replace(/\s/g, '');
                  this.MovieGenres2 = newString.split(',');  
                  console.log("New String2: " + newString);
   
                }
      
                console.log("GENRES AGAIN:")                
                console.log(this.MovieGenres1);
                console.log(this.MovieGenres2);
                
      
                for(let i = 0; i < this.MovieGenres1.length; i++){
                  if(this.MovieGenres1[i]=='Picture Books'||this.MovieGenres1[i]=='Kids'
                  ||this.MovieGenres1[i]=='Childrens'||this.MovieGenres1[i]=='Comics'){
                    this.MovieGenres1[i]='Animation';
                  }else if(this.MovieGenres1[i]=='Anime'||this.MovieGenres1[i]=='Manga'
                  ||this.MovieGenres1[i]=='Comics Manga'||this.MovieGenres1[i]=='Japan'
                  ||this.MovieGenres1[i]=='Comics'||this.MovieGenres1[i]=='Graphic Novels'){
                    this.MovieGenres1[i]='Anime';
                  }else if(this.MovieGenres1[i]=='Art'||this.MovieGenres1[i]=='Poetry'
                  ||this.MovieGenres1[i]=='Philosophy'||this.MovieGenres1[i]=='Photography'){
                    this.MovieGenres1[i]='Arts';
                  }else if(this.MovieGenres1[i]=='Business'||this.MovieGenres1[i]=='Economics'
                  ||this.MovieGenres1[i]=='Finance'||this.MovieGenres1[i]=='Personal Finance'){
                    this.MovieGenres1[i]='Business';
                  }else if(this.MovieGenres1[i]=='Comedy'||this.MovieGenres1[i]=='Humor'){
                    this.MovieGenres1[i]='Comedy';
                  }else if(this.MovieGenres1[i]=='Nonfiction'||this.MovieGenres1[i]=='Biography Memoir'
                  ||this.MovieGenres1[i]=='Autobiography'||this.MovieGenres1[i]=='Memoir'){
                    this.MovieGenres1[i]='Documentary';
                  }else if(this.MovieGenres1[i]=='High Fantasy'||this.MovieGenres1[i]=='Magic'
                  ||this.MovieGenres1[i]=='Dark Fantasy'||this.MovieGenres1[i]=='Supernatural'){
                    this.MovieGenres1[i]='Fantasy';
                  }else if(this.MovieGenres1[i]=='Historical'||this.MovieGenres1[i]=='History'
                  ||this.MovieGenres1[i]=='Biography'||this.MovieGenres1[i]=='Memoir'
                  ||this.MovieGenres1[i]=='European History'||this.MovieGenres1[i]=='Biography Memoir'
                  ||this.MovieGenres1[i]=='Autobiography'||this.MovieGenres1[i]=='World History'
                  ||this.MovieGenres1[i]=='American History'||this.MovieGenres1[i]=='Military History'
                  ||this.MovieGenres1[i]=='Historical Fiction'){
                    this.MovieGenres1[i]='History';
                  }else if(this.MovieGenres1[i]=='Horror'||this.MovieGenres1[i]=='Thriller'
                  ||this.MovieGenres1[i]=='Suspense'){
                    this.MovieGenres1[i]='Horror';
                  }else if(this.MovieGenres1[i]=='Food'||this.MovieGenres1[i]=='Cooking'
                  ||this.MovieGenres1[i]=='Cookbooks'||this.MovieGenres1[i]=='Food Writing'){
                    this.MovieGenres1[i]='Hospitality';
                  }else if(this.MovieGenres1[i]=='Biology'||this.MovieGenres1[i]=='Evolution'){
                    this.MovieGenres1[i]='Life-Science';
                  }else if(this.MovieGenres1[i]=='Music'){
                    this.MovieGenres1[i]='Musical';
                  }else if(this.MovieGenres1[i]=='Mystery'||this.MovieGenres1[i]=='Thriller'
                  ||this.MovieGenres1[i]=='Crime'||this.MovieGenres1[i]=='Suspense'){
                    this.MovieGenres1[i]='Mystery';
                  }else if(this.MovieGenres1[i]=='Science'){
                    this.MovieGenres1[i]='Physics';
                  }else if(this.MovieGenres1[i]=='Romance'||this.MovieGenres1[i]=='Love'){
                    this.MovieGenres1[i]='Romance';
                  }else if(this.MovieGenres1[i]=='ScienceFiction'){
                    this.MovieGenres1[i]='Science-Fiction';
                  }else if(this.MovieGenres1[i]=='Westerns'){
                    this.MovieGenres1[i]='Western';
                  }else if(this.MovieGenres1[i]=='World War II'||this.MovieGenres1[i]=='Holocaust'){
                    this.MovieGenres1[i]='War';
                  }
              }

              console.log("NEW GENRES AFTER REPLACING (1):")
              console.log(this.MovieGenres1);
              

              this.MovieGenres1 = Array.from(new Set(this.MovieGenres1));

              for(let i=0;i<this.MovieGenres1.length;i++){
                if(this.MovieGenres1[i]=='Animation'||this.MovieGenres1[i]=='Anime'
                ||this.MovieGenres1[i]=='Arts'||this.MovieGenres1[i]=='Business'
                ||this.MovieGenres1[i]=='Comedy'||this.MovieGenres1[i]=='Documentary'
                ||this.MovieGenres1[i]=='Fantasy'||this.MovieGenres1[i]=='History'
                ||this.MovieGenres1[i]=='Horror'||this.MovieGenres1[i]=='Hospitality'
                ||this.MovieGenres1[i]=='Life-Science'||this.MovieGenres1[i]=='Musical'
                ||this.MovieGenres1[i]=='Mystery'||this.MovieGenres1[i]=='Physics'
                ||this.MovieGenres1[i]=='Romance'||this.MovieGenres1[i]=='Science-Fiction'
                ||this.MovieGenres1[i]=='War'||this.MovieGenres1[i]=='Western'
                ||this.MovieGenres1[i]=='Thriller'||this.MovieGenres1[i]=='Action'
                ||this.MovieGenres1[i]=='Geography'||this.MovieGenres1[i]=='Mathematics'
                ||this.MovieGenres1[i]=='Adventure'||this.MovieGenres1[i]==' Animation'||this.MovieGenres1[i]==' Anime'
                ||this.MovieGenres1[i]==' Arts'||this.MovieGenres1[i]==' Business'
                ||this.MovieGenres1[i]==' Comedy'||this.MovieGenres1[i]==' Documentary'
                ||this.MovieGenres1[i]==' Fantasy'||this.MovieGenres1[i]==' History'
                ||this.MovieGenres1[i]==' Horror'||this.MovieGenres1[i]==' Hospitality'
                ||this.MovieGenres1[i]==' Life-Science'||this.MovieGenres1[i]==' Musical'
                ||this.MovieGenres1[i]==' Mystery'||this.MovieGenres1[i]==' Physics'
                ||this.MovieGenres1[i]==' Romance'||this.MovieGenres1[i]==' Science-Fiction'
                ||this.MovieGenres1[i]==' War'||this.MovieGenres1[i]==' Western'
                ||this.MovieGenres1[i]==' Thriller'||this.MovieGenres1[i]==' Action'
                ||this.MovieGenres1[i]==' Geography'||this.MovieGenres1[i]==' Mathematics'
                ||this.MovieGenres1[i]==' Adventure'){
                  this.myMovieGenres1.push(this.MovieGenres1[i]);
                  if(this.myMovieGenres1.length==3){
                    break;
                  }
                }
              }
      
              console.log("NEW GENRES AFTER FILTERING (1):")
              console.log(this.myMovieGenres1);


      
                
              for(let i = 0; i < this.MovieGenres2.length; i++){
                if(this.MovieGenres2[i]=='Picture Books'||this.MovieGenres2[i]=='Kids'
                ||this.MovieGenres2[i]=='Childrens'){
                  this.MovieGenres2[i]='Animation';
                }else if(this.MovieGenres2[i]=='Anime'||this.MovieGenres2[i]=='Manga'
                ||this.MovieGenres2[i]=='Comics Manga'||this.MovieGenres2[i]=='Japan'
                ||this.MovieGenres2[i]=='Comics'||this.MovieGenres2[i]=='Graphic Novels'){
                  this.MovieGenres2[i]='Anime';
                }else if(this.MovieGenres2[i]=='Art'||this.MovieGenres2[i]=='Poetry'
                ||this.MovieGenres2[i]=='Philosophy'||this.MovieGenres2[i]=='Photography'){
                  this.MovieGenres2[i]='Arts';
                }else if(this.MovieGenres2[i]=='Business'||this.MovieGenres2[i]=='Economics'
                ||this.MovieGenres2[i]=='Finance'||this.MovieGenres1[i]=='Personal Finance'){
                  this.MovieGenres2[i]='Business';
                }else if(this.MovieGenres2[i]=='Comedy'||this.MovieGenres2[i]=='Humor'){
                  this.MovieGenres2[i]='Comedy';
                }else if(this.MovieGenres2[i]=='Nonfiction'||this.MovieGenres2[i]=='Biography Memoir'
                ||this.MovieGenres2[i]=='Autobiography'||this.MovieGenres2[i]=='Memoir'){
                  this.MovieGenres2[i]='Documentary';
                }else if(this.MovieGenres2[i]=='High Fantasy'||this.MovieGenres2[i]=='Magic'
                ||this.MovieGenres2[i]=='Dark Fantasy'||this.MovieGenres2[i]=='Supernatural'){
                  this.MovieGenres2[i]='Fantasy';
                }else if(this.MovieGenres2[i]=='Historical'||this.MovieGenres2[i]=='History'
                ||this.MovieGenres2[i]=='Biography'||this.MovieGenres2[i]=='Memoir'
                ||this.MovieGenres2[i]=='European History'||this.MovieGenres2[i]=='Biography Memoir'
                ||this.MovieGenres2[i]=='Autobiography'||this.MovieGenres2[i]=='World History'
                ||this.MovieGenres2[i]=='American History'||this.MovieGenres2[i]=='Military History'
                ||this.MovieGenres2[i]=='Historical Fiction'){
                  this.MovieGenres2[i]='History';
                }else if(this.MovieGenres2[i]=='Horror'||this.MovieGenres2[i]=='Thriller'
                ||this.MovieGenres2[i]=='Suspense'){
                  this.MovieGenres2[i]='Horror';
                }else if(this.MovieGenres2[i]=='Food'||this.MovieGenres2[i]=='Cooking'
                ||this.MovieGenres2[i]=='Cookbooks'||this.MovieGenres2[i]=='Food Writing'){
                  this.MovieGenres2[i]='Hospitality';
                }else if(this.MovieGenres2[i]=='Biology'||this.MovieGenres2[i]=='Evolution'){
                  this.MovieGenres2[i]='Life-Science';
                }else if(this.MovieGenres2[i]=='Music'){
                  this.MovieGenres2[i]='Musical';
                }else if(this.MovieGenres2[i]=='Mystery'||this.MovieGenres2[i]=='Thriller'
                ||this.MovieGenres2[i]=='Crime'||this.MovieGenres2[i]=='Suspense'){
                  this.MovieGenres2[i]='Mystery';
                }else if(this.MovieGenres2[i]=='Science'){
                  this.MovieGenres2[i]='Physics';
                }else if(this.MovieGenres2[i]=='Romance'||this.MovieGenres2[i]=='Love'){
                  this.MovieGenres2[i]='Romance';
                }else if(this.MovieGenres2[i]=='ScienceFiction'){
                  this.MovieGenres2[i]='Science-Fiction';
                }else if(this.MovieGenres2[i]=='Westerns'){
                  this.MovieGenres2[i]='Western';
                }else if(this.MovieGenres2[i]=='World War II'||this.MovieGenres2[i]=='Holocaust'){
                  this.MovieGenres2[i]='War';
                }
            }

            console.log("NEW GENRES AFTER REPLACING (2):")
            console.log(this.MovieGenres2);

            this.MovieGenres2 = Array.from(new Set(this.MovieGenres2));

            for(let i=0;i<this.MovieGenres2.length;i++){
              if(this.MovieGenres2[i]=='Animation'||this.MovieGenres2[i]=='Anime'
              ||this.MovieGenres2[i]=='Arts'||this.MovieGenres2[i]=='Business'
              ||this.MovieGenres2[i]=='Comedy'||this.MovieGenres2[i]=='Documentary'
              ||this.MovieGenres2[i]=='Fantasy'||this.MovieGenres2[i]=='History'
              ||this.MovieGenres2[i]=='Horror'||this.MovieGenres2[i]=='Hospitality'
              ||this.MovieGenres2[i]=='Life-Science'||this.MovieGenres2[i]=='Musical'
              ||this.MovieGenres2[i]=='Mystery'||this.MovieGenres2[i]=='Physics'
              ||this.MovieGenres2[i]=='Romance'||this.MovieGenres2[i]=='Science-Fiction'
              ||this.MovieGenres2[i]=='War'||this.MovieGenres2[i]=='Western'
              ||this.MovieGenres2[i]=='Thriller'||this.MovieGenres2[i]=='Action'
              ||this.MovieGenres2[i]=='Geography'||this.MovieGenres2[i]=='Mathematics'
              ||this.MovieGenres2[i]=='Adventure'||this.MovieGenres2[i]==' Animation'||this.MovieGenres2[i]==' Anime'
              ||this.MovieGenres2[i]==' Arts'||this.MovieGenres2[i]==' Business'
              ||this.MovieGenres2[i]==' Comedy'||this.MovieGenres2[i]==' Documentary'
              ||this.MovieGenres2[i]==' Fantasy'||this.MovieGenres2[i]==' History'
              ||this.MovieGenres2[i]==' Horror'||this.MovieGenres2[i]==' Hospitality'
              ||this.MovieGenres2[i]==' Life-Science'||this.MovieGenres2[i]==' Musical'
              ||this.MovieGenres2[i]==' Mystery'||this.MovieGenres2[i]==' Physics'
              ||this.MovieGenres2[i]==' Romance'||this.MovieGenres2[i]==' Science-Fiction'
              ||this.MovieGenres2[i]==' War'||this.MovieGenres2[i]==' Western'
              ||this.MovieGenres2[i]==' Thriller'||this.MovieGenres2[i]==' Action'
              ||this.MovieGenres2[i]==' Geography'||this.MovieGenres2[i]==' Mathematics'
              ||this.MovieGenres2[i]==' Adventure'){
                this.myMovieGenres2.push(this.MovieGenres2[i]);
                if(this.myMovieGenres2.length==3){
                  break;
                }
              }
            }
            console.log("NEW GENRES AFTER FILTERING (2):")
            console.log(this.myMovieGenres2);

                          
             
            console.log("REFINED GENRES:")
            console.log(this.myMovieGenres1);
            console.log(this.myMovieGenres2);
          } 
              } 
              
            }
          })

        }
      }
    });
}

async addPosts(type: string){
  if(this.profile == null){
    return;
  }

    if (type === "recommended") {
      this.store.dispatch(new GetAllPosts(this.profile?.username));
    } else if (type === "latest") {
      this.store.dispatch(new GetLatestPosts());
    } else {
      this.store.dispatch(new GetPopularPosts());
    }
    if(!this.postsIsFetched){
      
      this.postsIsFetched = true; 
      this.homePosts$.pipe(takeUntil(this.unsubscribe$)).subscribe((posts) => {
      if(posts){
        // console.log("POSTS:")
        this.posts = [];
        const temp = posts;
        temp.forEach((post) => {
          if(post.isPrivate){
            if(this.profile?.communities.includes(post.community)){
              this.posts.push(post);
            }
          }

          else{
            this.posts.push(post);
          }
        })

        // this.posts = posts;
        this.size=posts.length-1;
        // console.log("SIZE: " + this.size)
        for(let i =0;i<posts.length;i++){
          this.likedComments.push(false);
          this.sharing.push(false);

          this.reports.push(false);
          this.postReported.push(false);

          if(posts[i].dateAdded!=null&&posts[i].comments!=null
            &&posts[i].shares!=null){
            this.datesAdded.push(posts[i].dateAdded);
            this.comments.push(posts[i].comments);
            this.shares.push(posts[i].shares);
          }

          if(posts!=null&&posts[i].likes!=null){
            this.likes.push(posts[i].likes?.length);
            

            if(this.profile==undefined){
              return;
            }
            if(posts[i].likes.includes(this.profile.username)){
              this.likedComments[i]=true;
            } 
          }

        }

      }
    })
  }
}

async openPopup() {
  const modal = await this.modalController.create({
    component: CreatePostComponent,
    cssClass: 'custom-modal', // Replace with the component or template for your popup
    componentProps: {
      // Add any input properties or data you want to pass to the popup component
    }
  });

  return await modal.present();
}

async openPopup2() {
  const modal = await this.modalController.create({
    component: CreateCommunityComponent,
    cssClass: 'custom-modal', // Replace with the component or template for your popup
    componentProps: {
      // Add any input properties or data you want to pass to the popup component
    }
  });

  return await modal.present();
}


Report(n:number){
  if(this.posts?.length==null){
    return;
  }
  
  if(this.reports[n]==true){
    this.reports[n]=false;
    return;
  }else{
    for(let k = 0;k<this.reports.length;k++){
      this.reports[k]=false;
   }   
    this.reports[n]=true;

  }

    

}

GoToCommunity(communityName:string){
  this.router.navigate(['home/community-profile/' + communityName]);
}

Like(n:number, post: PostDto){
 
  let likesArr : string[];

  console.log(this.profile?.username + " LIKED POST");
  const emptyArray : string[] = [];

  if(this.profile?.username == null){
    return;
  }
  
  if(post.likes == emptyArray){
    likesArr = [this.profile?.username];
  }

  else{
    likesArr = [...post.likes, this.profile?.username];
  }

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: likesArr,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares,
    comments: post.comments,
    reported: post.reported
  }

  this.store.dispatch(new UpdatePost(post._id, data));
}

Dislike(n:number, post: PostDto){
  this.likedComments[n]=false;
  this.likes[n]--;

  let likesArr = [...post.likes];
  likesArr = likesArr.filter((like) => like !== this.profile?.username);

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: likesArr,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares,
    comments: post.comments,
    reported: post.reported
  }

  this.store.dispatch(new UpdatePost(post._id, data));
}

ReportPost(n:number, post: PostDto){

  if(this.posts?.length==null){
    return;
  }
  
  this.reports[n]=false;  

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: post.likes,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares,
    comments: post.comments,
    reported: true
  }

  this.store.dispatch(new UpdatePost(post._id, data));
}

async Share(n:number, post: PostDto){
  this.shares[n]++;
  for(let i =0;i<this.sharing.length;i++){
    this.sharing[i]=false;
  }
  this.sharing[n]=true;

  const obj = location.origin
  if(obj == undefined){
    return;
  }

  const data : UpdatePostRequest = {
    title: post.title,
    text: post.text,
    imageUrl: post.imageUrl,
    communityImageUrl: post.communityImageUrl,
    categories: post.categories,
    likes: post.likes,
    spoiler: post.spoiler,
    ageRestricted: post.ageRestricted,
    shares: post.shares + 1,
    comments: post.comments,
    reported: post.reported
  }

  this.store.dispatch(new UpdatePost(post._id, data));

  const link : string = obj + '/app-comments-feature/' + post._id;

  await navigator.clipboard.writeText(link)
}

GoToProfile(username: string){
  if(this.profile?.username !== username){
    this.router.navigate(['home/user-profile/' + username]);
  }

  else{
    this.router.navigate(['home/profile']);
  }
}

  recChange(){
    for(let k = 0;k<this.reports.length;k++){
      this.reports[k]=false;
   }   

    this.postsIsFetched = false

    this.addPosts("recommended");
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.add('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.remove('active-button');
    }


  }

  newChange(){
    for(let k = 0;k<this.reports.length;k++){
      this.reports[k]=false;
   }   

   this.postsIsFetched = false

    this.addPosts("latest");
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.add('active-button');
      popBtn.classList.remove('active-button');
    }
  }

  popChange(){
    for(let k = 0;k<this.reports.length;k++){
      this.reports[k]=false;
   }
   
   this.postsIsFetched = false
   
    this.addPosts("popular");
    const recBtn = document.getElementById('recommendedBtn');
    const newBtn = document.getElementById('newBtn');
    const popBtn = document.getElementById('popularBtn');

    if (recBtn && newBtn && popBtn) {
      recBtn.classList.remove('active-button');
      newBtn.classList.remove('active-button');
      popBtn.classList.add('active-button');
    }
  }

  GoToComments(postId : string){
    this.router.navigate(['home/app-comments-feature/' + postId]);
  }

  collapse1 = false;
  collapse2 = false;

  Collapse1(){
    this.collapse1 = !this.collapse1;
  }
  Collapse2(){
    this.collapse2 = !this.collapse2;
  }

  buttonStates: { [key: string]: boolean } = {}; // Object to track state for each button

  handleButtonClick(buttonId: string, CommunityName: string) {
    this.selectedCommunity = CommunityName;

    this.buttonStates[buttonId] = !this.buttonStates[buttonId];

    if(!this.selectedCommunities.includes(CommunityName))
    {

      this.selectedCommunities.push(this.selectedCommunity);

    }else{
      this.selectedCommunities=this.selectedCommunities.filter((community) => community !== this.selectedCommunity);

    }

    console.log(this.selectedCommunities);
  }

  activebutton = 'all';

 changeFilter(btnname : string){
  console.log(btnname);
  const all = document.getElementById('all');
  const books = document.getElementById('books');
  const movies = document.getElementById('movies');
  // const series = document.getElementById('series');
  if(all && books && movies){
    if (btnname == 'all'){
      all.classList.add('active-select');
      books.classList.remove('active-select');
      movies.classList.remove('active-select');
      // series.classList.remove('active-select');
    } else if (btnname == 'books'){
      all.classList.remove('active-select');
      books.classList.add('active-select');
      movies.classList.remove('active-select');
      // series.classList.remove('active-select');
    } else if (btnname == 'movies'){
      all.classList.remove('active-select');
      books.classList.remove('active-select');
      movies.classList.add('active-select');
      // series.classList.remove('active-select');
    } else if (btnname == 'series'){
      all.classList.remove('active-select');
      books.classList.remove('active-select');
      movies.classList.remove('active-select');
      // series.classList.add('active-select');
    }
    
  }
    
  }

  showTooltip = false;
 

}

