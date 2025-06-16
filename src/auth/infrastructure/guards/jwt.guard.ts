import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /*
  handleRequest(err, user, info) {
    console.log('handleRequest - user:', user);
    if (err || !user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
  */
}
