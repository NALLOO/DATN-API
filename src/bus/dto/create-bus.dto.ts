import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateBusDTO {
  @IsNotEmpty()
  @IsNumber()
  typeId: number

  @IsNotEmpty()
  @IsNumber()
  authorId: number

}