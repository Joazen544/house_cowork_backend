import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/user.entity';

export class TaskDto {
  @Expose()
  id!: number;

  @Expose()
  title!: string;

  @Expose()
  description!: string;

  @Transform(({ obj }) => obj.owner.id)
  @Expose()
  ownerId!: number;
}
