import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { GroupSchema } from './group.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Group', schema: GroupSchema }],
      'osUsersDB',
    ),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
