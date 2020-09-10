import { BadRequestException } from '@nestjs/common';

const message = ' already exists';
export class RecordExistsException extends BadRequestException {
  constructor(record: string) {
    super(record + message);
  }
}
