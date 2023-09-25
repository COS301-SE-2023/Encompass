import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './comments.component';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { CommentDto } from '@encompass/api/comment/data-access';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddNotificationRequest } from '@encompass/api/notifications/data-access';
import { SendNotification } from '@encompass/app/comments/util';
import { CommentsApi, CommentsState } from '@encompass/app/comments/data-access';
import { PostDto } from '@encompass/api/post/data-access';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;

  const mockPost : PostDto = {
    _id: '123',
    community: 'testcommunity',
    title: 'Test Post',
    text: 'This is a test post',
    username: 'testuser',
    imageUrl: null,
    communityImageUrl: null,
    categories: [],
    likes: [],
    dislikes: [],
    dateAdded: new Date(),
    spoiler: false,
    ageRestricted: false,
    shares: 0,
    comments: 1,
    reported: false,
    isPrivate: false,
  };
  const mockProfile = {
    _id: '123',
    username: 'testuser',
    name: 'Test',
    lastName: 'User',
    categories: [],
    communities: [],
    awards: [],
    events: [],
    followers: [],
    following: [],
    posts: [],
    reviews: [],
    profileImage: 'testimage.png',
    profileBanner: 'testbanner.png',
    bio: 'This is a test bio',
    ep: 0,
  };

  const mockComment: CommentDto = {
    _id: 'comment123',
    postId: 'post123',
    username: 'testuser',
    text: 'This is a test comment',
    replies: [],
    dateAdded: new Date(),
    profileImage: 'testimage.png',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentsComponent],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        NgxsModule.forRoot([]),
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
          },
        },
        {
          provide: CommentsState,
          useValue: {
            dispatch: jest.fn(),
          }
        },
        {
          provide: CommentsApi,
          useValue: {
            addCoins: jest.fn(),
          }
        }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;
    component.commentForm = new FormGroup({
      comment: new FormControl(''),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a comment to the post and reset the comment form when a valid comment is submitted', () => {
    const mockComment = 'This is a very long comment';
    const addCommentSpy = jest.spyOn(CommentsComponent.prototype, 'AddComment');
    const storeDispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    const commentFormResetSpy = jest.spyOn(component.commentForm, 'reset');

    component.post = mockPost;
    component.profile = mockProfile;
    component.commentForm.get('comment')?.setValue(mockComment);
    component.AddComment();

    expect(addCommentSpy).toHaveBeenCalled();
    expect(storeDispatchSpy).toHaveBeenCalled();
    expect(commentFormResetSpy).toHaveBeenCalled();
  });

  it('should not add a comment to the post and not reset the comment form when a comment with a null value is submitted', () => {
    const mockComment = null;
    const addCommentSpy = jest.spyOn(CommentsComponent.prototype, 'AddComment');
    const storeDispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    const commentFormResetSpy = jest.spyOn(component.commentForm, 'reset');

    component.post = mockPost;
    component.profile = mockProfile;
    component.comment?.setValue(mockComment);
    component.AddComment();

    expect(addCommentSpy).toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(commentFormResetSpy).not.toHaveBeenCalled();
  });

  it('should not add a reply to a comment and not reset the reply form when an invalid reply is submitted', () => {
    const mockInvalidReply = null;
    const commentIndex = 0;
    const addReplySpy = jest.spyOn(component, 'PostReply');
    const storeDispatchSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');
    const replyFormResetSpy = jest.spyOn(component.replyForm, 'reset');

    component.replyField?.setValue(mockInvalidReply);
    component.replyField?.markAsDirty();
    component.PostReply(mockComment, commentIndex);

    expect(addReplySpy).toHaveBeenCalled();
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    expect(replyFormResetSpy).not.toHaveBeenCalled();
  });

  it('should add a reply to a comment and reset the reply form when a valid reply is submitted', () => {
    // Initialize component properties and form values as needed
    // Choose a specific comment index for testing
    const commentIndex = 0;
    // const mockComment: CommentDto = component.comments[commentIndex];
    const mockValidReply = 'This is a valid reply';

    // Set up spies for relevant methods
    const addReplySpy = jest.spyOn(component, 'PostReply');

    // Set up the component for testing
    component.replyField?.setValue(mockValidReply);
    component.replyField?.markAsTouched() // Mark the field as dirty to trigger validation
    component.PostReply(mockComment, commentIndex);

    // Assertions
    expect(addReplySpy).toHaveBeenCalled();
  });

  it('should update the post and send a notification when a valid reply is submitted', () => {
    const mockNotification = {
      description: 'This is a valid repl...',
      picture: 'testimage.png',
      sentBy: 'Test User',
      title: 'Replied to your comment',
      username: 'testuser',
    };
    const commentIndex = 0;
    const mockComment: CommentDto = {
      _id: 'comment123',
      dateAdded: new Date(),
      postId: '123',
      profileImage: 'testimage.png',
      replies: [],
      text: 'This is a test comment',
      username: 'testuser',
    };
    const mockValidReply = 'This is a valid reply';

    const sendNotificationSpy = jest.spyOn(TestBed.inject(Store), 'dispatch');

    component.post = mockPost;
    component.profile = mockProfile;
    component.replyField?.setValue(mockValidReply);
    component.PostReply(mockComment, commentIndex);

    const mockNotificationRequest: AddNotificationRequest = {
      description: mockNotification.description,
      picture: mockNotification.picture,
      sentBy: mockNotification.sentBy,
      title: mockNotification.title,
    };
    const expectedNotificationAction = new SendNotification(
      mockProfile.username,
      mockNotificationRequest
    );
    expect(sendNotificationSpy).toHaveBeenCalledWith(
      expectedNotificationAction
    );
  });
});
