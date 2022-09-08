import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileDocument } from './profile.schema';
import {
  CreateProfileInput,
  UpdateProfileInput,
} from './dto/create-profile.input';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel('Profile', 'profileDB')
    private profileModel: Model<ProfileDocument>,
  ) {}

  // Only used during registration
  async create(createProfileInput: CreateProfileInput) {
    const newProfile = new this.profileModel({
      ...createProfileInput,
      created_at: new Date(),
    });
    return newProfile.save();
  }

  // query to pull user profile
  async findOneById(id: string) {
    try {
      return await this.profileModel.findOne({ _id: id });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Could not find profile for the given uuid',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findOneByEmail(email: string) {
    const result = await this.profileModel.aggregate([
      {
        $match: {
          email,
        },
      },
    ]);

    const profile: ProfileDocument = result[0];

    if (!profile) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Could not find profile for the given email',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return profile;
  }

  async findAll() {
    return await this.profileModel.find({}).lean();
  }

  async updateProfile(id: string, updateProfileInput: UpdateProfileInput) {
    let updatedProfile = await this.profileModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...updateProfileInput } },
      { new: true },
    );
    return updatedProfile;
  }
}
