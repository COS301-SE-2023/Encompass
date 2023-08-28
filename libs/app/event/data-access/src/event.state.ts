import { Injectable } from "@angular/core";
import { ProfileLeaderboardDto } from "@encompass/api/profile-leaderboard/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { EventApi } from "./event.api";
import { GetEvents, GetLeaderboard } from "@encompass/app/event/util";
import { EventDto } from "@encompass/api/event/data-access";

export interface EventLeaderboardModel {
  leaderboardForm: {
    model: {
      leaderboard: ProfileLeaderboardDto[] | null;
    }
  }
}

export interface EventStateModel {
  eventForm:{
    model: {
      events: EventDto[] | null;
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

@State<EventStateModel>({
  name: 'eventModel',
  defaults: {
    eventForm: {
      model: {
        events: null
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

  @Action(GetEvents)
  async getEvents(ctx: StateContext<EventStateModel>, {communities}: GetEvents){
    let events: EventDto[] = [];
    communities.forEach(async (community) => {
      const communityEvents = await this.eventApi.getEventsByCommunity(community);

      if(communityEvents === null || communityEvents === undefined){
        return;
      }

      events = [...events, ...communityEvents]

      ctx.setState({
        eventForm: {
          model: {
            events: events
          }
        }
      })
    })
  }

  @Selector()
  static leaderboard(state: EventLeaderboardModel){
    return state.leaderboardForm.model.leaderboard;
  }

  @Selector()
  static events(state: EventStateModel){
    return state.eventForm.model.events;
  }
}