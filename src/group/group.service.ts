import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupDocument } from './group.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel('Group', 'osUsersDB')
    private groupModel: Model<GroupDocument>,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: string) {
    const newGroup = new this.groupModel({
      ...createGroupDto,
      created_at: new Date(),
      created_by: userId,
      members: [userId],
    });
    return newGroup.save();
  }

  async findAll(userId: string) {
    return await this.groupModel.find({ members: { $in: [userId] } });
  }

  async findOne(id: string, userId: string) {
    return await this.groupModel
      .findOne({ _id: id, members: { $in: [userId] } })
      .populate('created_by');
  }

  async update(id: string, userId: string, updateGroupDto: UpdateGroupDto) {
    return await this.groupModel.findOneAndUpdate(
      { _id: id, created_by: userId },
      {
        $set: { ...updateGroupDto },
      },
    );
  }

  async addMemberToGroup(id: string, userId: string) {
    return await this.groupModel.findOneAndUpdate(
      {
        _id: id,
        members: { $nin: [userId] },
      },
      { $push: { members: userId } },
      { new: true },
    );
  }

  async remove(id: string, userId: string) {
    await this.groupModel
      .findOne({ _id: id, created_by: userId })
      .remove()
      .exec();
  }
}
