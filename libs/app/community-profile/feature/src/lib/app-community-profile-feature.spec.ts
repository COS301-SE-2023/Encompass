import { appCommunityProfileFeature } from './app-community-profile-feature';

describe('appCommunityProfileFeature', () => {
  it('should work', () => {
    expect(appCommunityProfileFeature()).toEqual(
      'app-community-profile-feature'
    );
  });
});


// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { CommunityProfileComponent } from './community-profile.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Store, NgxsModule } from '@ngxs/store';
// import { of } from 'rxjs';
// import {
//   AddCommunityRequest,
//   GetCommunity,
//   RemoveCommunityRequest,
//   UpdateCommunity,
// } from '@encompass/app/community-profile/util';
// import { AddCommunity, RemoveCommunity } from '@encompass/app/profile/util';
// import { CommunityDto } from '@encompass/api/community/data-access';
// import {
//   CommunityApi,
//   CommunityState,
// } from '@encompass/app/community-profile/data-access';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { IonicModule } from '@ionic/angular';
// import { ProfileState } from '@encompass/app/profile/data-access';
// import { ProfileDto } from '@encompass/api/profile/data-access';

// describe('CommunityProfileComponent', () => {
//   let component: CommunityProfileComponent;
//   let fixture: ComponentFixture<CommunityProfileComponent>;
//   let store: Store;

//   const mockProfile = {
//     _id: '123',
//     username: 'testuser',
//     name: 'Test',
//     lastName: 'User',
//     categories: [],
//     communities: [],
//     awards: [],
//     events: [],
//     followers: [],
//     following: [],
//     posts: [],
//     reviews: [],
//     profileImage: 'testimage.png',
//     profileBanner: 'testbanner.png',
//     bio: 'This is a test bio',
//     ep: 0,
//   };

//   const mockCommunity: CommunityDto = {
//     _id: 'community123',
//     name: 'MockCommunity',
//     type: 'Public',
//     admin: 'AdminUser',
//     about: 'This is a mock community.',
//     rules: 'No spamming, be respectful, etc.',
//     groupImage: 'groupImage.png',
//     bannerImage: 'bannerImage.png',
//     categories: ['Category1', 'Category2'],
//     events: ['Event1', 'Event2'],
//     posts: ['post1', 'post2'],
//     members: ['User1', 'User2', 'AdminUser'],
//     ageRestricted: false,
//     createdAt: '2023-08-10T12:34:56Z',
//     communityEP: 500,
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [CommunityProfileComponent],
//       imports: [
//         IonicModule.forRoot(),
//         RouterTestingModule,
//         ReactiveFormsModule,
//         FormsModule,
//         NgxsModule.forRoot([]),
//       ],
//       providers: [
//         {
//           provide: Store,
//           useValue: {
//             dispatch: jest.fn(),
//           },
//         },
//         {
//           provide: CommunityApi,
//           useValue: {
//             uploadFile: jest.fn(),
//             getUser: jest.fn(),
//           },
//         },
//       ],
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(CommunityProfileComponent);
//     component = fixture.componentInstance;
//     store = TestBed.inject(Store);
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should fetch community data from the store', () => {
//     const mockCommunityId = 'community123';
//     const getCommunityAction = new GetCommunity(mockCommunityId);

//     store.select = jest.fn((selector: any) => {
//       if (selector === CommunityState.community) {
//         return of(mockCommunity);
//       } else if (selector === ProfileState.profile) {
//         return of(mockProfile);
//       } else if (selector === CommunityState.posts) {
//         return of([]);
//       }
//       return of(null);
//     });

//     store.dispatch(getCommunityAction);

//     fixture.detectChanges();
//     component.community$.subscribe((community) => {
//       expect(community).toEqual(mockCommunity);
//     });
//   });

//   it('should handle joining the community', () => {
//     component.profile = mockProfile;
//     component.community = mockCommunity;

//     component.join();

//     const mockUpdateCommunity = {
//       name: mockCommunity.name,
//       type: mockCommunity.type,
//       admin: mockCommunity.admin,
//       about: mockCommunity.about,
//       rules: mockCommunity.rules,
//       groupImage: mockCommunity.groupImage,
//       bannerImage: mockCommunity.bannerImage,
//       categories: mockCommunity.categories,
//       events: mockCommunity.events,
//       posts: mockCommunity.posts,
//       members: [...mockCommunity.members, mockProfile.username],
//       ageRestricted: mockCommunity.ageRestricted,
//       communityEP: mockCommunity.communityEP,
//     };

//     expect(store.dispatch).toHaveBeenCalledWith(
//       new UpdateCommunity(mockCommunity._id, mockUpdateCommunity)
//     );
//     expect(store.dispatch).toHaveBeenCalledWith(
//       new AddCommunity(mockCommunity.name, mockProfile.username)
//     );
//   });

