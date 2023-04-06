import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { CarSize } from 'src/shared/constants/car-size.enum';

export class UpdateParkingLotDto {
  @ApiProperty({ name: 'slotNumbers' })
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  slotNumbers: number[];

  @ApiProperty({ name: 'isAvailable', default: true })
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ name: 'carSize', default: CarSize.MEDIUM })
  @IsNotEmpty()
  @IsEnum(CarSize)
  carSize: CarSize;
}
