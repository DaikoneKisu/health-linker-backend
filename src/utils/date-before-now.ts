import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

@ValidatorConstraint({ name: 'dateBeforeNow', async: false })
export class DateBeforeNow implements ValidatorConstraintInterface {
  validate(value: string) {
    return new Date(value) < new Date()
  }

  defaultMessage() {
    return 'La fecha no puede ser mayor a la fecha actual.'
  }
}
