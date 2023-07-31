import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dtos/user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    // ToDo: email should not be in use
    return this.userRepository.create({
      ...createUserDto,
      timestamp: new Date(),
    });
  }
}
