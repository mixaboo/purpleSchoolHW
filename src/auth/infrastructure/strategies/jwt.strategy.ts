import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWT_IS_NOT_DEFINED_ERROR } from '../constants/auth.constants';
import { UserModel } from '../../../user/domain/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get('JWT_SECRET');
    if (!secret) {
      throw new Error(JWT_IS_NOT_DEFINED_ERROR);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: secret,
    });
  }

  async validate({ email }: Pick<UserModel, 'email' | 'role'>) {
    return {};
  }
}
