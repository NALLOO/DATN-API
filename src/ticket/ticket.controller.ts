import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UpdateTicketDTO } from './dto';
import CustomResponse from '../helper/response/response';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}
  //update ticket
  //PUT: ../ticket/:id
  @Put(':id')
  async update(
    @Param('id') ticketId: string,
    @Body() updateTicketDTO: UpdateTicketDTO,
  ) {
    const res = await this.ticketService.update(ticketId, updateTicketDTO)
    return new CustomResponse(res)
  }

  //get ticket
  //GET: ../ticket/:id
  @Get(':id')
  async detail(
    @Param('id') ticketId: string
  ) {
    const res = await this.ticketService.detail(ticketId)
    return new CustomResponse(res)
  }
}
