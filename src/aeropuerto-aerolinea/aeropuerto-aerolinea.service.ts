/*eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AeropuertoAerolineaService {
    constructor(
        @InjectRepository(AeropuertoEntity)
        private readonly aeropuertoRepository: Repository<AeropuertoEntity>,

        @InjectRepository(AerolineaEntity)
        private readonly aerolineaRepository: Repository<AerolineaEntity>,
    ) { }

    async agregarAeropuertoAAerolinea(idAerolinea: number, idAeropuerto: number): Promise<AerolineaEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: idAeropuerto } });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: idAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no fue encontrada", BusinessError.NOT_FOUND);

        if (!aerolinea.aeropuertos) {
            aerolinea.aeropuertos = [];
        }

        aerolinea.aeropuertos = [...aerolinea.aeropuertos, aeropuerto];
        return await this.aerolineaRepository.save(aerolinea);
    }

    async obtenerAeropuertosDeLaAerolinea(idAerolinea: number): Promise<AeropuertoEntity[]> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: idAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no fue encontrada", BusinessError.NOT_FOUND);

        return aerolinea.aeropuertos || [];
    }

    async obtenerAeropuertoDeLaAerolinea(idAerolinea: number, idAeropuerto: number): Promise<AeropuertoEntity> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: idAeropuerto } });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: idAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no fue encontrada", BusinessError.NOT_FOUND);

        if (!aerolinea.aeropuertos) {
            throw new BusinessLogicException("La aerolínea no tiene aeropuertos asociados", BusinessError.PRECONDITION_FAILED);
        }

        const aeropuertoDeLaAerolinea = aerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

        if (!aeropuertoDeLaAerolinea)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no está asociado a la aerolínea", BusinessError.PRECONDITION_FAILED);

        return aeropuertoDeLaAerolinea;
    }

    async actualizarAeropuertosDeLaAerolinea(idAerolinea: number, aeropuertos: AeropuertoEntity[]): Promise<AerolineaEntity> {
        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: idAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no fue encontrada", BusinessError.NOT_FOUND);

        for (let i = 0; i < aeropuertos.length; i++) {
            const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: aeropuertos[i].id } });
            if (!aeropuerto)
                throw new BusinessLogicException("El aeropuerto con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);
        }

        aerolinea.aeropuertos = aeropuertos;
        return await this.aerolineaRepository.save(aerolinea);
    }

    async eliminarAeropuertoDeLaAerolinea(idAerolinea: number, idAeropuerto: number): Promise<void> {
        const aeropuerto = await this.aeropuertoRepository.findOne({ where: { id: idAeropuerto } });
        if (!aeropuerto)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no fue encontrado", BusinessError.NOT_FOUND);

        const aerolinea = await this.aerolineaRepository.findOne({ where: { id: idAerolinea }, relations: ["aeropuertos"] });
        if (!aerolinea)
            throw new BusinessLogicException("La aerolínea con el id proporcionado no fue encontrada", BusinessError.NOT_FOUND);

        if (!aerolinea.aeropuertos) {
            aerolinea.aeropuertos = [];
            throw new BusinessLogicException("La aerolínea no tiene aeropuertos asociados", BusinessError.PRECONDITION_FAILED);
        }

        const aeropuertoDeLaAerolinea = aerolinea.aeropuertos.find(a => a.id === aeropuerto.id);

        if (!aeropuertoDeLaAerolinea)
            throw new BusinessLogicException("El aeropuerto con el id proporcionado no está asociado a la aerolínea", BusinessError.PRECONDITION_FAILED);

        aerolinea.aeropuertos = aerolinea.aeropuertos.filter(a => a.id !== idAeropuerto);
        await this.aerolineaRepository.save(aerolinea);
    }
}