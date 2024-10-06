/* eslint-disable prettier/prettier */
import { ReportEntity } from 'src/reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
// import { Exclude } from 'class-transformer';


// connect this entity to the parent module, => users.module.ts.
// after that, attach this entity to the relevant repository => user.service.ts
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
//   @Exclude() to remove the password from the response
  password: string;

  @Column({default: true})
  admin: boolean;

  // To define relationship, import related entity to this entity
  // Usually, relationships are defined in the entity files
  // eg: here, this report entity is related to report entity
  @OneToMany(()=> ReportEntity, (reportEntity)=> reportEntity.user)
  reports: ReportEntity[];

  @AfterInsert()
  logInsert() {
    console.log('Inserting the user with id', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removing the user with id', this.id);
  }
  @AfterUpdate()
  logUpdating() {
    console.log('Updating the user with id', this.id);
  }
}
