import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CarSize } from 'src/shared/constants/car-size.enum';

export class ParkCarDto {
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @IsNotEmpty()
  @IsEnum(CarSize)
  carSize: CarSize;
}
