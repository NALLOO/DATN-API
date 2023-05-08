import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../enum/ticket-status.enum';

export class UpdateTicketDTO {
  @IsOptional()
  @IsNumber()
  authorId?: number;

  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: number;
}
