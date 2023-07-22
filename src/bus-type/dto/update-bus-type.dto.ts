import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateBusTypeDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[0-9]+$/)
  numberOfSeat?: string;

  @IsOptional()
  @IsString()
  listTicket: string

  @IsOptional()
  @IsString()
  image: string

}
