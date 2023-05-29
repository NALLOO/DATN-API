import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../enum/ticket-status.enum';

export class UpdateTicketDTO {
  @IsOptional()
  @IsString()
  authorId?: string;

  @IsNotEmpty()
  @IsEnum(TicketStatus)
  status: number;
}
