import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRouteDTO {
  @IsOptional()
  @IsString()
  startProvinceId?: string;

  @IsOptional()
  @IsString()
  endProvinceId?: string;

  @IsOptional()
  @IsArray()
  startLocations?: Array<string>;

  @IsOptional()
  @IsArray()
  endLocations?: Array<string>;
}
