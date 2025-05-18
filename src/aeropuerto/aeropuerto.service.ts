/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,
    ) { }

    async findAll(): Promise<AeropuertoEntity[]> {
        return this.aeropuertoRepository.find({ relations: ['aerolineas'] });
    }

    async findOne(id: number): Promise<AeropuertoEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id }, relations: ['aerolineas'] });
        if (!aeropuerto)
            throw new BusinessLogicException('Aeropuerto no encontrado con el id proporcionado', BusinessError.NOT_FOUND);

       return aeropuerto;
    }

    async create(aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        return this.aeropuertoRepository.save(aeropuerto);
    }

    async update(id: number, aeropuerto: AeropuertoEntity): Promise<AeropuertoEntity> {
        const aeropuertoExistente = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!aeropuertoExistente)
            throw new BusinessLogicException('Aeropuerto no encontrado con el id proporcionado', BusinessError.NOT_FOUND);

        await this.aeropuertoRepository.update(id, aeropuerto);
        return aeropuerto;
    }

    async delete(id: number): Promise<void> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id } });
        if (!aeropuerto)
            throw new BusinessLogicException('Aeropuerto no encontrado con el id proporcionado', BusinessError.NOT_FOUND);
        await this.aeropuertoRepository.delete(id);
    }
}