/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/type-orm-testing-config';
import { AeropuertoEntity } from './aeropuerto.entity/aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(getRepositoryToken(AeropuertoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    aeropuertosList = [];
    for(let i = 0; i < 5; i++) {
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
      aeropuertosList.push(await repository.save(aeropuerto));
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const aeropuertos = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne should return a specific airport', async () => {
    const storedAeropuerto: AeropuertoEntity = aeropuertosList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(storedAeropuerto.id);
    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.id).toBe(storedAeropuerto.id);
    expect(aeropuerto.nombre).toBe(storedAeropuerto.nombre);
    expect(aeropuerto.codigo).toBe(storedAeropuerto.codigo);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(service.findOne(0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('create should return a new airport', async () => {
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

    const newAeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newAeropuerto).not.toBeNull();

    const storedAeropuerto = await repository.findOne({ where: { id: newAeropuerto.id } });
    expect(storedAeropuerto).not.toBeNull();
    expect(storedAeropuerto!.nombre).toBe(newAeropuerto.nombre);
    expect(storedAeropuerto!.codigo).toBe(newAeropuerto.codigo);
  });

it('update should modify an airport', async () => {
  const aeropuerto = aeropuertosList[0];
  
  const updateData = {
    id: aeropuerto.id,
    nombre: "Updated Airport",
    codigo: aeropuerto.codigo, 
    pais: aeropuerto.pais,
    ciudad: aeropuerto.ciudad,
    created_at: aeropuerto.created_at,
    updated_at: aeropuerto.updated_at
  };
  
  const updatedAeropuerto: AeropuertoEntity = await service.update(aeropuerto.id, updateData as AeropuertoEntity);
  expect(updatedAeropuerto).not.toBeNull();
  
  const storedAeropuerto = await repository.findOne({ where: { id: aeropuerto.id } });
  expect(storedAeropuerto).not.toBeNull();
  expect(storedAeropuerto!.nombre).toBe("Updated Airport");
});

  it('update should throw an exception for an invalid airport', async () => {
    let aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto,
      nombre: "Update Airport"
    };
    await expect(service.update(0, aeropuerto)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('delete should remove an airport', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    await service.delete(aeropuerto.id);
    const deletedAeropuerto = await repository.findOne({ where: { id: aeropuerto.id } });
    expect(deletedAeropuerto).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    await expect(service.delete(0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });
});