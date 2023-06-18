import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRouteDTO {
  @IsNotEmpty()
  @IsString()
  startProvinceId: string;

  @IsNotEmpty()
  @IsString()
  endProvinceId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  startLocations: Array<string>;

  @IsNotEmpty()
  @IsArray()
  endLocations: Array<string>;
}
