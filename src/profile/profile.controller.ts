import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  CreateProfileInput,
  UpdateProfileInput,
} from './dto/create-profile.input';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';
import { encodePassword } from '../utils/passwordUtils';
import { JoiValidationPipe } from 'src/validations/validation.pipe';
import { UpdateProfileInputValidationSchema } from 'src/validations/updateProfile.validation';
import { JwtAuthGuard } from 'src/auth/guards/jwt--auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async findAll() {
    return new Promise((resolve, rejects) =>
      resolve(this.profileService.findAll()),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async find(@Request() req) {
    const { userId: parsedId } = req.user;
    const { id } = req.params;
    if (id !== parsedId) {
      throw new UnauthorizedException();
    }
    return await this.profileService.findOneById(id);
  }

  @Post()
  async create(
    @Body('createProfileInput') createProfileInput: CreateProfileInput,
  ) {
    const userExist = await this.profileService
      .findOneByEmail(createProfileInput.email)
      .then((profile) => {
        return profile;
      })
      .catch((err) => {
        //Do nothing
      });
    if (userExist) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Account already exist with given email',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    createProfileInput.password = await encodePassword(
      createProfileInput.password,
    );
    return new Promise((resolve) => {
      const profileData: Profile = {
        ...createProfileInput,
        created_at: new Date(),
      };
      resolve(this.profileService.create(profileData));
    });
  }

  @Patch(':id')
  @UsePipes(new JoiValidationPipe(UpdateProfileInputValidationSchema))
  async updateProfile(
    @Param('id') id: string,
    @Body('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ) {
    return await this.profileService.updateProfile(id, updateProfileInput);
  }
}
