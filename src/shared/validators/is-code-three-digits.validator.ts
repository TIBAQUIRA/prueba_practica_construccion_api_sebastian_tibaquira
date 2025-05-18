/* eslint-disable prettier/prettier */
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { BusinessLogicException, BusinessError } from '../errors/business-errors';

@ValidatorConstraint({ name: 'isCodeThreeDigits', async: false })
export class IsCodeThreeDigits implements ValidatorConstraintInterface {
  validate(code: string) {
    const regex = /^[A-Za-z0-9]{3}$/;
    if (!regex.test(code)) {
      throw new BusinessLogicException('El código debe tener exactamente 3 dígitos', BusinessError.BAD_REQUEST);
    }
    return true;
  }

  defaultMessage() {
    return 'El código debe tener exactamente 3 dígitos';
  }
}