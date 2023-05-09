import { IsInt, IsOptional } from 'class-validator';

export class QueryRoute {
  @IsOptional()
  @IsInt()
  authorId: number;

  @IsOptional()
  @IsInt()
  page: number;

  @IsOptional()
  @IsInt()
  limit: number;
}
