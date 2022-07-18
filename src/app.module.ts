import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { User } from './user/entities/user.entity';
import { Project } from './project/entities/project.entity';
import { ProjectAccess } from './project/entities/project-access.entity';
import configuration from './config/configuration';
import { RolesGuard } from './auth/guards/roles.guard';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Project, ProjectAccess, User],
        migrations: ['dist/migrations/*.js'],
        migrationsTableName: 'migrations_history',
        synchronize: true,    // Auto-Sync currently enabled here because of -d /path-to-datasource option issue with typeorm:generate in package.json scripts for typeorm version ^0.3.x
        ssl: {
          rejectUnauthorized: false
        }
      }),
      inject: [ConfigService]
    }),

    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        ttl: 300,
        max: 1000,

        store: redisStore,
        url: configService.get<string>('REDIS_HOST_URL'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
        name: configService.get<string>('REDIS_DATABASE_NAME'),
      }),
      inject: [ConfigService]
    }),

    AuthModule,
    UserModule,
    ProjectModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
}
