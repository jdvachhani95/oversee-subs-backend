import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Profile } from 'src/profile/profile.schema';

export type GroupDocument = Group & mongoose.Document;
@Schema()
export class Group {
  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  created_by: Profile;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }])
  members: Profile[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
