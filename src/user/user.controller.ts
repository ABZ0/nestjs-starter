import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards';
import { RecordNotFoundException } from 'src/core/exceptions';
import { NoResponseBody, SearchOptions } from 'src/core/shared';
import { UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { UserPaginationVm, UserVm } from './view-models';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Put('me/profile')
  @ApiOperation({ summary: 'Update User Profile' })
  @ApiOkResponse({ type: NoResponseBody })
  @ApiBadRequestResponse()
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    const id = req.user.id;
    await this.userService.updateById(id, dto);
    return {};
  }

  @Get('me/profile')
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiNotFoundResponse()
  async getProfile(@Request() req) {
    const id = req.user.id;
    const user = await this.userService.findById(id);
    if (!user) throw new RecordNotFoundException('user');
    return new UserVm(user);
  }

  @Get(':userId/profile')
  @ApiOperation({ summary: 'Get One User' })
  @ApiNotFoundResponse()
  async getOneBase(@Request() req, @Param('userId') id: string) {
    const user = await this.userService.findById(id);
    if (!user) throw new RecordNotFoundException('user');
    return new UserVm(user);
  }

  @Post('search')
  @ApiOperation({ summary: 'Search And Paginate Users' })
  @ApiBadRequestResponse()
  async getManyBase(@Body() dto: SearchOptions) {
    const { content, count } = await this.userService.search(dto);
    return new UserPaginationVm({ content, count });
  }
}
