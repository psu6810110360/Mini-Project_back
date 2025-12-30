import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ default: 'CONFIRMED' })
  status: string;

  
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'userId' })
  user: User;

  
  @ManyToOne(() => Room, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'roomId' })
  room: Room;
}