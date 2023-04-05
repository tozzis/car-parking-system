import { TABLE } from '../../shared/constants/database';
import { CarSize } from '../../shared/constants/car-size.enum';
import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity(TABLE.PARKING_LOT)
@Unique(['slotNumber'])
export class ParkingLot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slotNumber: number;

  @Column({ default: false })
  isOccupied: boolean;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({
    type: 'enum',
    enum: CarSize,
    default: CarSize.MEDIUM,
  })
  size: CarSize;

  @OneToMany(() => Ticket, (ticket) => ticket.parkingLot)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
