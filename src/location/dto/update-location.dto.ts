import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDTO {
  @IsOptional()
  @IsNumber()
  provinceId?: number;

  @IsOptional()
  @IsString()
  name?: string;
}
