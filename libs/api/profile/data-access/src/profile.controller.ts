import { Body, Controller, Get, Post, Param, Patch } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateProfileRequest, UpdateProfileRequest } from "./dto";
import { CreateProfileCommand } from "./commands/create-profile/create-profile.command";
import { Profile } from "./profile";
import { GetProfileQuery } from "./queries/get-profile.query";
import { ProfileDto } from "./profile.dto";
import { UpdateProfileCommand } from "./commands/update-profile/update-profile.command";
import { GetUsernameQuery } from "./queries/get-username/get-username.query";
import { RemovePostCommand } from "./commands/remove-post/remove-post.command";
import { RemoveCommunityCommand } from "./commands/remove-community/remove-community.command";
import { FileInterceptor } from "@nestjs/platform-express";
import { UseInterceptors } from "@nestjs/common";
import { UploadedFile } from "@nestjs/common";
import { UploadImage } from "./upload-image.service";
import { Request } from "express";
import { Multer } from "multer";
import { GetByUsernameQuery } from "./queries/get-by-username/get-by-username.query";


import { GetAllProfilesQuery } from "./queries/get-all-profiles/getAllProfiles.query";
import { AddFollowerCommand } from "./commands/add-follower/add-follower.command";
import { AddFollowingCommand } from "./commands/add-following/add-following.command";
import { RemoveFollowerCommand } from "./commands/remove-follower/remove-follower.command";
import { RemoveFollowingCommand } from "./commands/remove-following/remove-following.command";

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ){}

  @Post('create')
  async createProfile(
    @Body() createProfileRequest: CreateProfileRequest,
  ) {
    return await this.commandBus.execute<CreateProfileCommand, string>(
      new CreateProfileCommand(createProfileRequest),
    );
  }

  @Get('/get/:id')
  async getProfile(@Param('id') userId: string) : Promise<ProfileDto>{
    return await this.queryBus.execute<GetProfileQuery, ProfileDto>(
      new GetProfileQuery(userId),
    );
  }

  @Get('get-all')
  async getAllProfiles(){
    return await this.queryBus.execute<GetAllProfilesQuery, ProfileDto[]>(
      new GetAllProfilesQuery(),
    );
  }

  @Patch('/update/:id')
  async updateProfile(
    @Param('id') userId: string, 
    @Body() profile: UpdateProfileRequest){
      return await this.commandBus.execute<UpdateProfileCommand, ProfileDto>(
        new UpdateProfileCommand(userId, profile),
      )
  }

  @Patch('remove-post/:username/:postId')
  async removePost(
    @Param('username') username: string,
    @Param('postId') postId: string,
  ){
    return await this.commandBus.execute<RemovePostCommand, ProfileDto>(
      new RemovePostCommand(username, postId),
    );
  }

  @Patch('remove-community/:username/:communityName')
  async removeCommunity(
    @Param('username') username: string,
    @Param('communityName') communityName: string,
  ){
    return await this.commandBus.execute<RemoveCommunityCommand, ProfileDto>(
      new RemoveCommunityCommand(username, communityName),
    );
  }

  @Patch('add-follower/:username/:followerUsername')
  async addFollower(
    @Param('username') userId: string,
    @Param('followerUsername') followerId: string
  ){
    return await this.commandBus.execute<AddFollowerCommand, ProfileDto>(
      new AddFollowerCommand(userId, followerId)
    );
  }

  @Patch('add-following/:username/:followingUsername')
  async addFollowing(
    @Param('username') userId: string,
    @Param('followingUsername') followingId: string
  ){
    return await this.commandBus.execute<AddFollowingCommand, ProfileDto>(
      new AddFollowingCommand(userId, followingId)
    );
  }

  @Patch('remove-follower/:username/:followerUsername')
  async remvoeFollower(
    @Param('username') userId: string,
    @Param('followerUsername') followerId: string
  ){
    return await this.commandBus.execute<RemoveFollowerCommand, ProfileDto>(
      new RemoveFollowerCommand(userId, followerId)
    );
  }

  @Patch('remove-following/:username/:followingUsername')
  async removeFollowing(
    @Param('username') userId: string,
    @Param('followingUsername') followingId: string
  ){
    return await this.commandBus.execute<RemoveFollowingCommand, ProfileDto>(
      new RemoveFollowingCommand(userId, followingId)
    );
  }

  @Get('/user/:username')
  async getProfileByUsername(@Param('username') username: string){
    return await this.queryBus.execute<GetUsernameQuery, boolean>(
      new GetUsernameQuery(username),
    );
  }

  @Get('get-user/:username')
  async getUser(@Param('username') username: string){
    return await this.queryBus.execute<GetByUsernameQuery, ProfileDto>(
      new GetByUsernameQuery(username),
    );
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ){
    const uploadImage = new UploadImage();
    
    return await uploadImage.uploadImage(file.buffer, file.originalname);
  }
}