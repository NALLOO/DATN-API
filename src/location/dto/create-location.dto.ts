import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLocationDTO {
  @IsNotEmpty()
  @IsNumber()
  provinceId: number

  @IsNotEmpty()
  @IsString()
  name: string
}