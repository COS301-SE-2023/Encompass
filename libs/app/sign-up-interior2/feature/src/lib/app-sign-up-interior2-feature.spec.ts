import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';;
import { SignUpInterior2Component } from './sign-up-interior2.component';
import { ProfileApi, ProfileState } from '@encompass/app/profile/data-access';
import { SignUpCommunitiesApi, SignUpCommunitiesState } from '@encompass/app/sign-up-interior2/data-access';
import { Router } from '@angular/router';

// Mock the Ngxs store
class MockProfileApi {
  // updateProfile(updateProfileRequest: UpdateProfileRequest, userId: string) {}
}


// Mock the SignUpCommunitiesApi service
class MockSignUpCommunitiesApi {
  // updateCommunity(id: string, data: UpdateProfileRequest) {}
}

describe('SignUpInterior2Component', () => {
  let component: SignUpInterior2Component;
  let fixture: ComponentFixture<SignUpInterior2Component>;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SignUpInterior2Component],
        imports: [RouterTestingModule, NgxsModule.forRoot([ProfileState, SignUpCommunitiesState])],
        providers: [
          { provide: SignUpCommunitiesApi, useClass: MockSignUpCommunitiesApi },
          { provide: ProfileApi, useClass: MockProfileApi },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpInterior2Component);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to "/home" on "Done" button click when profile is available and communities are selected', () => {
    component.profile = {
      _id: 'mockId',
      username: 'testUser',
      name: 'John',
      lastName: 'Doe',
      categories: ['category1', 'category2'],
      communities: ['community1', 'community2'],
      awards: ['award1', 'award2'],
      events: ['event1', 'event2'],
      followers: ['follower1', 'follower2'],
      following: ['following1', 'following2'],
      posts: ['post1', 'post2'],
      reviews: ['review1', 'review2'],
      profileImage: 'profile-image-url',
      profileBanner: 'profile-banner-url',
      bio: 'This is a mock profile for testing purposes.',
      ep: 100,
    };

    component.selectedCommunities = ['community1', 'community2'];
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.done();

    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should not navigate to "/home" on "Done" button click when profile is not available', () => {
    const navigateSpy = jest.spyOn(TestBed.inject(Router), 'navigate');

    component.profile = null;
    component.done();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
