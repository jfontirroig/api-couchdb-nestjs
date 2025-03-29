// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // En producción, obtén esta clave de las variables de entorno
    });
  }

  async validate(payload: any) {
    // Aquí puedes realizar validaciones adicionales o buscar al usuario en la base de datos
    return { userId: payload.sub, username: payload.username };
  }
}
