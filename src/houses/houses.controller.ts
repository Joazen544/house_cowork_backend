import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHouseResponseDto } from './dto/response/create-house-response.dto';
import { BadRequestErrorResponseDto, UnauthorizedErrorResponseDto } from 'src/dto/errors/errors.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { House } from './entities/house.entity';
import { HouseInfoResponseDto } from './dto/response/house-info-response.dto';

@Controller('houses')
@ApiTags('Houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a house' })
  @ApiResponse({ status: 201, description: 'House created.', type: CreateHouseResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to create a house.', type: UnauthorizedErrorResponseDto })
  @ApiBody({ type: CreateHouseDto })
  @Serialize(CreateHouseResponseDto)
  create(@Body() createHouseDto: CreateHouseDto) {
    return this.housesService.create(createHouseDto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a house info.' })
  @ApiResponse({ status: 200, description: 'House info got.', type: HouseInfoResponseDto })
  findOne(@Param('id') id: string) {
    return this.housesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHouseDto: UpdateHouseDto) {
    return this.housesService.update(+id, updateHouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.housesService.remove(+id);
  }
}
