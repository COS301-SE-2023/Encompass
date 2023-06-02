import { Injectable } from "@angular/core";
import { HomeApi } from "./home.api";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { getHome } from "@encompass/app/home-page/util";
import { HomeDto } from "@encompass/api/home/data-access";

export interface HomeStateModel{
  HomeForm: {
    model: {
      home: HomeDto | null
    }
  }
}

@State<HomeStateModel>({
  name: 'home',
  defaults: {
    HomeForm: {
      model: {
        home: null
      }
    }
  }
})

@Injectable()
export class HomeState{
  constructor(private homeApi: HomeApi){}

  @Action(getHome)
  async getHome(ctx: StateContext<HomeStateModel>){
    console.log("Here 1")
    // const state = ctx.getState();
    const response = await this.homeApi.getHome();
    //const rsp = response.;
    console.log("Here");
    console.log(response);
  }

  @Selector()
  static home(state: HomeStateModel)
  {
    console.log(state.HomeForm.model.home)
    return state.HomeForm.model.home;
  }
}