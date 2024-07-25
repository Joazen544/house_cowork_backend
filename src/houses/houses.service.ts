import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';

@Injectable()
export class HousesService {
  create(createHouseDto: CreateHouseDto) {
    return 'This action adds a new house';
  }

  findAll() {
    return `This action returns all houses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} house`;
  }

  update(id: number, updateHouseDto: UpdateHouseDto) {
    return `This action updates a #${id} house`;
  }

  remove(id: number) {
    return `This action removes a #${id} house`;
  }
}
