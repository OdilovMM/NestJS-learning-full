/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  // all user services look like as this services. It is a mandatory
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  // below create relevant methods
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    // User entity instance is being saved
    return this.repo.save(user);
    //  Hooks are not executed
    // return this.repo.save({email, password})
  }

  findOne(id: number) {
    // findOne always return one record or null
    return this.repo.findOne({ where: { id } });
  }

  find(email: string) {
    // find always return an array of this record
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found to update');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found to delete');
    }
    return this.repo.remove(user);
  }
}
