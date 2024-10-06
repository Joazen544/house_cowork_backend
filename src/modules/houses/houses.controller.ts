import { Controller, Get, Post, Body, Patch, HttpCode, HttpStatus, Query, UseGuards, Param, Put } from '@nestjs/common';
import { HousesService } from './houses.service';
import { CreateHouseDto } from './dto/request/create-house.dto';
import { UpdateHouseDto } from './dto/request/update-house.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateHouseResponseDto } from './dto/response/create-house-response.dto';
import {
  BadRequestErrorResponseDto,
  ForbiddenErrorResponseDto,
  NotFoundErrorResponseDto,
  UnauthorizedErrorResponseDto,
} from '../../common/dto/errors/errors.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { HouseInfoResponseDto } from './dto/response/house-info-response.dto';
import { CreateHouseInvitationResponseDto } from './dto/response/create-house-invitation-response.dto';
import { HouseJoinRequestsResponseDto } from './dto/response/house-join-requests-response.dto';
import { SimpleResponseDto } from '../../common/dto/response/simple-response.dto';
import { AnswerJoinRequestDto } from './dto/request/answer-join-request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { HouseMemberGuard } from '../../common/guards/house-member.guard';
import { CurrentHouse } from './decorators/current-house.decorator';
import { House } from './entities/house.entity';
import { JoinRequestsService } from './join-requests.service';
import { HousesByMemberResponseDto } from './dto/response/houses-by-member-response.dto';

@Controller('houses')
@ApiTags('Houses')
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly joinRequestsService: JoinRequestsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a house' })
  @ApiResponse({ status: 201, description: 'House created.', type: CreateHouseResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to create a house.', type: UnauthorizedErrorResponseDto })
  @ApiBody({ type: CreateHouseDto })
  @Serialize(CreateHouseResponseDto)
  async create(@CurrentUser() user: User, @Body() createHouseDto: CreateHouseDto) {
    const house = await this.housesService.create(user, createHouseDto);
    const houseInResponse = this.housesService.formatHouseInfoInResponse(house);
    return { house: houseInResponse };
  }

  @Get('own')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get houses by user' })
  @ApiResponse({ status: 200, description: 'Houses got.', type: HouseInfoResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, some property is missed.', type: BadRequestErrorResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to create a house.', type: UnauthorizedErrorResponseDto })
  @Serialize(HousesByMemberResponseDto)
  async findOwnHouses(@CurrentUser() user: User) {
    const houses = await this.housesService.findHousesByUser(user);
    const houseIds = houses.map((house) => house.id);
    return { houseIds };
  }

  @Get(':houseId')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get a house info.' })
  @ApiResponse({ status: 200, description: 'House info got.', type: HouseInfoResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to get house info.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can get house info.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @Serialize(HouseInfoResponseDto)
  async findOne(@CurrentHouse() house: House) {
    return { house: this.housesService.formatHouseInfoInResponse(house) };
  }

  @Put(':houseId')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Update house info.' })
  @ApiResponse({ status: 200, description: 'House info updated.', type: HouseInfoResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to update house info.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only member can update house info.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiBody({ type: UpdateHouseDto })
  @Serialize(HouseInfoResponseDto)
  async update(@CurrentHouse() house: House, @Body() updateHouseDto: UpdateHouseDto) {
    const updatedHouse = await this.housesService.update(house, updateHouseDto);
    return { house: this.housesService.formatHouseInfoInResponse(updatedHouse) };
  }

  @Post(':houseId/invitations')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Create a house invitation' })
  @ApiResponse({ status: 201, description: 'House invitation created.', type: CreateHouseInvitationResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to create invitation.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can invite.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @Serialize(CreateHouseInvitationResponseDto)
  createInvitation(@CurrentUser() user: User, @CurrentHouse() house: House) {
    const invitation = this.housesService.createInvitation(house);
    return { invitation };
  }

  @Get('introduction')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get house info from invitation.' })
  @ApiResponse({ status: 200, description: 'House info got.', type: HouseInfoResponseDto })
  @ApiResponse({ status: 401, description: 'Needs sign in to get introduction.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only not house member can read info.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiQuery({ name: 'invitationCode', type: String, required: true, description: 'Invitation code to join the group' })
  @Serialize(HouseInfoResponseDto)
  getHouseInfoFromInvitation(@Query('invitationCode') invitationCode: string) {
    return { house: this.housesService.findOneWithInvitation(invitationCode) };
  }

  @Post('joinRequests')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Create a house join request.' })
  @ApiResponse({ status: 201, description: 'House join request created.', type: SimpleResponseDto })
  @ApiResponse({ status: 401, description: 'Need signin to create join request.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only not house member can join.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiQuery({ name: 'invitationCode', type: String, required: true, description: 'Invitation code to join the group' })
  @Serialize(SimpleResponseDto)
  createJoinRequest(@Query('invitationCode') invitationCode: string, @CurrentUser() user: User) {
    return { result: this.joinRequestsService.createJoinRequest(invitationCode, user) };
  }

  @Get(':houseId/joinRequests')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Get all house join requests.' })
  @ApiResponse({ status: 200, description: 'House join requests got.', type: HouseJoinRequestsResponseDto })
  @ApiResponse({ status: 401, description: 'Need signin to get join requests.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member get join requests.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @Serialize(HouseJoinRequestsResponseDto)
  getJoinRequests(@CurrentHouse() house: House) {
    return { joinRequests: this.joinRequestsService.getPendingJoinRequests(house) };
  }

  @Patch('joinRequests/:joinRequestId')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Accept or reject a request.' })
  @ApiResponse({ status: 200, description: 'Request accepted or rejected.', type: SimpleResponseDto })
  @ApiResponse({ status: 401, description: 'Need signin to answer join request.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can answer.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiBody({ type: AnswerJoinRequestDto })
  @Serialize(SimpleResponseDto)
  answerJoinRequest(@Param('joinRequestId') joinRequestId: string, @Body() answerJoinRequestDto: AnswerJoinRequestDto) {
    return { result: this.joinRequestsService.answerJoinRequest(+joinRequestId, answerJoinRequestDto.result) };
  }

  // @Delete(':houseId/leave')
  // @ApiBearerAuth()
  // @UseGuards(HouseMemberGuard)
  // @ApiOperation({ summary: 'Leave a house.' })
  // @ApiResponse({ status: 200, description: 'Left a house.', type: SimpleResponseDto })
  // @ApiResponse({ status: 401, description: 'Need signin to leave house.', type: UnauthorizedErrorResponseDto })
  // @ApiResponse({ status: 403, description: 'Only house member can leave.', type: ForbiddenErrorResponseDto })
  // @Serialize(SimpleResponseDto)
  // leaveHouse(@CurrentUser() user: User) {
  //   return this.housesService.leave(user);
  // }
}
