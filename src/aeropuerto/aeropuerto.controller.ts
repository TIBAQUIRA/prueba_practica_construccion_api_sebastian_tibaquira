/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { AeropuertoDto } from './aeropuerto.dto/aeropuerto.dto';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';

@Controller('aeropuertos')
@UseInterceptors(BusinessErrorsInterceptor)
export class AeropuertoController {
    constructor(private readonly aeropuertoService: AeropuertoService) {}

    @Get()
    async findAll() {
        return await this.aeropuertoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.aeropuertoService.findOne(id);
    }

    @Post()
    async create(@Body() aeropuertoDto: AeropuertoDto) {
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return await this.aeropuertoService.create(aeropuerto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() aeropuertoDto: AeropuertoDto) {
        const aeropuerto: AeropuertoEntity = plainToInstance(AeropuertoEntity, aeropuertoDto);
        return await this.aeropuertoService.update(id, aeropuerto);
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: number) {
        return await this.aeropuertoService.delete(id);
    }
}