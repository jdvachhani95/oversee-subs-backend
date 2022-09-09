import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'src/profile/profile.schema';
import { comparePassword } from 'src/utils/passwordUtils';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, enteredPass: string): Promise<any> {
    const user = await this.profileService.findOneByEmail(email);
    const isMatch = await comparePassword(user.password, enteredPass);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
