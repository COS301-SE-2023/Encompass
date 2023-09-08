import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor( private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const id = this.getExpireLocalStorage('UserID');
    if(id === null){
      this.router.navigate(['']);
      return false;
    }

    else{
      return true;
    }
  }

  getExpireLocalStorage(key: string): string | null{
    const item = localStorage.getItem(key);
    
    if(!item){
      return null;
    }

    const store = JSON.parse(item);

    if(Date.now() > store.expirationTime){
      localStorage.removeItem(key)
      return null;
    }

    else{
      localStorage.removeItem(key);
      this.setExpireLocalStorage(key, store.value, 3600000);
    }

    return store.value;
  }

  setExpireLocalStorage(key: string, value: string, expirationTime: number){
    const item = {
      value: value,
      expirationTime: Date.now() + expirationTime
    };

    localStorage.setItem(key, JSON.stringify(item));
  }
}