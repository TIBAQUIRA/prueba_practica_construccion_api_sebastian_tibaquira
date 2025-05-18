/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoAerolineaController {
    constructor(private readonly aeropuertoAerolineaService: AeropuertoAerolineaService) {}

    @Post(':aerolineaId/aeropuertos/:aeropuertoId')
    async agregarAeropuertoAAerolinea(@Param('aerolineaId') aerolineaId: number, @Param('aeropuertoId') aeropuertoId: number) {
        return await this.aeropuertoAerolineaService.agregarAeropuertoAAerolinea(aerolineaId, aeropuertoId);
    }

    @Get(':aerolineaId/aeropuertos')
    async obtenerAeropuertosDeLaAerolinea(@Param('aerolineaId') aerolineaId: number) {
        return await this.aeropuertoAerolineaService.obtenerAeropuertosDeLaAerolinea(aerolineaId);
    }

    @Get(':aerolineaId/aeropuertos/:aeropuertoId')
    async obtenerAeropuertoDeLaAerolinea(@Param('aerolineaId') aerolineaId: number, @Param('aeropuertoId') aeropuertoId: number) {
        return await this.aeropuertoAerolineaService.obtenerAeropuertoDeLaAerolinea(aerolineaId, aeropuertoId);
    }

    @Put(':aerolineaId/aeropuertos')
    async actualizarAeropuertosDeLaAerolinea(@Param('aerolineaId') aerolineaId: number, @Body() aeropuertos: AeropuertoEntity[]) {
        return await this.aeropuertoAerolineaService.actualizarAeropuertosDeLaAerolinea(aerolineaId, aeropuertos);
    }

    @Delete(':aerolineaId/aeropuertos/:aeropuertoId')
    async eliminarAeropuertoDeLaAerolinea(@Param('aerolineaId') aerolineaId: number, @Param('aeropuertoId') aeropuertoId: number) {
        return await this.aeropuertoAerolineaService.eliminarAeropuertoDeLaAerolinea(aerolineaId, aeropuertoId);
    }
}