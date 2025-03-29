import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import https from 'https'
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { logger } from './logger'; // Importar logger

// Importar Swagger si es necesario
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Cargar el archivo .env
dotenv.config();

async function bootstrap() {

  let httpsOptions = {}
  if (process.env.NODE_ENV !== 'development') {
     httpsOptions = {
        key: fs.readFileSync('/etc/letsencrypt/live/idp.ubid.app/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/idp.ubid.app/fullchain.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/idp.ubid.app/chain.pem'),
     };
  }else{
     httpsOptions = {
        key: fs.readFileSync('private.key'),
        cert: fs.readFileSync('public.cert'),
     };
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ https: httpsOptions }),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Usar el logger configurado
  app.useLogger(logger);

  // Configurar CORS
  app.enableCors();

  // Configuración de Swagger (si es necesario)
  // const options = new DocumentBuilder()
  //   .setTitle('API Example')
  //   .setDescription('API description')
  //   .setVersion('1.0')
  //   .build();
  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api', app, document);

  // Definición del puerto
  const port = process.env.PORT || 3000;

  await app.listen(port, () => {
      logger.info(`Server is running on ${port}`);
  });
}

bootstrap().catch(err => {
  logger.error('Error during bootstrapping the application', err);
});
