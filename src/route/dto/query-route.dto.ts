import { IsInt, IsOptional, IsString, Matches } from 'class-validator';

export class QueryRoute {
  @IsOptional()
  @Matches(/^[0-9]+$/)
  @IsString()
  page: string;

  @IsOptional()
  @IsInt()
  limit: number;
}
