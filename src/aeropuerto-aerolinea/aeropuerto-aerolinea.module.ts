/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AeropuertoEntity } from 'src/aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from 'src/aerolinea/aerolinea.entity/aerolinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoAerolineaController } from './aeropuerto-aerolinea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AeropuertoEntity, AerolineaEntity])],
  providers: [AeropuertoAerolineaService],
  controllers: [AeropuertoAerolineaController]
})
export class AeropuertoAerolineaModule {}
