/* eslint-disable prettier/prettier */
import { AerolineaEntity } from '../../aerolinea/aerolinea.entity/aerolinea.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('aeropuertos')
export class AeropuertoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  codigo: string;

  @Column()
  pais: string;

  @Column()
  ciudad: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => AerolineaEntity, aerolinea => aerolinea.aeropuertos)
  aerolineas: AerolineaEntity[];
}