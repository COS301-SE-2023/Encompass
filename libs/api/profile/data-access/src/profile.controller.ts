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

  @Get(':id')
  async getProfile(@Param('id') userId: string) : Promise<ProfileDto>{
    return await this.queryBus.execute<GetProfileQuery, ProfileDto>(
      new GetProfileQuery(userId),
    );
  }

  @Patch(':id')
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

  @Get('/user/:username')
  async getProfileByUsername(@Param('username') username: string){
    return await this.queryBus.execute<GetUsernameQuery, boolean>(
      new GetUsernameQuery(username),
    );
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ){
    console.log("Here")
    const uploadImage = new UploadImage();
    
    return await uploadImage.uploadImage(file.buffer, file.originalname);
  }
}