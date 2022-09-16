import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ProfileModule } from './profile/profile.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './group/group.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING_OS_USERS_DB, {
      connectionName: 'osUsersDB',
    }),
    ProfileModule,
    AuthModule,
    GroupModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
