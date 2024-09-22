import { IsString, IsOptional } from 'class-validator';
import { InheritApiProperty } from 'src/common/decorators/inherit-api-property.decorator';
import { UserDto } from '../user.dto';

export class UpdateUserDto {
  @InheritApiProperty(UserDto)
  @IsString()
  @IsOptional()
  name!: string;

  @InheritApiProperty(UserDto)
  @IsString()
  @IsOptional()
  nickName!: string;

  @InheritApiProperty(UserDto)
  @IsString()
  @IsOptional()
  avatar!: string;

  @InheritApiProperty(UserDto)
  @IsString()
  @IsOptional()
  bankAccount!: string;
}
