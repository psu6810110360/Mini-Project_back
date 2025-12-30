import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
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

  async create(createBookingDto: CreateBookingDto, user: any) {
    const { roomId, startDate, endDate } = createBookingDto;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new NotFoundException(`Room #${roomId} not found`);
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        room: { id: roomId },
        startDate: LessThan(end),
        endDate: MoreThan(start),
      }
    });

    if (existingBooking) {
      throw new BadRequestException('Room is already booked for these dates');
    }

    const booking = this.bookingRepository.create({
      startDate: start,
      endDate: end,
      user: { id: user.id } as User,
      room: room,
    });

    return this.bookingRepository.save(booking);
  }

  findMyBookings(userId: number) {
    return this.bookingRepository.find({
      where: { user: { id: userId } },
      relations: ['room'],
      order: { id: 'DESC' },
    });
  }

  findByRoom(roomId: number) {
    return this.bookingRepository.find({
      where: { room: { id: roomId } },
      select: ['startDate', 'endDate'],
    });
  }

  findAll() {
    return this.bookingRepository.find({
      relations: ['user', 'room'],
      order: { id: 'DESC' }
    });
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'room'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    return this.bookingRepository.remove(booking);
  }
}