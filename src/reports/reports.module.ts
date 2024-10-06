/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity])], //import the user entity
  controllers: [ReportsController],
  providers: [ReportsService]
})
export class ReportsModule {}

// after connecting the UserEntity to this parent module, then connect the entity to the root connection (in app module)