//   it('should leave the community', () => {
//     component.profile = mockProfile;
//     component.community = mockCommunity;
//     store.dispatch = jest.fn();

//     component.leave();

//     expect(store.dispatch).toHaveBeenCalledWith(
//       new UpdateCommunity(mockCommunity._id, expect.any(Object))
//     );
//     expect(store.dispatch).toHaveBeenCalledWith(
//       new RemoveCommunity(mockCommunity.name, mockProfile.username)
//     );
//   });

//   it('should request to join the community', () => {
//     component.profile = mockProfile;
//     component.community = mockCommunity;
//     store.dispatch = jest.fn();

//     component.requestJoin();

//     expect(store.dispatch).toHaveBeenCalledWith(
//       new AddCommunityRequest(mockCommunity._id, mockProfile.username)
//     );
//   });

//   it('should request to unjoin the community', () => {
//     component.profile = mockProfile;
//     component.community = mockCommunity;

//     store.dispatch = jest.fn();
//     component.requestUnjoin();

//     expect(store.dispatch).toHaveBeenCalledWith(
//       new RemoveCommunityRequest(mockCommunity._id, mockProfile.username)
//     );
//   });

//   // it('should update community data on submit', async () => {
//   //   // Prepare the component with the profile and community data
//   //   component.profile = mockProfile;
//   //   component.community = mockCommunity;
//   //   component.file = new File([], 'test-image.png');
//   //   component.fileBanner = new File([], 'test-banner.png');
//   //   const uploadImageUrl = 'groupImage.png';
//   //   const uploadBannerUrl = 'bannerImage.png';
//   //   const updateCommunitySpy = jest
//   //     .spyOn(store, 'dispatch')
//   //     .mockReturnValue(of({}));
//   //   const uploadImageSpy = jest
//   //     .spyOn(CommunityApi.prototype, 'uploadFile')
//   //     .mockResolvedValueOnce(uploadImageUrl)
//   //     .mockResolvedValueOnce(uploadBannerUrl);

//   //   await component.onSubmit();

//   //   // Check that the store dispatch was called to update the community
//   //   expect(updateCommunitySpy).toHaveBeenCalledWith(
//   //     new UpdateCommunity(mockCommunity._id, expect.any(Object))
//   //   );

//   //   // Check that the uploadImage method was called for both images
//   //   expect(uploadImageSpy).toHaveBeenCalledWith(
//   //     component.file,
//   //     component.fileName
//   //   );
//   //   expect(uploadImageSpy).toHaveBeenCalledWith(
//   //     component.fileBanner,
//   //     component.fileNameBanner
//   //   );

//   //   // Check that the community groupImage and bannerImage are updated
//   //   expect(component.community?.groupImage).toBe(uploadImageUrl);
//   //   expect(component.community?.bannerImage).toBe(uploadBannerUrl);

//   //   await component.onSubmit();

//   // });
//   // it('should add a user to the community when accepting', async () => {
//   //   // Prepare the component with the profile and community data
//   //   component.profile = mockProfile;
//   //   component.community = mockCommunity;
//   //   const newUser: ProfileDto = {
//   //     _id: '321',
//   //     username: 'newUser',
//   //     name: 'Test',
//   //     lastName: 'User',
//   //     categories: [],
//   //     communities: [],
//   //     awards: [],
//   //     events: [],
//   //     followers: [],
//   //     following: [],
//   //     posts: [],
//   //     reviews: [],
//   //     profileImage: 'testimage.png',
//   //     profileBanner: 'testbanner.png',
//   //     bio: 'This is a test bio',
//   //     ep: 0
//   //   };
//   //   const getUserSpy = jest
//   //     .spyOn(CommunityApi.prototype, 'getUser')
//   //     .mockResolvedValue(newUser);

//   //   const updateCommunitySpy = jest
//   //     .spyOn(store, 'dispatch')
//   //     .mockReturnValue(of({}));

//   //   // Call the acceptUser method
//   //   await component.acceptUser('newUser');

//   //   // Check that the getUser method was called with the correct username
//   //   expect(getUserSpy).toHaveBeenCalledWith('newUser');

//   //   // Check that the store dispatch was called to update the community and user settings
//   //   expect(updateCommunitySpy).toHaveBeenCalledWith(
//   //     new UpdateCommunity(mockCommunity._id, expect.any(Object))
//   //   );
//   //   expect(updateCommunitySpy).toHaveBeenCalledWith(
//   //     new RemoveCommunityRequest(mockCommunity._id, 'newUser')
//   //   );

//   //   // Check that the community members and EP are updated
//   //   expect(component.community?.members).toContain('newUser');
//   //   expect(component.community?.communityEP).toBe(
//   //     mockCommunity.communityEP + newUser.ep
//   //   );
//   // });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });
// });
