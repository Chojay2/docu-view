import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('dataset/:datasetId')
  @ApiOperation({ summary: 'Get resources for a dataset' })
  @ApiParam({ name: 'datasetId', description: 'Dataset ID' })
  @ApiResponse({ status: 200, description: 'List of resources' })
  findByDataset(@Param('datasetId') datasetId: string) {
    return this.resourcesService.findByDatasetId(datasetId);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get download URL for a resource' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Download URL' })
  getDownloadUrl(@Param('id') id: string) {
    return this.resourcesService.getDownloadUrl(id);
  }

  @Post('dataset/:datasetId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a resource for a dataset' })
  @ApiParam({ name: 'datasetId', description: 'Dataset ID' })
  @ApiResponse({ status: 201, description: 'Resource created' })
  create(@Param('datasetId') datasetId: string, @Body() resourceData: any) {
    return this.resourcesService.create(datasetId, resourceData);
  }
}

