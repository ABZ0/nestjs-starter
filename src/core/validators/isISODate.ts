import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isDateString,
  isDate,
} from 'class-validator';

/**
 * Checks if a given value is a ISOString date.
 * @param validationOptions
 */
export function IsISODate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isISODate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        ...validationOptions,
        message: `${propertyName} must be a ISOString.`,
      },
      validator: {
        validate(value: Date, args: ValidationArguments) {
          return isDateString(value.toISOString());
        },
      },
    });
  };
}
