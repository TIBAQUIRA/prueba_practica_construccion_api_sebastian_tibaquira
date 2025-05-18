/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { AerolineaDto } from './aerolinea.dto/aerolinea.dto';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaService } from './aerolinea.service';

@Controller('aerolineas')
@UseInterceptors(BusinessErrorsInterceptor)
export class AerolineaController {
    constructor(private readonly aerolineaService: AerolineaService) {}

    @Get()
    async findAll() {
        return await this.aerolineaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.aerolineaService.findOne(id);
    }

    @Post()
    async create(@Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.create(aerolinea);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() aerolineaDto: AerolineaDto) {
        const aerolinea: AerolineaEntity = plainToInstance(AerolineaEntity, aerolineaDto);
        return await this.aerolineaService.update(id, aerolinea);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number) {
        return await this.aerolineaService.delete(id);
    }
}