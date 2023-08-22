import { CommandHandler, EventPublisher } from "@nestjs/cqrs";
import { SetLeaderboardCommand } from "./set-leaderboard.command";
import * as fs from 'fs';
import { leaderboardDto } from "../../dto/leaderboard.dto";
import { HttpService } from "@nestjs/axios";
import { ProfileDto } from "../../profile.dto";
import { ProfileDtoRepository } from "../../db/profile-dto.repository";
import { ProfileEntityRepository } from "../../db/profile-entity.repository";

@CommandHandler(SetLeaderboardCommand)
export class SetLeaderboardCommandHandler{
  constructor(
    private httpService: HttpService,
    private readonly profileDtoRepository: ProfileDtoRepository,
    private readonly eventPublisher: EventPublisher
  ){}
  async execute(){
    const url = process.env["BASE_URL"];
    const file = await fs.promises.readFile(process.cwd() + '/libs/api/profile/data-access/src/leaderboard.json', 'utf-8')

    const leaderboard: leaderboardDto[] = file ? JSON.parse(file) : [];
    const newLeaderboard: leaderboardDto[] = [];

    try{
      this.httpService.patch(url + '/api/profile/remove-award/' + leaderboard[0].username + '/topLeader').toPromise();
      this.httpService.patch(url + '/api/profile/remove-award/' + leaderboard[1].username + '/secondLeader').toPromise();
      this.httpService.patch(url + '/api/profile/remove-award/' + leaderboard[2].username + '/thirdLeader').toPromise();
    }

    catch(error){
      console.log(error)
    }
    const profiles: ProfileDto[] = await this.profileDtoRepository.findTop20Profiles()

    profiles.forEach(profile => {
      newLeaderboard.push({
        name: profile.name,
        lastName: profile.lastName,
        ep: profile.ep,
        username: profile.username
      })
    })

    try{
      this.httpService.patch(url + '/api/profile/add-award/' + newLeaderboard[0].username + '/topLeader').toPromise();
      this.httpService.patch(url + '/api/profile/add-award/' + newLeaderboard[1].username + '/secondLeader').toPromise();
      this.httpService.patch(url + '/api/profile/add-award/' + newLeaderboard[2].username + '/thirdLeader').toPromise();
    }

    catch(error){
      console.log(error)
    }

    const newFile = JSON.stringify(newLeaderboard);

    await fs.promises.writeFile(process.cwd() + '/libs/api/profile/data-access/src/leaderboard.json', newFile, 'utf-8');
    return newLeaderboard;
  }
}