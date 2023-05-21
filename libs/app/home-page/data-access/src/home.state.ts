import { Injectable } from "@nestjs/common";
import { HomeApi } from "./home.api";
import { Action } from "@ngxs/store";
import { getHome } from "@encompass/app/home-page/util";

@Injectable()
export class HomeState{
  constructor(private homeApi: HomeApi){}

  @Action(getHome)
  async getHome( {payload}: getHome){
    // const state = ctx.getState();
    const response = await this.homeApi.getHome();
    const rsp = response.data;

    console.log(rsp);
  }
}