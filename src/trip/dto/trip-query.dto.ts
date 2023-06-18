import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { OrderByEnum } from '../enum/order-by.enum';

export class TripQueryDTO {
  @IsString()
  @IsOptional()
  startProvinceId?: string;

  @IsString()
  @IsOptional()
  endProvinceId?: string;

  @IsString()
  @Matches(/^[0-9]+$/)
  @IsOptional()
  page?: string;

  @IsString()
  @Matches(/^[0-9]+$/)
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  @IsEnum(OrderByEnum)
  orderBy: OrderByEnum;

  @IsString()
  @IsDateString()
  @IsOptional()
  date: Date;
}
