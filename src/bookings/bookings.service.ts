import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
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

  // 👇 แก้ตรง user: User เป็น user: any ชั่วคราว เพื่อรับค่าจาก Token ได้ทุกรูปแบบ
  async create(createBookingDto: CreateBookingDto, user: any) {
    const { roomId, startDate, endDate } = createBookingDto;
    
    // แปลง string เป็น Date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 1. เช็คว่ามีห้องอยู่จริงไหม
    const room = await this.roomRepository.findOneBy({ id: roomId });
    if (!room) {
      throw new NotFoundException(`Room #${roomId} not found`);
    }

    // 2. เช็คการจองซ้อน
    const existingBooking = await this.bookingRepository.findOne({
      where: {
        room: { id: roomId },
        startDate: LessThanOrEqual(end),
        endDate: MoreThanOrEqual(start),
      }
    });

    if (existingBooking) {
      throw new BadRequestException('Room is already booked for these dates!');
    }

    // 🔥 FIX: ดึง ID ของ User ออกมาให้ชัวร์ที่สุด (แก้ UpdateValuesMissingError)
    // Token บางทีส่งมาเป็น id บางทีส่งเป็น userId เราต้องดักทั้งคู่
    const userId = user?.id || user?.userId;

    if (!userId) {
        throw new BadRequestException('User ID not found in token');
    }

    // 3. สร้างและบันทึก
    const booking = this.bookingRepository.create({
      startDate: start,
      endDate: end,
      user: { id: userId } as User, // 👈 บังคับแปลงเป็น User format ที่ TypeORM ต้องการ
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