import { IsNumber, IsOptional } from 'class-validator';

export class TripQueryDTO {
  @IsNumber()
  @IsOptional()
  start_location: number;

  @IsNumber()
  @IsOptional()
  end_location: number;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsNumber()
  @IsOptional()
  limit: number;
}
