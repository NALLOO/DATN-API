import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBusTypeDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  numberOfSeat?: number;
}
