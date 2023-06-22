import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UploadImageCommand } from "./upload-image.command";

@CommandHandler(UploadImageCommand)
export class UploadImageHandler
  implements ICommandHandler<UploadImageCommand> {

  async execute({ image }: UploadImageCommand) {
    console.log(image)
  }
}