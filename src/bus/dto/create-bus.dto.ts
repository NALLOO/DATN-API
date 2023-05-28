import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBusDTO {
  @IsNotEmpty()
  @IsNumber()
  typeId: number;

  @IsNotEmpty()
  @IsString()
  numberPlate: string;
}
