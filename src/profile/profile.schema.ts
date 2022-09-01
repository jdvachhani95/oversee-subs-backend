import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscription {
  @Prop({ type: String, required: true })
  planId: string;

  @Prop({ type: String, required: true })
  service: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    enum: ['BI_WEEKLY', 'MONTHLY', 'YEARLY'],
    required: true,
  })
  type: string;

  @Prop({ type: Number, required: true })
  amount: number;
}
export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

export type ProfileDocument = Profile & Document;
@Schema()
export class Profile {
  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String })
  first_name: string;

  @Prop({ type: String })
  last_name: string;

  @Prop({ type: String, default: '' })
  pref_lang?: string;

  @Prop({ type: String, default: '' })
  location?: string;

  @Prop({ type: [SubscriptionSchema], default: [] })
  subscriptions?: Subscription[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
