import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRouteDTO {
  @IsNotEmpty()
  @IsNumber()
  startProvinceId: number;

  @IsNotEmpty()
  @IsNumber()
  endProvinceId: number;

  @IsNotEmpty()
  @IsArray()
  startLocations: Array<number>;

  @IsNotEmpty()
  @IsArray()
  endLocations: Array<number>;
}
