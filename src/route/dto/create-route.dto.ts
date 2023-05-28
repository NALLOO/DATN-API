import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRouteDTO {
  @IsNotEmpty()
  @IsNumber()
  startProvinceId: number;

  @IsNotEmpty()
  @IsNumber()
  endProvinceId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  startLocations: Array<number>;

  @IsNotEmpty()
  @IsArray()
  endLocations: Array<number>;
}
