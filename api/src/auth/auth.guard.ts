import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';
import { promisify } from 'util';
import * as jwt from 'express-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const configService = new ConfigService();

    const req = context.getArgByIndex(0);
    const res = context.getArgByIndex(1);
    const checkJwt = promisify(
      jwt({
        secret: expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: configService.get('JWKS_URI'),
        }),
        audience: configService.get('AUDIENCE'),
        issuer: configService.get('ISSUER_URI'),
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJwt(req, res);
      return true;
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
}
