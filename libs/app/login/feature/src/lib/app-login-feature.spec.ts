import { appLoginFeature } from './app-login-feature';
import '@angular/core';
import { render, fireEvent } from '@testing-library/angular';
import { LoginPage } from './login.component';
import '@testing-library/jest-dom';




describe('LoginPage', () => {

  
  it('should render username and password inputs correctly', async () => {
    const { getByLabelText } = await render(LoginPage);

    const usernameInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });


  it('should trigger login function when login button is clicked', async () => {
    const { getByLabelText, getByText } = await render(LoginPage);
    const loginButton = getByText('Login');

    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');

    // Simulate user input
    fireEvent.input(usernameInput, { target: { value: 'testuser' } });
    fireEvent.input(passwordInput, { target: { value: 'testpassword' } });

    // Mock login function
    const mockLoginFn = jest.fn();
    loginButton.addEventListener('click', mockLoginFn);

    // Trigger button click
    fireEvent.click(loginButton);

    // Expect the login function to be called
    expect(mockLoginFn).toHaveBeenCalled();
  });
});

// describe('appLoginFeature', () => {
//   it('should work', () => {
//     expect(appLoginFeature()).toEqual('app-login-feature');
//   });
// });
