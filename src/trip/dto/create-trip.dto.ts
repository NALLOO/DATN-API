import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TripStatus } from '../enum/trip-status.enum';

export class CreateTripDTO {
  @IsNotEmpty()
  @IsString()
  busId: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]+$/)
  price: string;

  @IsNotEmpty()
  @IsString()
  routeId: string;

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
