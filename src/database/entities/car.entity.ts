import { TABLE } from '../../shared/constants/database';
import { CarSize } from '../../shared/constants/car-size.enum';
import {
  Entity,
  Column,
  Unique,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity(TABLE.CARS)
@Unique(['plateNumber'])
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  plateNumber: string;

  @Column({
    type: 'enum',
    enum: CarSize,
    default: CarSize.MEDIUM,
  })
  size: CarSize;

  @OneToMany(() => Ticket, (ticket) => ticket.car)
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
