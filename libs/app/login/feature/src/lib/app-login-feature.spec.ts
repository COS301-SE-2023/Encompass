import { IonicModule } from '@ionic/angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
// import { LoginApi } from '@encompass/app/login/data-access'; // Import the LoginApi service
import { ToastController } from '@ionic/angular';
// import { LoginStateModel, LoginState, LoginModel } from '@encompass/app/login/data-access';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let store: Store;
  let toastController: ToastController;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientModule, // Include HttpClientModule
        NgxsModule.forRoot([]), // Provide appropriate NGXS modules
      ],
      declarations: [LoginComponent],
      providers: [
        // Provide the LoginApi service
        // LoginApi,
        ToastController, // Mock ToastController
        Store,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    toastController = TestBed.inject(ToastController);
    dispatchSpy = jest.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have a title label "Encompass"', () => {
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.Title');
    expect(titleElement.textContent).toContain('Encompass');
  });

  it('should have an email input field', () => {
    const emailInput: HTMLElement = fixture.nativeElement.querySelector('ion-input[name="email"]');
    expect(emailInput).toBeTruthy();
  });

  it('should have a password input field', () => {
    const passwordInput: HTMLElement = fixture.nativeElement.querySelector('ion-input[name="password"]');
    expect(passwordInput).toBeTruthy();
  });

  it('should have a "Forgot Password?" link', () => {
    const forgotPasswordLink: HTMLElement = fixture.nativeElement.querySelector('.ForgotPassword');
    expect(forgotPasswordLink.textContent).toContain('Forgot Password?');
  });

  it('should show the enabled login button when isValid is true', () => {
    component.isValid = true;
    fixture.detectChanges();
    const loginButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn1');
    expect(loginButton).toBeTruthy();
    expect(loginButton?.disabled).toBe(false);
  });

  it('should show the disabled login button when isValid is false', () => {
    component.isValid = false;
    fixture.detectChanges();
    const loginButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn2');
    expect(loginButton).toBeTruthy();
    expect(loginButton?.disabled).toBe(true);
  });

  it('should have a "Log in" button enabled when isValid is true', () => {
    component.isValid = true;
    fixture.detectChanges(); // Trigger change detection

    const loginButtonDebug = fixture.debugElement.query(By.css('.btn1'));
    expect(loginButtonDebug).toBeTruthy();
    expect(loginButtonDebug.nativeElement.disabled).toBe(false);

    // Simulate a click and verify that LogIn method is called
    const logInSpy = jest.spyOn(component, 'LogIn');
    loginButtonDebug.triggerEventHandler('click', null);
    expect(logInSpy).toHaveBeenCalled();
  });

  it('should not call LogIn when login button is clicked and is disabled', () => {
    component.isValid = false;
    jest.spyOn(component, 'LogIn');
    const loginButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('.btn2');
    loginButton?.click();
    expect(component.LogIn).not.toHaveBeenCalled();
  });

  it('should set isValid to false for invalid email input', () => {
    // Set up the user object with an invalid email
    component.user.email = 'invalid_email';
    component.user.password = 'valid_password123';
  
    // Trigger the checkInput method
    component.checkInput();
  
    // Expect isValid to be false
    expect(component.isValid).toBe(false);
  });
  
  it('should set isValid to true for valid email input', () => {
    // Set up the user object with a valid email
    component.user.email = 'valid_email@example.com';
    component.user.password = 'valid_password123';
  
    // Trigger the checkInput method
    component.checkInput();
  
    // Expect isValid to be true
    expect(component.isValid).toBe(true);
  });
  
});
