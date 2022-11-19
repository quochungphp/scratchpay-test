import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, Matches, IsString, IsNotEmpty } from 'class-validator';
import { toLowerCase } from '../../../utils/to-lower-case';

export class ClinicSearchQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => toLowerCase(value))
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => toLowerCase(value))
  stateName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/[0-9]{1,2}:[0-9]{1,2}$/, {
    message: 'From time is not correct',
  })
  from?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/[0-9]{1,2}:[0-9]{1,2}$/, {
    message: 'To time is not correct',
  })
  to?: string;
}
