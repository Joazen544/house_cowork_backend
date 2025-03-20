import { IsString, IsOptional } from 'class-validator';
import { InheritApiProperty } from '../../../../common/decorators/inherit-api-property.decorator';
import { UserDto } from '../user.dto';

export class UpdateUserDto {
  @InheritApiProperty(UserDto)
  @IsString()
  @IsOptional()
  name!: string;

  @InheritApiProperty(UserDto)
  @IsString()
  @IsOptional()
  bankAccount!: string;
}
