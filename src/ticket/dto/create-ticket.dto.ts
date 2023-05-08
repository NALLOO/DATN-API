import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TicketStatus } from '../enum/ticket-status.enum';

export class CreateTicketDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  tripId: number;

  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: number;
}
