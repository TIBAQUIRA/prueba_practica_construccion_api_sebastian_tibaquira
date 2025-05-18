/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/type-orm-testing-config';
import { AerolineaEntity } from './aerolinea.entity/aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(getRepositoryToken(AerolineaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    aerolineasList = [];
    for (let i = 0; i < 5; i++) {
      const aerolinea: AerolineaEntity = {
        id: faker.number.int(),
        nombre: faker.company.name() + ' Airlines',
        descripcion: faker.company.catchPhrase(),
        pagina_web: 'www.' + faker.internet.domainName(),
        fecha_fundacion: faker.date.past(),
        aeropuertos: [],
        created_at: new Date(),
        updated_at: new Date()
      };
      aerolineasList.push(await repository.save(aerolinea));
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const aerolineas = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return a specific airline', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(storedAerolinea.id);
    expect(aerolinea).not.toBeNull();
    expect(aerolinea.id).toBe(storedAerolinea.id);
    expect(aerolinea.nombre).toBe(storedAerolinea.nombre);
    expect(aerolinea.descripcion).toBe(storedAerolinea.descripcion);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(service.findOne(0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('create should return a new airline', async () => {
    const aerolinea: AerolineaEntity = {
      id: faker.number.int(),
      nombre: faker.company.name() + ' Airlines',
      descripcion: faker.company.catchPhrase(),
      pagina_web: 'www.' + faker.internet.domainName(),
      fecha_fundacion: faker.date.past(),
      aeropuertos: [],
      created_at: new Date(),
      updated_at: new Date()
    };

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea = await repository.findOne({ where: { id: newAerolinea.id } });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea!.nombre).toBe(newAerolinea.nombre);
    expect(storedAerolinea!.descripcion).toBe(newAerolinea.descripcion);
  });

  it('update should modify an airline', async () => {
    const aerolinea = aerolineasList[0];

    const updateData = {
      id: aerolinea.id,
      nombre: "Updated Airline",
      descripcion: "Updated Description",
      pagina_web: aerolinea.pagina_web,
      fecha_fundacion: aerolinea.fecha_fundacion,
      created_at: aerolinea.created_at,
      updated_at: aerolinea.updated_at
    };

    const updatedAerolinea: AerolineaEntity = await service.update(aerolinea.id, updateData as AerolineaEntity);
    expect(updatedAerolinea).not.toBeNull();

    const storedAerolinea = await repository.findOne({ where: { id: aerolinea.id } });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea!.nombre).toBe("Updated Airline");
    expect(storedAerolinea!.descripcion).toBe("Updated Description");
  });

  it('update should throw an exception for an invalid airline', async () => {
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea,
      nombre: "Updated Airline"
    };
    await expect(service.update(0, aerolinea)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });

  it('delete should remove an airline', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    await service.delete(aerolinea.id);
    const deletedAerolinea = await repository.findOne({ where: { id: aerolinea.id } });
    expect(deletedAerolinea).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    await expect(service.delete(0)).rejects.toHaveProperty('type', BusinessError.NOT_FOUND);
  });
});