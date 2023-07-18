import { CommandHandler, ICommandHandler, EventPublisher } from "@nestjs/cqrs";
import { CreateSettingsCommand } from "./create-settings.command";
import { SettingsFactory } from "../../settings.factory";
import { NotificationsSettingsDto, PrivacySettingsDto, ProfileSettingsDto, ThemesSettingsDto } from "../../dto";

@CommandHandler(CreateSettingsCommand)
export class CreateSettingsHandler implements ICommandHandler<CreateSettingsCommand>{
  constructor(
    private readonly settingsFactory: SettingsFactory,
    private readonly eventPublisher: EventPublisher,
    // private readonly httpService: HttpService
  ){}

  async execute({ userId }: CreateSettingsCommand){
    const profile: ProfileSettingsDto = {
      private: false,
      followPermission: true,
    }

    const notifications: NotificationsSettingsDto = {
      messages: true,
      follows: true,
      mentionsPosts: true,
      mentionsComments: true,
      commentReplies: true,
      recomPosts: true,
      recomCC: true,
    }

    const privacy: PrivacySettingsDto = {
      blocked: [],
      postPermission: true,
      commPermission: true,
      contentPermissions: true
    }

    const themes: ThemesSettingsDto ={
      themeImage: '',
      themeColor: '',
    }

    const settings = this.eventPublisher.mergeObjectContext(
      await this.settingsFactory.create(
        userId,
        profile,
        notifications,
        'Everyone',
        privacy,
        themes
      )
    );

    settings.commit();
    return settings
  }
}