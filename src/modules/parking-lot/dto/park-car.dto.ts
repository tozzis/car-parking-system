import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CarSize } from 'src/shared/constants/car-size.enum';

export class ParkCarDto {
  @ApiProperty({ name: 'plateNumber' })
  @IsNotEmpty()
  @IsString()
  plateNumber: string;

  @ApiProperty({ name: 'carSize', default: CarSize.MEDIUM })
  @IsNotEmpty()
  @IsEnum(CarSize)
  carSize: CarSize;
}
