import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDTO {
  @IsOptional()
  @IsString()
  provinceId?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
