import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { CarSize } from 'src/shared/constants/car-size.enum';

export class UpdateParkingLotDto {
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  slotNumbers: number[];

  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @IsNotEmpty()
  @IsEnum(CarSize)
  carSize: CarSize;
}
