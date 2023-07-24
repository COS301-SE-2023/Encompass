import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreateSettingsCommand } from "./create-settings.command";
import { SettingsFactory } from "../../settings.factory";
import { NotificationsSettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "../../dto";

@CommandHandler(CreateSettingsCommand)
export class CreateSettingsHandler implements ICommandHandler<CreateSettingsCommand>{
  constructor(
    private readonly settingsFactory: SettingsFactory,
    private readonly eventPublisher: EventPublisher,
    // private readonly httpService: HttpService
  ){}

  async execute({ userId }: CreateSettingsCommand){
    const profile: ProfileSettingsDto = {
      nsfw: false,
      followPermission: true,
      blocked: []
    }

    const notifications: NotificationsSettingsDto = {
      dms: true,
      follows: true,
      commentReplies: true,
      recomPosts: true,
      recomCC: true,
    }

    const themes: ThemesSettingsDto ={
      themeImage: 'light',
      themeColor: '',
    }

    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsFactory.create(
        userId,
        profile,
        notifications,
        'followers',
        themes
      )
    );

    settings.commit();
    return settings
  }
}