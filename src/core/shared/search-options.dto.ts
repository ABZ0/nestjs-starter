import { IsString, IsIn, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegexSpecialCharacters } from '../utils/string.util';

export class SearchOptions {
  @IsNumber()
  @Min(0)
  @Transform((val) => parseInt(val, 10))
  offset?: number = 0;

  @IsNumber()
  @Min(0)
  @Transform((val) => parseInt(val, 10))
  size?: number = 10;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  dir?: string;

  @IsOptional()
  @IsString()
  @Transform((val: string) => escapeRegexSpecialCharacters(val))
  searchTerm?: string;
}
