import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PORT } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Enable CORS
  app.enableCors();

  //Swagger API documentation configuration
  const config = new DocumentBuilder()
    .setTitle('ING ATMs APIs')
    .setDescription('CRUD APIs')
    .setVersion('1.0')
    .addTag('ING ATMs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // handle all user input validation globally
  app.useGlobalPipes(new ValidationPipe());
  const APP_PORT = parseInt(process.env.PORT) || PORT;
  await app.listen(APP_PORT, () => { console.log("Running on port", APP_PORT) });
}
bootstrap();
