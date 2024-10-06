/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    // dependency injection
    constructor(private usersService: UsersService){}

    // methods
    async register(email: string, password: string){
        // a. check the email is in use
        const users = await this.usersService.find(email);
        if(users.length) {
            throw new BadRequestException('Email already in use')
        }
         
        // b. hashing the password

        // 1. Generate a salt
        const salt = randomBytes(8).toString('hex');

        // 2. Hash the salt and password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // 3. Join both together (ref 2)
        const hashedPassword = salt + '.' + hash.toString('hex');

        // c. create a new user and save it
        const user = await this.usersService.create(email, hashedPassword);

        // d. return the user
        return user;
    }

    async login(email: string, password: string){
        const [user] = await this.usersService.find(email);
        if(!user) {
            throw new NotFoundException('User not found');
        }
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Incorrect Credentials');
        } 
        return user;
    }
}