import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TripStatus } from '../enum/trip-status.enum';

export class CreateTripDTO {
  @IsNotEmpty()
  @IsNumber()
  busId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  startLocation: number;

  @IsNotEmpty()
  @IsNumber()
  endLocation: number;

  @IsNotEmpty()
  @IsDateString()
  timeStart: string;

  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @IsNotEmpty()
  @IsEnum(TripStatus)
  status: number
}
