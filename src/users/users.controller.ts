/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
  Query,
  NotFoundException,
  Session,
  UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // applying to all endpoints , transforming the response object and sending it to the client,
// for example , not showing the user's password
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  //  in order to validate the incoming request from the client, we use DTO in order to
  //  validate the required data

  // @Get('/whoami')
  // whoAmI(@Session() session: any){
  //   return this.usersService.findOne(session.userId)

  // }
  
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserEntity){
    return user;

  }

  @Get('/logout')
  logoutUser(@Session() session: any){
    session.userId = null;
  }

  @Post('/register')
  async registerUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async loginUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  //  in order to validate the incoming request from the client, we use DTO in order to
  //  validate the required data
  @Get('users')
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  //   @Serialize(UserDto) // transforming the outgoing response
  @Get('/:id')
  async findOneUser(@Param('id') id: string) {
    // in the req.params, ID's always come with string type, then we need to parse it to number
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`The user with that ID ${id} is not found!`);
    }
    return user;
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
