import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HouseMembersService } from 'src/modules/house-members/house-members.service';

@Injectable()
export class HouseMemberGuard implements CanActivate {
  constructor(private readonly houseMembersService: HouseMembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const houseId = request.params.houseId;

    if (!user || !houseId) {
      throw new ForbiddenException('User or house not found');
    }

    const houseMember = await this.houseMembersService.findOneByHouseIdAndUserId(houseId, user.id);
    if (!houseMember) {
      throw new ForbiddenException('User is not a member of this house');
    }

    request.currentHouse = houseMember.house;
    return true;
  }
}
