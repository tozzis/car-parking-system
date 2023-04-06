import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateParkingLotDto {
  @ApiProperty({ name: 'capacity' })
  @IsNotEmpty()
  @IsInt()
  capacity: number;
}
