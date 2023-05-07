import { IsNotEmpty, IsString } from "class-validator";

export class ChangePassDTO {
  @IsNotEmpty()
  @IsString()
  currentPassword: string

  @IsNotEmpty()
  @IsString()
  newPassword: string
}
