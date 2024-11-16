import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Param,
  Put,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { HousesService } from './services/houses.service';
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
import { JoinRequestsSentResponseDto } from './dto/response/join-requests-sent-response.dto';
import { SimpleResponseDto } from '../../common/dto/response/simple-response.dto';
import { AnswerJoinRequestDto } from './dto/request/answer-join-request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { HouseMemberGuard } from '../../common/guards/house-member.guard';
import { CurrentHouse } from './decorators/current-house.decorator';
import { House } from './entities/house.entity';
import { JoinRequestsService } from './services/join-requests.service';
import { HousesByMemberResponseDto } from './dto/response/houses-by-member-response.dto';
import { InvitationNotFoundException } from '../../common/exceptions/houses/invitation-not-found.exception';
import { JoinRequestExistedException } from 'src/common/exceptions/houses/join-request-existed.exception';
import { MemberAlreadyExistsException } from 'src/common/exceptions/houses/member-already-exists.exception';
import { CreateJoinRequestResponseDto } from './dto/response/create-join-request-response.dto';
import { HouseJoinRequestsResponseDto } from './dto/response/house-join-requests-response.dto';

@Controller({ path: 'houses', version: '1' })
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
    try {
      const house = await this.housesService.create(user, createHouseDto);
      const houseInResponse = this.housesService.formatHouseInfoInResponse(house);
      return { house: houseInResponse };
    } catch (error) {
      if (error instanceof MemberAlreadyExistsException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
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
  async createInvitation(@CurrentHouse() house: House) {
    const invitation = await this.housesService.createInvitation(house);
    return { invitation };
  }

  @Get('introduction/:invitationCode')
  @ApiBearerAuth()
  @UseGuards()
  @ApiOperation({ summary: 'Get house info from invitation.' })
  @ApiResponse({ status: 200, description: 'House info got.', type: HouseInfoResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, invitation code is invalid.' })
  @ApiResponse({ status: 401, description: 'Needs sign in to get introduction.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only not house member can read info.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiQuery({ name: 'invitationCode', type: String, required: true, description: 'Invitation code to join the group' })
  @Serialize(HouseInfoResponseDto)
  async getHouseInfoFromInvitation(@Param('invitationCode') invitationCode: string) {
    try {
      const house = await this.housesService.findOneWithInvitation(invitationCode);
      return { house: this.housesService.formatHouseInfoInResponse(house) };
    } catch (error) {
      if (error instanceof InvitationNotFoundException) {
        throw new BadRequestException('Invitation code is invalid.');
      }
      throw error;
    }
  }

  @Post('joinRequests')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards()
  @ApiOperation({ summary: 'Create a house join request.' })
  @ApiResponse({ status: 201, description: 'House join request created.', type: CreateJoinRequestResponseDto })
  @ApiResponse({ status: 401, description: 'Need signin to create join request.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only not house member can join.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiQuery({ name: 'invitationCode', type: String, required: true, description: 'Invitation code to join the group' })
  @Serialize(CreateJoinRequestResponseDto)
  async createJoinRequest(@Query('invitationCode') invitationCode: string, @CurrentUser() user: User) {
    try {
      const house = await this.housesService.findOneWithInvitation(invitationCode);
      const joinRequest = await this.joinRequestsService.createJoinRequest(house, user);
      if (joinRequest) {
        return { joinRequest: this.joinRequestsService.formatJoinRequestInResponse(joinRequest) };
      }
      throw new Error('Something went wrong creating join request.');
    } catch (error) {
      if (error instanceof InvitationNotFoundException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof JoinRequestExistedException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof MemberAlreadyExistsException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get('joinRequests/sent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sent join requests.' })
  @ApiResponse({ status: 200, description: 'Sent join requests got.', type: JoinRequestsSentResponseDto })
  @ApiResponse({
    status: 401,
    description: 'Need signin to get sent join requests.',
    type: UnauthorizedErrorResponseDto,
  })
  @Serialize(JoinRequestsSentResponseDto)
  async getSentJoinRequests(@CurrentUser() user: User) {
    const joinRequests = await this.joinRequestsService.getSentJoinRequests(user);
    const joinRequestsInResponse = this.joinRequestsService.formatJoinRequestsInResponse(joinRequests);
    return { joinRequests: joinRequestsInResponse };
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
  async getJoinRequestsOfHouse(@CurrentHouse() house: House) {
    const joinRequests = await this.joinRequestsService.getPendingJoinRequests(house);
    const joinRequestsInResponse = joinRequests.map((joinRequest) => {
      return {
        id: joinRequest.id,
        user: joinRequest.user,
        status: joinRequest.status,
      };
    });
    return { joinRequests: joinRequestsInResponse };
  }

  @Patch(':houseId/joinRequests/:joinRequestId')
  @ApiBearerAuth()
  @UseGuards(HouseMemberGuard)
  @ApiOperation({ summary: 'Accept or reject a request.' })
  @ApiResponse({ status: 200, description: 'Request accepted or rejected.', type: SimpleResponseDto })
  @ApiResponse({ status: 401, description: 'Need signin to answer join request.', type: UnauthorizedErrorResponseDto })
  @ApiResponse({ status: 403, description: 'Only house member can answer.', type: ForbiddenErrorResponseDto })
  @ApiResponse({ status: 404, description: 'Not found.', type: NotFoundErrorResponseDto })
  @ApiBody({ type: AnswerJoinRequestDto })
  @Serialize(SimpleResponseDto)
  async answerJoinRequest(
    @Param('joinRequestId') joinRequestId: string,
    @CurrentHouse() house: House,
    @Body() answerJoinRequestDto: AnswerJoinRequestDto,
  ) {
    const joinRequest = await this.joinRequestsService.findOneById(+joinRequestId);
    if (!joinRequest) {
      throw new NotFoundException('Join request not found.');
    }
    if (joinRequest.house.id !== house.id) {
      throw new ForbiddenException('Only house member can answer join request.');
    }
    try {
      return { result: await this.joinRequestsService.answerJoinRequest(joinRequest, answerJoinRequestDto.result) };
    } catch (error) {
      if (error instanceof MemberAlreadyExistsException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
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
