/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AeropuertoModule } from './aeropuerto/aeropuerto.module';
import { AerolineaModule } from './aerolinea/aerolinea.module';
import { AeropuertoEntity } from './aeropuerto/aeropuerto.entity/aeropuerto.entity';
import { AerolineaEntity } from './aerolinea/aerolinea.entity/aerolinea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AeropuertoAerolineaModule } from './aeropuerto-aerolinea/aeropuerto-aerolinea.module';

@Module({
  imports: [AeropuertoModule, AerolineaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'aerolineas',
      entities: [AeropuertoEntity, AerolineaEntity],
      dropSchema: true,
      synchronize: true,
    }),
    AeropuertoAerolineaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
