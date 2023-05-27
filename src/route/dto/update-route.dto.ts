import { IsArray, IsOptional, IsNumber } from 'class-validator';

export class UpdateRouteDTO {
  @IsOptional()
  @IsNumber()
  startProvinceId?: number;

  @IsOptional()
  @IsNumber()
  endProvinceId?: number;

  @IsOptional()
  @IsArray()
  startLocations?: Array<number>;

  @IsOptional()
  @IsArray()
  endLocations?: Array<number>;
}
