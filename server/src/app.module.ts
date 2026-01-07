import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatasetsModule } from './datasets/datasets.module';
import { ProjectsModule } from './projects/projects.module';
import { ResourcesModule } from './resources/resources.module';
import { SearchModule } from './search/search.module';
import { StorageModule } from './storage/storage.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchemasModule } from './schemas/schemas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    DatasetsModule,
    ProjectsModule,
    ResourcesModule,
    SearchModule,
    StorageModule,
    SchemasModule,
  ],
})
export class AppModule {}

