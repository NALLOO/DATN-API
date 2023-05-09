import { IsNumber, IsOptional } from 'class-validator';

export class TripQueryDTO {
  @IsNumber()
  @IsOptional()
  startProvince?: number;

  @IsNumber()
  @IsOptional()
  endProvince?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
