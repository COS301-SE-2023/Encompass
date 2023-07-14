import { EntityFactory } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { CommunityRequest } from "./community-request";
import { ObjectId } from "mongodb"
import { CommunityRequestEntityRepository } from "./db/community-request-entity.repository";
import { CommunityRequestCreatedEvent } from "./events";

@Injectable()
export class CommunityRequestFactory implements EntityFactory<CommunityRequest>{
  constructor(
    private readonly communityRequestEntityRepository: CommunityRequestEntityRepository
  ){}

  async create(
    communityId: string,
  ): Promise<CommunityRequest> {
    const communityRequest = new CommunityRequest(
      new ObjectId(communityId).toHexString(),
      []
    );

    await this.communityRequestEntityRepository.create(communityRequest);
    communityRequest.apply(new CommunityRequestCreatedEvent(communityRequest.getId()));
    return communityRequest;
  }
}