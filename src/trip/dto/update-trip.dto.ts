import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { TripStatus } from '../enum/trip-status.enum';

export class UpdateTripDTO {
  @IsOptional()
  @IsString()
  busId: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/)
  price: string;

  @IsOptional()
  @IsString()
  routeId: string;

  @IsOptional()
  @IsDateString()
  timeStart: string;

  @IsOptional()
  @IsDateString()
  timeEnd?: string;

  @IsOptional()
  @IsEnum(TripStatus)
  status: number;
}
