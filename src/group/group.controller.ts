import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt--auth.guard';

@Controller('group')
export class GroupController {
  constructor(
    private groupService: GroupService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    const { userId } = req.user;
    return this.groupService.create(createGroupDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    const { userId } = req.user;
    return this.groupService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    return this.groupService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/link')
  async generateGroupLink(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    const groupInfo = await this.groupService.findOne(id, userId);
    const payload = { groupId: groupInfo._id };
    const token = this.jwtService.sign(payload, {
      expiresIn: '7 days',
    });
    return `${process.env.BASE_URL}/group/${groupInfo._id}/join?token=${token}`;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    const { userId } = req.user;
    return this.groupService.update(id, userId, updateGroupDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinGroup(
    @Request() req,
    @Param('id') id: string,
    @Query('token') token: string,
  ) {
    const { userId } = req.user;
    const payload = await this.jwtService
      .verifyAsync(token)
      .then((decoded) => decoded)
      .catch((err) => {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: err.message,
          },
          HttpStatus.UNAUTHORIZED,
        );
      });
    if (payload.groupId !== id) {
      throw new ForbiddenException();
    }
    return await this.groupService.addMemberToGroup(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const { userId } = req.user;
    return this.groupService.remove(id, userId);
  }
}
