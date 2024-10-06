import { Request } from 'express';
/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { UserEntity } from '../user.entity';

// declare global {
//     namespace Express {
//         interface Request {
//             currentUser?: UserEntity
//         }
//     }
// }

// ES2015 module syntax is preferred over namespaces.eslint@typescript-eslint/no-namespace
// Extend the Request interface using declaration merging
declare module 'express' {
    interface Request {
      currentUser?: UserEntity;
    }
  }


@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private usersService: UsersService){}

    async use(req: Request, res: Response, next: NextFunction){
        const {userId} = req.session || {};

        if(userId) {
            const user = await this.usersService.findOne(userId);
            req.currentUser = user;
        }

        next();
    }
}