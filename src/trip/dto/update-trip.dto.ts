import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { TripStatus } from '../enum/trip-status.enum';

export class UpdateTripDTO {
  @IsOptional()
  @IsInt()
  busId: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsInt()
  routeId: number

  @IsOptional()
  @IsDateString()
  timeStart: string;

  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @IsOptional()
  @IsEnum(TripStatus)
  status: number
}
