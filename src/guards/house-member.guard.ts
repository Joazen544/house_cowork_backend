import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HousesService } from '../modules/houses/houses.service';

@Injectable()
export class HouseMemberGuard implements CanActivate {
  constructor(private readonly housesService: HousesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const houseId = request.params.houseId;

    if (!user || !houseId) {
      throw new ForbiddenException('User or house not found');
    }

    const house = await this.housesService.findOne({ id: houseId });
    if (!house) {
      throw new ForbiddenException('House not found');
    }

    const isMember = await this.housesService.isUserMemberOfHouse(user, house);
    if (!isMember) {
      throw new ForbiddenException('User is not a member of this house');
    }

    request.currentHouse = house;
    return true;
  }
}
