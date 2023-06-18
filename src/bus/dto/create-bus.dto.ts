import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBusDTO {
  @IsNotEmpty()
  @IsString()
  typeId: string;

  @IsNotEmpty()
  @IsString()
  numberPlate: string;
}
