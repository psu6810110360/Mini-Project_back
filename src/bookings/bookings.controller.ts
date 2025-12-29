import { Controller, Get, Post, Body, UseGuards, Req, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createBookingDto: CreateBookingDto, @Req() req: any) {
    return this.bookingsService.create(createBookingDto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }
}