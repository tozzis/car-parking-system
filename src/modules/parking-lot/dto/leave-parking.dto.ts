import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class LeaveParkingDto {
  @ApiProperty({ name: 'ticketId' })
  @IsNotEmpty()
  @IsInt()
  ticketId: number;
}
