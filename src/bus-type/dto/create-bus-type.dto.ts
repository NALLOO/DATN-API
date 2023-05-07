import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBusTypeDTO{
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  numberOfSeat: number
}