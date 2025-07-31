import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDateString,
  ValidateIf,
  Validate,
} from "class-validator";
import { ProductInterface } from "../interfaces/product.interface";
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

// RODRIGO: Verificar si la fecha es hoy o futura
function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isFutureDate",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} debe ser hoy o una fecha futura`;
        },
      },
    });
  };
}

// RODRIGO: date_revision ≥ date_release
function IsAfter(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isAfter",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            relatedValue &&
            new Date(value).getTime() >= new Date(relatedValue).getTime()
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} debe ser igual o posterior a ${relatedPropertyName}`;
        },
      },
    });
  };
}

export class ProductDTO implements ProductInterface {
  @IsNotEmpty()
  id: string;

  @MinLength(6)
  @MaxLength(100)
  name: string;

  @MinLength(10)
  @MaxLength(200)
  description: string;

  @IsNotEmpty()
  logo: string;

  @IsNotEmpty()
  @IsDateString()
  @IsFutureDate({ message: "La fecha de lanzamiento debe ser hoy o futura" })
  date_release: string;

  @IsNotEmpty()
  @IsDateString()
  @IsFutureDate({ message: "La fecha de revisión debe ser hoy o futura" })
  @IsAfter("date_release", {
    message: "La fecha de revisión debe ser igual o posterior a la de lanzamiento",
  })
  date_revision: string;
}
