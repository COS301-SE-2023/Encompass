import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SignUpInterior1Component } from './sign-up-interior1.component';
import { UpdateProfile } from '@encompass/app/profile/util';
import { Router } from '@angular/router';
class MockProfileDto {
  _id = '';
  username = '';
  name = '';
  lastName = '';
  categories = [];
  communities = [];
  awards = [];
  events = [];
  followers = [];
  following = [];
  posts = [];
  reviews = [];
  profileImage = '';
  profileBanner = '';
  bio = '';
  ep = 0;
}

describe('SignUpInterior1Page', () => {
  let component: SignUpInterior1Component;
  let fixture: ComponentFixture<SignUpInterior1Component>;
  let router: Router;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpInterior1Component],
      imports: [RouterTestingModule, NgxsModule.forRoot([])],
    });

    fixture = TestBed.createComponent(SignUpInterior1Component);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "sign-up-communities" on "Next" button click when profile is available', () => {
    const profileId = '123';
    const mockProfile = new MockProfileDto();
    mockProfile._id = profileId;
    component.profile = mockProfile;

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.next();

    expect(navigateSpy).toHaveBeenCalledWith(['sign-up-communities']);
    expect(store.dispatch).toHaveBeenCalledWith(new UpdateProfile(expect.any(Object), profileId));
  });

  it('should toggle category selection and enable "Next" button when at least 5 categories are selected', () => {
    const buttonId = 'Mathematics';

    component.buttonPressed(buttonId);

    expect(component.categories).toContain(buttonId);
    expect(component.isValid).toBe(false);

    const additionalCategories = ['Action', 'Science-Fiction', 'Drama', 'Romance'];
    additionalCategories.forEach((category) => {
      component.buttonPressed(category);
    });

    expect(component.categories).toEqual(expect.arrayContaining(additionalCategories));
    expect(component.isValid).toBe(true);
  });

  it('should remove category from selection and disable "Next" button when categories are deselected', () => {
    const selectedCategories = ['Mathematics', 'Action', 'Science-Fiction', 'Drama', 'Romance'];
    selectedCategories.forEach((category) => {
      component.buttonPressed(category);
    });

    const deselectedCategory = 'Mathematics';
    component.buttonPressed(deselectedCategory);

    expect(component.categories).not.toContain(deselectedCategory);
    expect(component.isValid).toBe(false);
  });
});
