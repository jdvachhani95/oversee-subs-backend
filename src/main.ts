import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  if (PORT) {
    console.log('PORT Defined is:', PORT);
  } else console.log('PORT is not Defined');
  const MONGO_URI = configService.get<string>(
    'MONGODB_CONNECTION_STRING_OS_USERS_DB',
  );
  if (MONGO_URI) {
    console.log('Mongo URL is', MONGO_URI?.slice(0, 20));
  } else console.log('MONGO URL undefined');

  await app.listen(PORT || 3000);
}
bootstrap();
