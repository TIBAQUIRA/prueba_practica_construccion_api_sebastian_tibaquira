/* eslint-disable prettier/prettier */
import { IsDate, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsPastDate } from '../../shared/validators/is-past-date.validator';
import { Type } from 'class-transformer';

export class AerolineaDto {
  @IsNotEmpty({ message: 'El nombre de la aerolínea no puede estar vacío' })
  @IsString({ message: 'El nombre de la aerolínea debe ser una cadena de texto' })
  readonly nombre: string;

  @IsNotEmpty({ message: 'La descripción de la aerolínea no puede estar vacía' })
  @IsString({ message: 'La descripción de la aerolínea debe ser una cadena de texto' })
  readonly descripcion: string;

  @IsNotEmpty({ message: 'La página web de la aerolínea no puede estar vacía' })
  @IsString({ message: 'La página web de la aerolínea debe ser una cadena de texto' })
  readonly pagina_web: string;

  @IsNotEmpty({ message: 'La fecha de fundación de la aerolínea no puede estar vacía' })
  @Type(() => Date)
  @IsDate({ message: 'La fecha de fundación de la aerolínea debe ser una fecha válida' })
  @Validate(IsPastDate, { message: 'La fecha de fundación debe ser en el pasado' })
  readonly fecha_fundacion: Date;
}