/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AerolineaService } from './aerolinea.service';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AerolineaController } from './aerolinea.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AerolineaEntity])],
  providers: [AerolineaService],
  exports: [AerolineaService],
  controllers: [AerolineaController],
})
export class AerolineaModule {}
