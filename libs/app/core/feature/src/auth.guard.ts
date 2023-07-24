import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // if(this.authService.isLoggedIn()) {
    //   return true;
    // }

    // else{
    //   this.router.navigate(['']);

    //   return false;
    // }

    const url = state.url;

    return this.checkLogin();
  }

  checkLogin(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting

    // Create a dummy session id

    // Set our navigation extras object
    // that contains our global query params and fragment

    // Navigate to the login page with extras
    this.router.navigate(['']);

    return false;
  }
}