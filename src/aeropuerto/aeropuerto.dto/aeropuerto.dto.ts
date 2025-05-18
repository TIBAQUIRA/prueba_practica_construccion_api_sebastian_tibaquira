/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsCodeThreeDigits } from '../../shared/validators/is-code-three-digits.validator';

export class AeropuertoDto {
  @IsNotEmpty({ message: 'El nombre del aeropuerto no puede estar vacío' })
  @IsString({ message: 'El nombre del aeropuerto debe ser una cadena de texto' })
  readonly nombre: string;

  @IsNotEmpty({ message: 'El código del aeropuerto no puede estar vacío' })
  @IsString({ message: 'El código del aeropuerto debe ser una cadena de texto' })
  @Validate(IsCodeThreeDigits, { message: 'El código del aeropuerto debe tener exactamente 3 caracteres' })
  readonly codigo: string;

  @IsNotEmpty({ message: 'El país del aeropuerto no puede estar vacío' })
  @IsString({ message: 'El país del aeropuerto debe ser una cadena de texto' })
  readonly pais: string;

  @IsNotEmpty({ message: 'La ciudad del aeropuerto no puede estar vacía' })
  @IsString({ message: 'La ciudad del aeropuerto debe ser una cadena de texto' })
  readonly ciudad: string;
}