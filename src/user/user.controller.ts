import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.LENDER)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get('vendedores')
  @Roles(UserRole.ADMIN)
  findVendedores() {
    return this.userService.findVendedores();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('vendedor/:vendedorId/clientes')
  @Roles(UserRole.ADMIN, UserRole.LENDER)
  findClientesByVendedor(@Param('vendedorId') vendedorId: string) {
    return this.userService.findClientesByVendedor(vendedorId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.LENDER)
  update(@Param('id') id: string, @Body() updateData: Partial<CreateUserDto>) {
    return this.userService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}