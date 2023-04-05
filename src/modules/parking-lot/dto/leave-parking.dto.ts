import { IsInt, IsNotEmpty } from 'class-validator';

export class LeaveParkingDto {
  @IsNotEmpty()
  @IsInt()
  ticketId: number;
}
