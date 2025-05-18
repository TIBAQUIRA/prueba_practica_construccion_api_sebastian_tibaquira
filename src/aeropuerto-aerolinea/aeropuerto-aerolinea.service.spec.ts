/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/type-orm-testing-config';
import { AeropuertoEntity } from '../aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from '../aerolinea/aerolinea.entity/aerolinea.entity';
import { AeropuertoAerolineaService } from './aeropuerto-aerolinea.service';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('AeropuertoAerolineaService', () => {
  let service: AeropuertoAerolineaService;
  let aeropuertoRepository: Repository<AeropuertoEntity>;
  let aerolineaRepository: Repository<AerolineaEntity>;
  let aerolinea: AerolineaEntity;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoAerolineaService],
    }).compile();

    service = module.get<AeropuertoAerolineaService>(AeropuertoAerolineaService);
    aeropuertoRepository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    aerolineaRepository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await aeropuertoRepository.clear();
    await aerolineaRepository.clear();

    aeropuertosList = [];
    for (let i = 0; i < 5; i++) {
      const aeropuerto: AeropuertoEntity = {
        id: faker.number.int(),
        nombre: faker.location.city() + ' International Airport',
        codigo: faker.string.alpha(3).toUpperCase(),
        pais: faker.location.country(),
        ciudad: faker.location.city(),
        aerolineas: [],
        created_at: new Date(),
        updated_at: new Date()
      };
      aeropuertosList.push(await aeropuertoRepository.save(aeropuerto));
    }

    aerolinea = {
      id: faker.number.int(),
      nombre: faker.company.name() + ' Airlines',
      descripcion: faker.company.catchPhrase(),
      pagina_web: 'www.' + faker.internet.domainName(),
      fecha_fundacion: faker.date.past(),
      aeropuertos: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    aerolinea = await aerolineaRepository.save(aerolinea);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('agregarAeropuertoAAerolinea should add an airport to an airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    const nuevaAerolinea = await service.agregarAeropuertoAAerolinea(aerolinea.id, aeropuerto.id);

    expect(nuevaAerolinea.aeropuertos.length).toBe(1);
    expect(nuevaAerolinea.aeropuertos[0].id).toBe(aeropuerto.id);
  });

  it('agregarAeropuertoAAerolinea should throw an exception for an invalid airport', async () => {
    await expect(service.agregarAeropuertoAAerolinea(aerolinea.id, 0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('agregarAeropuertoAAerolinea should throw an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(service.agregarAeropuertoAAerolinea(0, aeropuerto.id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('obtenerAeropuertosDeLaAerolinea should return airports by airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.agregarAeropuertoAAerolinea(aerolinea.id, aeropuerto.id);

    const aeropuertos = await service.obtenerAeropuertosDeLaAerolinea(aerolinea.id);
    expect(aeropuertos.length).toBe(1);
    expect(aeropuertos[0].id).toBe(aeropuerto.id);
  });

  it('obtenerAeropuertosDeLaAerolinea should throw an exception for an invalid airline', async () => {
    await expect(service.obtenerAeropuertosDeLaAerolinea(0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('obtenerAeropuertoDeLaAerolinea should return an airport by airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.agregarAeropuertoAAerolinea(aerolinea.id, aeropuerto.id);

    const aeropuertoObtenido = await service.obtenerAeropuertoDeLaAerolinea(aerolinea.id, aeropuerto.id);
    expect(aeropuertoObtenido).not.toBeNull();
    expect(aeropuertoObtenido.id).toBe(aeropuerto.id);
  });

  it('obtenerAeropuertoDeLaAerolinea should throw an exception for an invalid airport', async () => {
    await expect(service.obtenerAeropuertoDeLaAerolinea(aerolinea.id, 0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('obtenerAeropuertoDeLaAerolinea should throw an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(service.obtenerAeropuertoDeLaAerolinea(0, aeropuerto.id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('obtenerAeropuertoDeLaAerolinea should throw an exception for an airport not associated to the airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(service.obtenerAeropuertoDeLaAerolinea(aerolinea.id, aeropuerto.id)).rejects.toHaveProperty('type', BusinessError.PRECONDITION_FAILED);
  });

  it('actualizarAeropuertosDeLaAerolinea should update airports list for an airline', async () => {
    const nuevosAeropuertos = [aeropuertosList[0], aeropuertosList[1]];
    const aerolineaActualizada = await service.actualizarAeropuertosDeLaAerolinea(aerolinea.id, nuevosAeropuertos);

    expect(aerolineaActualizada.aeropuertos.length).toBe(2);
    expect(aerolineaActualizada.aeropuertos[0].id).toBe(nuevosAeropuertos[0].id);
    expect(aerolineaActualizada.aeropuertos[1].id).toBe(nuevosAeropuertos[1].id);
  });

  it('actualizarAeropuertosDeLaAerolinea should throw an exception for an invalid airline', async () => {
    const nuevosAeropuertos = [aeropuertosList[0], aeropuertosList[1]];
    await expect(service.actualizarAeropuertosDeLaAerolinea(0, nuevosAeropuertos)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('actualizarAeropuertosDeLaAerolinea should throw an exception for an invalid airport', async () => {
    const aeropuertoInvalido = { ...aeropuertosList[0], id: 0 };
    await expect(service.actualizarAeropuertosDeLaAerolinea(aerolinea.id, [aeropuertoInvalido])).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('eliminarAeropuertoDeLaAerolinea should remove an airport from an airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.agregarAeropuertoAAerolinea(aerolinea.id, aeropuerto.id);

    await service.eliminarAeropuertoDeLaAerolinea(aerolinea.id, aeropuerto.id);

    const aerolineaActualizada = await aerolineaRepository.findOne({ where: { id: aerolinea.id }, relations: ["aeropuertos"] });
    expect(aerolineaActualizada).not.toBeNull();
    expect(aerolineaActualizada!.aeropuertos).toBeDefined();
    expect(aerolineaActualizada!.aeropuertos.length).toBe(0);
  });
  it('eliminarAeropuertoDeLaAerolinea should throw an exception for an invalid airport', async () => {
    await expect(service.eliminarAeropuertoDeLaAerolinea(aerolinea.id, 0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('eliminarAeropuertoDeLaAerolinea should throw an exception for an invalid airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(service.eliminarAeropuertoDeLaAerolinea(0, aeropuerto.id)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('eliminarAeropuertoDeLaAerolinea should throw an exception for an airport not associated to the airline', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await expect(service.eliminarAeropuertoDeLaAerolinea(aerolinea.id, aeropuerto.id)).rejects.toHaveProperty('type', BusinessError.PRECONDITION_FAILED);
  });
});