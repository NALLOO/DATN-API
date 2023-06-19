import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSessionDTO {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsArray()
  ticket_ids: Array<string>;
}
