/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoController } from './aeropuerto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity])],
  providers: [AeropuertoService],
  exports: [AeropuertoService],
  controllers: [AeropuertoController]
})
export class AeropuertoModule {}
