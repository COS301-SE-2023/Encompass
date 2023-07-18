import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn(): boolean {
    const id = this.getExpireLocalStorage('UserID');

    if(id === null){
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