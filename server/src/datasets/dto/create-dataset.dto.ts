import { IsString, IsOptional, IsArray, IsBoolean, IsEnum, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UpdateFrequency {
  ONCE = 'once',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  AD_HOC = 'ad-hoc',
}

export class CreateDatasetDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty()
  @IsString()
  license: string;

  @ApiProperty()
  @IsString()
  sourceOrg: string;

  @ApiProperty({ enum: UpdateFrequency })
  @IsEnum(UpdateFrequency)
  updateFrequency: UpdateFrequency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  spatialCoverage?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  temporalCoverageStart?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  temporalCoverageEnd?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  dataFormat: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

