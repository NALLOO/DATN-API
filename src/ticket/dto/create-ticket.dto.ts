import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TicketStatus } from '../enum/ticket-status.enum';

export class CreateTicketDTO {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  tripId: string;

  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: number;
}
