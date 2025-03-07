import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<{ accessToken: string; user: any }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ 
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.hashed_password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    // Extract role names & permissions from the database
    const roles = user.roles.map(role => role.name);
    const permissions = user.roles.flatMap(role => role.permissions.map(p => p.name));

    // Generate JWT token
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles,
      permissions, 
    };

    const token = this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
    return { accessToken: token, user: payload };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, username } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, username, hashed_password: hashedPassword });
    await this.userRepository.save(user);
    return { message: 'User registered successfully' };
  }
}
