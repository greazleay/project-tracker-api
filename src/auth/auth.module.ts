import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: false,
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        publicKey: configService.get<string>('ACCESS_TOKEN_PUBLIC_KEY'),
        privateKey: { key: configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'), passphrase: configService.get<string>('ACCESS_TOKEN_SECRET') },
        signOptions: { algorithm: 'RS256', audience: 'http://localhost:3000', expiresIn: '15m', issuer: 'http://localhost:3000', },
      }),
    })

  ],
  exports: [AuthService],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})

export class AuthModule { }
