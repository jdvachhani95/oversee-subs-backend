import { Subscription } from '../profile.schema';

export class CreateProfileInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export class UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  location?: string;
  subscriptions?: Subscription[];
}
