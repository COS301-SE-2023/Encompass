import { Component } from '@angular/core';
import { HomeApi } from '@encompass/app/home-page/data-access';
import { Select, Store } from '@ngxs/store';
import { HomeState } from '@encompass/app/home-page/data-access';
import { Observable } from 'rxjs';
import { HomeDto } from '@encompass/api/home/data-access';
import { Router } from '@angular/router';
import { getHome } from '@encompass/app/home-page/util';
import { Console } from 'console';

@Component({
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePage {
  // @Select(HomeState.home) home$! : Observable<HomeDto>;
  
  // constructor(private router: Router, private store: Store){
  //   console.log("Home Page");
  //   this.store.dispatch(new getHome());
  //   this.home$.subscribe((home) => {
  //     if(home){
  //       console.log(home.name);
  //     }
  //   });
  // }
}
