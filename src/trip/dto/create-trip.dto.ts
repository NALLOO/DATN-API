import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TripStatus } from '../enum/trip-status.enum';

export class CreateTripDTO {
  @IsNotEmpty()
  @IsInt()
  busId: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/)
  price: string;

  @IsNotEmpty()
  @IsInt()
  routeId: number;

  @IsNotEmpty()
  @IsDateString()
  timeStart: string;

  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @IsNotEmpty()
  @IsEnum(TripStatus)
  status: number;
}
