import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UpdateTicketDTO } from './dto';
import CustomResponse from '../helper/response/response';
import { JwtAuthGuard } from 'src/auth/guard';
import RequestWithUser from 'src/auth/interface/request-with-user.interface';

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
    const res = await this.ticketService.update(ticketId, updateTicketDTO);
    return new CustomResponse(res);
  }
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  async myTicket(@Req() request: RequestWithUser) {
    const res = await this.ticketService.myTicket(request.user.id);
    return new CustomResponse(res);
  }

  //get ticket
  //GET: ../ticket/:id
  @Get(':id')
  async detail(@Param('id') ticketId: string) {
    const res = await this.ticketService.detail(ticketId);
    return new CustomResponse(res);
  }
}
