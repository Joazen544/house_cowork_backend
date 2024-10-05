import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InheritApiProperty } from 'src/common/decorators/inherit-api-property.decorator';
import { HouseDto } from '../house.dto';

export class UpdateHouseDto {
  @IsString()
  @IsNotEmpty()
  @InheritApiProperty(HouseDto)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @InheritApiProperty(HouseDto)
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @InheritApiProperty(HouseDto)
  rules!: string[];
}
