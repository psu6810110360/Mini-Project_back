import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    const room = this.roomsRepository.create(createRoomDto);
    return this.roomsRepository.save(room);
  }

  findAll() {
    return this.roomsRepository.find();
  }

  async findOne(id: number) {
    const room = await this.roomsRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(`Room #${id} not found`);
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);
    this.roomsRepository.merge(room, updateRoomDto);
    return this.roomsRepository.save(room);
  }

  async remove(id: number) {
    const room = await this.findOne(id);
    return this.roomsRepository.remove(room);
  }
}