import { Test, TestingModule } from '@nestjs/testing';
import { HouseMembersService } from './house-members.service';

describe('HouseMembersService', () => {
  let service: HouseMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HouseMembersService],
    }).compile();

    service = module.get<HouseMembersService>(HouseMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
