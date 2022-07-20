import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule
} from '@nestjs/swagger';
import fastifyCookie from '@fastify/cookie';
import compression from '@fastify/compress';
import helmet from '@fastify/helmet'
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {

  const whitelist = ['http://localhost:3000', 'https://api-pmt.herokuapp.com'];
  const corsOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'PATCH', 'POST', 'PUT'],
    origin: (requestOrigin: string, callback) => {
      if (whitelist.indexOf(requestOrigin) !== -1 || !requestOrigin) {
        callback(null, true);
      } else {
        callback(new HttpException('Not allowed by CORS', HttpStatus.FORBIDDEN))
      }
    },
  };

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
    { cors: true }
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  await app.register(compression, { encodings: ['gzip', 'deflate'] });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });

  // Swagger Setup
  const config = new DocumentBuilder()
    .addBasicAuth()
    .addBearerAuth()
    .addCookieAuth('cookieAuth', { type: 'http', in: 'signedCookies', scheme: 'Bearer', name: 'jit' })
    .addServer('https://api-pmt.herokuapp.com', 'Main (production) Server')
    .addServer('http://localhost:3000', 'Localhost Server')
    .setContact('Lekan Adetunmbi', 'https://pollaroid.net', 'me@pollaroid.net')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setTitle('Project Tracker API')
    .setDescription('A Role-based Project Management API heavily backed by Authorizations provided by the CASL Authorization Library')
    .setVersion('1.0')
    .addTag('Project Tracker')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  };

  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Project Tracker API Docs',
    customfavIcon: 'NONE',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true
    }
  }

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api-docs', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
