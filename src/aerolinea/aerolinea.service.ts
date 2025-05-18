/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AerolineaService {
    constructor(
        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
    ) { }

    async findAll(): Promise<AerolineaEntity[]> {
        return this.aerolineaRepository.find({ relations: ['aeropuertos'] });
    }

    async findOne(id: number): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id }, relations: ['aeropuertos'] });
        if (!aerolinea)
            throw new BusinessLogicException('Aerolinea no encontrada con el id proporcionado', BusinessError.NOT_FOUND);

       return aerolinea;
    }

    async create(aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        return this.aerolineaRepository.save(aerolinea);
    }

    async update(id: number, aerolinea: AerolineaEntity): Promise<AerolineaEntity> {
        const aerolineaExistente = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolineaExistente)
            throw new BusinessLogicException('Aerolinea no encontrada con el id proporcionado', BusinessError.NOT_FOUND);

        await this.aerolineaRepository.update(id, aerolinea);
        return aerolinea
    }

    async delete(id: number): Promise<void> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id } });
        if (!aerolinea)
            throw new BusinessLogicException('Aerolinea no encontrada con el id proporcionado', BusinessError.NOT_FOUND);
        await this.aerolineaRepository.delete(id);
    }
}
