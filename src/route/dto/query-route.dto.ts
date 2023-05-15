import { IsInt, IsOptional } from 'class-validator';

export class QueryRoute {
  @IsOptional()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  limit: number;
}
