import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetSettingsQuery } from "./get-settings.query";
import { SettingsEntityRepository } from "../../db/settings-entity.repository";
import { SettingsDto } from "../../settings.dto";

@QueryHandler(GetSettingsQuery)
export class GetSettingsHandler implements IQueryHandler<GetSettingsQuery>{
  constructor(public readonly settingsEntityRepository: SettingsEntityRepository){}

  async execute({userId}: GetSettingsQuery): Promise<SettingsDto> {
    return this.settingsEntityRepository.findOneById(userId)
  }
}