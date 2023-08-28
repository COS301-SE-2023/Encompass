import { Injectable } from "@angular/core";
import { ProfileLeaderboardDto } from "@encompass/api/profile-leaderboard/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { EventApi } from "./event.api";
import { GetLeaderboard } from "@encompass/app/event/util";

export interface EventLeaderboardModel {
  leaderboardForm: {
    model: {
      leaderboard: ProfileLeaderboardDto[] | null;
    }
  }
}

@State<EventLeaderboardModel>({
  name: 'profileLeaderboard',
  defaults: {
    leaderboardForm: {
      model: {
        leaderboard: null
      }
    }
  }
})

@Injectable()
export class EventState{
  constructor(private eventApi: EventApi){}

  @Action(GetLeaderboard)
  async getLeaderboard(ctx: StateContext<EventLeaderboardModel>){
    const leaderboard = await this.eventApi.getEvents();

    if(leaderboard === null || leaderboard === undefined){
      return;
    }

    ctx.setState({
      leaderboardForm: {
        model: {
          leaderboard: leaderboard
        }
      }
    })
  }

  @Selector()
  static leaderboard(state: EventLeaderboardModel){
    return state.leaderboardForm.model.leaderboard;
  }
}