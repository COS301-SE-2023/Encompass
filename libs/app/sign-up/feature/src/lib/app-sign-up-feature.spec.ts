import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { IonicModule } from '@ionic/angular';
import { SignUpComponent } from './sign-up.component';
import { Store } from '@ngxs/store';
import { SignUp } from '@encompass/app/sign-up/util';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('SignUpPage', () => {
  let fixture: ComponentFixture<SignUpComponent>;
  let component: SignUpComponent;
  let store: Store;
  let signupSpy: jest.SpyInstance;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SignUpComponent],
        imports: [
          IonicModule.forRoot(),
          RouterTestingModule,
          FormsModule,
          NgxsModule.forRoot([]),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SignUpComponent);
      component = fixture.componentInstance;
      store = TestBed.inject(Store);

      signupSpy = jest.spyOn(store, 'dispatch');
      signupSpy.mockReturnValue(of({ _id: '123', email: 'test@example.com' }));
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the "Sign Up" button when form is incomplete', () => {
    component.user.email = 'test@example.com';
    component.user.password = '12345678';
    component.user.username = '';
    component.user.firstName = '';
    component.user.lastName = '';
    component.checked = true;

    component.checkInput();
    fixture.detectChanges();

    const signUpButton: HTMLButtonElement = fixture.nativeElement.querySelector('.btn2');
    expect(signUpButton.disabled).toBe(true);
  });

  it('should enable the "Sign Up" button when form is complete and "Terms of Service" is checked', () => {
    component.user.email = 'test@example.com';
    component.user.password = '12345678';
    component.user.username = 'testuser';
    component.user.firstName = 'John';
    component.user.lastName = 'Doe';
    component.checked = true;

    component.checkInput();
    fixture.detectChanges();

    const signUpButton: HTMLButtonElement = fixture.nativeElement.querySelector('.btn1');
    expect(signUpButton.disabled).toBe(false);
  });

  // it('should navigate to "tscs" on "Terms of Service" label click', () => {
  //   // Mock the router navigation
  //   const router = TestBed.inject(Router);
  //   const navigateSpy = jest.spyOn(router, 'navigate');

  //   // Trigger the "Terms of Service" label click
  //   const tosLabel: DebugElement = fixture.debugElement.query(By.css('.TOS'));
  //   tosLabel.nativeElement.click();

  //   // Assert navigation
  //   expect(navigateSpy).toHaveBeenCalledWith(['tscs']);
  // });

  it('should navigate to "sign-up-categories" on successful signup', () => {
    const route = TestBed.inject(Router);
    const navSpy = jest.spyOn(route, 'navigate');
    component.SignUp();

    expect(signupSpy).toHaveBeenCalledWith(expect.any(SignUp));

    signupSpy.mockReturnValueOnce(of({ _id: '123', email: 'test@example.com' }));
    fixture.detectChanges();

    expect(navSpy).toHaveBeenCalledWith(['sign-up-categories']);
  });

  afterEach(() => {
    signupSpy.mockClear();
  });
});
