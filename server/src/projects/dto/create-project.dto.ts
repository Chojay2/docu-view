import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LinkType {
  GITHUB = 'github',
  PAPER = 'paper',
  WEBSITE = 'website',
  VIDEO = 'video',
  DEMO = 'demo',
}

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  abstract?: string;

  @ApiProperty({ enum: LinkType })
  linkType: LinkType;

  @ApiProperty()
  @IsUrl()
  linkUrl: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authors?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  datasetsUsed?: string[];
}

