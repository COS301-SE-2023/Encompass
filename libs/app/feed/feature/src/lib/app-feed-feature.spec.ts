import { appFeedFeature } from './app-feed-feature';
import { TestBed, ComponentFixture } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FeedPage } from './feed.component';

describe('FeedPage', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [FeedPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the feed page', () => {
    expect(component).toBeTruthy();
  });
  
  // it('should display a list of posts', () => {
  //   // Assume you have a function that fetches posts and assigns them to a variable
  //   component.GetAllPosts();
  //   fixture.detectChanges();
  
  //   const posts = fixture.nativeElement.querySelectorAll('.post');
  //   expect(posts.length).toBeGreaterThan(0);
  // });
  
  // it('should like a post when the like button is clicked', () => {
  //   // Assume you have a function that simulates liking a post
  //   const postId = '12345';
  //   const initialLikes = component.posts.find((post) => post.id === postId).likes;
    
  //   component.likePost(postId);
  //   fixture.detectChanges();
  
  //   const updatedLikes = component.posts.find((post) => post.id === postId).likes;
  //   expect(updatedLikes).toBe(initialLikes + 1);
  // });
  
});


// describe('appFeedFeature', () => {
//   it('should work', () => {
//     expect(appFeedFeature()).toEqual('app-feed-feature');
//   });
// });
