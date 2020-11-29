import { BadRequestException } from '@nestjs/common';

const message = 'failed to send email';
export class FailedToSendMailException extends BadRequestException {
  constructor() {
    super(message);
  }
}
