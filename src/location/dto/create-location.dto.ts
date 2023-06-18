import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLocationDTO {
  @IsNotEmpty()
  @IsString()
  provinceId: string

  @IsNotEmpty()
  @IsString()
  name: string
}