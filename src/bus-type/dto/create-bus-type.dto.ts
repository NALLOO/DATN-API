import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class CreateBusTypeDTO{
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/)
  numberOfSeat: string

  @IsNotEmpty()
  @IsString()
  listTicket: string
}