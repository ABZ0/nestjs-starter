import {
  IsString,
  IsIn,
  IsArray,
  IsNumber,
  IsOptional,
  Min,
  IsPositive,
  IsObject,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { escapeRegexSpecialCharacters } from '../utils/string.util';

export class SearchOptions {
  @IsNumber()
  @Min(0)
  offset: number = 0;

  @IsPositive()
  size: number = 10;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  dir: string;

  @IsOptional()
  @IsString()
  @Transform((val: string) => escapeRegexSpecialCharacters(val))
  searchTerm: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  filterBy: { [key: string]: any }[];
}
