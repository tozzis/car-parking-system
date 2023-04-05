import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateParkingLotDto {
  @IsNotEmpty()
  @IsInt()
  capacity: number;
}
