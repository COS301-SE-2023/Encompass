import { BaseEntityRepository } from "@encompass/api/database/data-access";
import { Injectable } from "@nestjs/common";
import { Community } from "../community";
import { CommunitySchema } from "./community.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommunitySchemaFactory } from "./community-schema.factory";
import { CommunityDto } from "../community.dto";

@Injectable()
export class CommunityEntityRepository extends BaseEntityRepository<
    CommunitySchema,
    Community
> {
    constructor(
        @InjectModel(CommunitySchema.name)
        communityModel: Model<CommunitySchema>,
        communitySchemaFactory: CommunitySchemaFactory,
    ) {
        super(communityModel, communitySchemaFactory);
    }

    async findCommunitiesByUserId(id: string): Promise<CommunityDto[]> {
        const allCommunities = await this.findAll();
      
        const filteredCommunities = allCommunities.filter(community => {
            const members = community.members as string[];
            const isAdmin = community.admin === id;
            const isMember = members.includes(id);
            return !isAdmin && !isMember;
        });

        //put AI here
        /*if users<3
        recommend just by categories
        else if users==3
        simplified 3NN algo
        else 
        3NN cluster algo
        */
        //this.countAllProfiles();
        
        //make console.log activate after 3 seconds
        
      
        return filteredCommunities;
    }

    /*async countAllProfiles(): Promise<number> {
        //count all profile documents in mongodb and return total
        const allProfiles = await this.findAll();
        setTimeout(() => {
            console.log("Total profiles: ", allProfiles.length);
        }, 3000);
        return allProfiles.length;
    }*/
}