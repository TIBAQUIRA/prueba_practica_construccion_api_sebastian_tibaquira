/* eslint-disable prettier/prettier */
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BusinessLogicException, BusinessError } from '../errors/business-errors';

@ValidatorConstraint({ name: 'isPastDate', async: false })
export class IsPastDate implements ValidatorConstraintInterface {
  validate(date: Date) {
    const now = new Date();
    if (date >= now) {
      throw new BusinessLogicException('La fecha debe ser en el pasado', BusinessError.INVALID_DATE);
    }
    return true;
  }

  defaultMessage() {
    return 'La fecha debe ser en el pasado';
  }
}