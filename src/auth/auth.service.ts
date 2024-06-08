import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    console.log('Register function called');
    console.log('Received data:', { name, email, password });

    const user = await this.userService.findOneByEmail(email);
    console.log('User found:', user);

    if (user) {
      console.log('User already exists');
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    await this.userService.create({
      name,
      email,
      password: hashedPassword
    });

    console.log('User created successfully');
    return {
      name,
      email
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }
}
