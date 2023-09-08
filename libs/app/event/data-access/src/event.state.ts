import { Injectable } from "@angular/core";
import { ProfileLeaderboardDto } from "@encompass/api/profile-leaderboard/data-access";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { EventApi } from "./event.api";
import { AddUserEvent, GetByCommunity, GetByUsername, GetEventById, GetEvents, GetLeaderboard, GetUserEvents, UpdateUserEvent } from "@encompass/app/event/util";
import { EventDto } from "@encompass/api/event/data-access";
import { UserEventsDto } from "@encompass/api/user-events/data-access";
import { AddUser } from "@encompass/app/event/util";

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

export interface ProfileEventModel{
  profileEventForm: {
    model: {
      profileEvents: EventDto[] | null;
    }
  }
}

export interface CommunityEventModel{
  communityEventForm: {
    model: {
      communityEvents: EventDto[] | null;
    }
  }
}

export interface SingleEventModel {
  singleEventForm: {
    model:{
      event: EventDto | null;
    }
  }
}

export interface UserEventsModel {
  userEventsForm: {
    model: {
      userEvents: UserEventsDto | null;
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

@State<ProfileEventModel>({
  name: 'profileEventModel',
  defaults: {
    profileEventForm: {
      model: {
        profileEvents: null
      }
    }
  }
})

@State<CommunityEventModel>({
  name: 'communityEventModel',
  defaults: {
    communityEventForm: {
      model: {
        communityEvents: null
      }
    }
  }
})

@State<SingleEventModel>({
  name: 'singleEventModel',
  defaults: {
    singleEventForm: {
      model: {
        event: null
      }
    }
  }
})

@State<UserEventsModel>({
  name: 'userEventsModel',
  defaults: {
    userEventsForm: {
      model: {
        userEvents: null
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

  @Action(GetEventById)
  async getEventById(ctx: StateContext<SingleEventModel>, {id}: GetEventById){
    const event = await this.eventApi.getEventById(id);

    if(event === null || event === undefined){
      return;
    }

    ctx.setState({
      singleEventForm: {
        model: {
          event: event
        }
      }
    })
  }

  @Action(GetUserEvents)
  async getUserEvents(ctx: StateContext<UserEventsModel>, {userId}: GetUserEvents){
    const userEvents = await this.eventApi.getUserEvents(userId);

    if(userEvents === null || userEvents === undefined){
      return;
    }

    ctx.setState({
      userEventsForm: {
        model: {
          userEvents: userEvents
        }
      }
    })
  }

  @Action(UpdateUserEvent)
  async updateUserEvent(ctx: StateContext<UserEventsModel>, {userId, event}: UpdateUserEvent){
    const userEvents = await this.eventApi.updateUserEvent(userId, event);

    if(userEvents === null || userEvents === undefined){
      return;
    }

    ctx.setState({
      userEventsForm: {
        model: {
          userEvents: userEvents
        }
      }
    })
  }

  @Action(AddUser)
  async addEvent(ctx: StateContext<SingleEventModel>, {eventId, username}: AddUser){
    const event = await this.eventApi.addUser(eventId, username);

    if(event === null || event === undefined){
      return;
    }

    ctx.setState({
      singleEventForm: {
        model: {
          event: event
        }
      }
    })
  }

  @Action(AddUserEvent)
  async addUserEvent(ctx: StateContext<SingleEventModel>, {eventId, userId}: AddUserEvent){
    const userEvent = await this.eventApi.addToUserEvents(userId, eventId);
  }

  @Action(GetByCommunity)
  async getByCommunity(ctx: StateContext<CommunityEventModel>, {community}: GetByCommunity){
    const events = await this.eventApi.getEventsByCommunity(community);

    if(events === null || events === undefined){
      return;
    }

    ctx.setState({
      communityEventForm: {
        model: {
          communityEvents: events
        }
      }
    })
  }

  @Action(GetByUsername)
  async getByUsername(ctx: StateContext<ProfileEventModel>, {username}: GetByUsername){
    const events = await this.eventApi.getEventsByUsername(username);

    if(events === null || events === undefined){
      return;
    }

    ctx.setState({
      profileEventForm: {
        model: {
          profileEvents: events
        }
      }
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

  @Selector()
  static singleEvent(state: SingleEventModel){
    return state.singleEventForm.model.event;
  }

  @Selector()
  static userEvents(state: UserEventsModel){
    return state.userEventsForm.model.userEvents;
  }

  @Selector()
  static profileEvents(state: ProfileEventModel){
    return state.profileEventForm.model.profileEvents;
  }

  @Selector()
  static communityEvents(state: CommunityEventModel){
    return state.communityEventForm.model.communityEvents;
  }
}