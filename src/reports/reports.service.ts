/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { UserEntity } from 'src/users/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
    // The report entity describes the how a table looks like and defines table names
  constructor(
    @InjectRepository(ReportEntity) private repo: Repository<ReportEntity>,
  ) {}

  create(reportDto: CreateReportDto, user: UserEntity) {
    const report = this.repo.create(reportDto);
    // linking current user id to the report's user property to show the owner of the report
    report.user = user;
    return this.repo.save(report)
  }

  async updateApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne(id);
    if(!report) {
        throw new NotFoundException('Report not found!')
    }
    // linking current user id to the report's user property to show the owner of the report
    report.approved = approved;
    return this.repo.save(report)
  }

  createEstimate({make, model, lng, lat, year, mileage}: GetEstimateDto){
    return this.repo.createQueryBuilder()
    .select('AVG(price)', 'price')
    .where('make = :make', {make})
    .andWhere('model = :model', {model})
    .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
    .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
    .andWhere('year - :year BETWEEN -3 AND 3', {year})
    .andWhere('approved IS TRUE')
    .orderBy('ABS(mileage - :mileage)', 'DESC')
    .setParameters({mileage})
    .limit(3)
    .getRawOne()
  }
}
