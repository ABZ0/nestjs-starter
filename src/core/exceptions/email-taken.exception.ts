import { BadRequestException } from '@nestjs/common';

const message = 'email is already registered';
export class EmailTakenException extends BadRequestException {
  constructor() {
    super(message);
  }
}
