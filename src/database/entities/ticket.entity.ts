import { Car } from './car.entity';
import { ParkingLot } from './parking-lot.entity';
import { TABLE } from '../../shared/constants/database';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity(TABLE.TICKET)
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entryTime: Date;

  @Column({ nullable: true })
  exitTime: Date;

  @Column({ default: false })
  isClosed: boolean;

  @ManyToOne(() => Car, (car) => car.tickets, {
    onDelete: 'CASCADE',
  })
  car: Car;

  @ManyToOne(() => ParkingLot, (parkingLot) => parkingLot.tickets, {
    onDelete: 'CASCADE',
  })
  parkingLot: ParkingLot;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
