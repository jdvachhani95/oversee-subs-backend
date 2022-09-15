import { PartialType } from '@nestjs/mapped-types';
import { Profile } from 'src/profile/profile.schema';
import { CreateGroupDto } from './create-group.dto';

export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  members?: Profile[];
}
