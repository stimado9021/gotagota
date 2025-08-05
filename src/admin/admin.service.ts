import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Prestamo } from 'src/prestamo/entities/prestamo.entity';
import { Vendedor } from 'src/vendedor/entities/vendedor.entity';
import { Repository } from 'typeorm';

export interface ResumenVendedor {
  vendedorId: string;
  nombre: string;
  totalPrestado: number;
  ganancia: number;
  cantidadPrestamos: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Vendedor)
    private vendedorRepository: Repository<Vendedor>,
    @InjectRepository(Prestamo)
    private prestamoRepository: Repository<Prestamo>,
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
  ) { }

  async getResumenPrestamosPorVendedor(): Promise<ResumenVendedor[]> {
    const vendedores = await this.vendedorRepository.find();

    const resumen: ResumenVendedor[] = [];

    for (const vendedor of vendedores) {
      const prestamos = await this.prestamoRepository.find({
        where: { vendedorId: vendedor.id },
      });

      let totalPrestado = 0;
      let cantidadPrestamos = 0;

      prestamos.forEach((p) => {
        totalPrestado += Number(p.monto);
        cantidadPrestamos += 1;
      });

      const ganancia = totalPrestado * 0.2;

      resumen.push({
        vendedorId: vendedor.id,
        nombre: vendedor.nombre,
        totalPrestado,
        cantidadPrestamos,
        ganancia,
      });
    }

    return resumen;
  }
}
