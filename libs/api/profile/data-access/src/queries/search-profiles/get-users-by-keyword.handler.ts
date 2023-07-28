import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUsersByKeywordQuery } from "./get-users-by-keyword.query";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@QueryHandler(GetUsersByKeywordQuery)
export class GetUsersByKeywordHandler implements IQueryHandler<GetUsersByKeywordQuery> {
    constructor(private readonly profileEntityRepository: ProfileEntityRepository) {}

    async execute({ keyword }: GetUsersByKeywordQuery) {
        return this.profileEntityRepository.findUsersByKeyword(keyword);
    }
}