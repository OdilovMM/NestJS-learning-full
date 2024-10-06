/* eslint-disable prettier/prettier */
import { UserEntity } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm';

// connect this entity to the parent module, => reports.module.ts
@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  mileage: number;

  // To define relationship, import related entity to this entity
  // Usually, relationships are defined in the entity files
  // eg: here, this report entity is related to user entity
  @ManyToOne(()=> UserEntity, (userEntity)=> userEntity.reports)
  user: UserEntity;
}
