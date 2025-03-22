import { IsArray, IsOptional, IsString } from 'class-validator';
import { InheritApiProperty } from 'src/common/decorators/inherit-api-property.decorator';
import { HouseDto } from '../house.dto';

export class UpdateHouseDto {
  @IsString()
  @IsOptional()
  @InheritApiProperty(HouseDto)
  name!: string;

  @IsString()
  @IsOptional()
  @InheritApiProperty(HouseDto)
  description!: string;

  @IsString()
  @IsOptional()
  @InheritApiProperty(HouseDto)
  avatarKey!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @InheritApiProperty(HouseDto)
  rules!: string[];
}
