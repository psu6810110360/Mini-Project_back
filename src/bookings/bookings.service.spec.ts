import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: User) {
    const { roomId, startDate, endDate } = createBookingDto;

    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new NotFoundException(`Room #${roomId} not found`);
    }

    const booking = this.bookingRepository.create({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      user: user,
      room: room,
    });

    return this.bookingRepository.save(booking);
  }

  findAll() {
    return this.bookingRepository.find({
     relations: ['user', 'room'], 
      order: { id: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.bookingRepository.findOne({ 
        where: { id },
        relations: ['user', 'room']
    });
  }
}