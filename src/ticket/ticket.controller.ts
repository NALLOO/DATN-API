import { Body, Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UpdateTicketDTO } from './dto';
import CustomResponse from '../helper/response/response';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}
  //update ticket
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) ticketId: number,
    @Body() updateTicketDTO: UpdateTicketDTO,
  ) {
    const res = await this.ticketService.update(ticketId, updateTicketDTO)
    return new CustomResponse(res)
  }
}
