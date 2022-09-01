import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateProfileInput,
  UpdateProfileInput,
} from './dto/create-profile.input';
import { Profile } from './profile.schema';
import { ProfileService } from './profile.service';
import { comparePassword, encodePassword } from '../utils/passwordUtils';
import { JoiValidationPipe } from 'src/validations/validation.pipe';
import { UpdateProfileInputValidationSchema } from 'src/validations/updateProfile.validation';

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async findAll() {
    return new Promise((resolve, rejects) =>
      resolve(this.profileService.findAll()),
    );
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return new Promise((resolve, reject) => {
      resolve(this.profileService.findOneById(id));
    });
  }

  @Post('login')
  async login(@Body('loginInfo') loginInfo) {
    const userProfile = await this.profileService
      .findOneByEmail(loginInfo.email)
      .then((profile) => {
        return profile;
      })
      .catch((err) => {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Account with given email does not exist',
          },
          HttpStatus.FORBIDDEN,
        );
      });
    const isMatch = await comparePassword(
      userProfile.password,
      loginInfo.password,
    );
    if (!isMatch) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'provided credential is not correct',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { password, ...profile } = userProfile;
    return profile;
  }

  //   @UseGuards(AuthGuard('jwt'))
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
