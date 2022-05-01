import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // handle all user input validation globally
  app.useGlobalPipes(new ValidateInputPipe());
  await app.listen(process.env.PORT);
}
bootstrap();
