import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderByEnum } from '../enum/order-by.enum';

export class TripQueryDTO {
  @IsNumber()
  @IsOptional()
  startProvince?: number;

  @IsNumber()
  @IsOptional()
  endProvince?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  @IsEnum(OrderByEnum)
  orderBy: OrderByEnum

  @IsString()
  @IsDateString()
  date: Date

}
