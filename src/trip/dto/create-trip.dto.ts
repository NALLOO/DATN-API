import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { TripStatus } from '../enum/trip-status.enum';

export class CreateTripDTO {
  @IsNotEmpty()
  @IsInt()
  busId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsInt()
  routeId: number

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
