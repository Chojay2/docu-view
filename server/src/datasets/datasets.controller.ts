import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { DatasetsService } from './datasets.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { QueryDatasetDto, QueryDatasetDataDto } from './dto/query-dataset.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('datasets')
@Controller('datasets')
export class DatasetsController {
  constructor(private readonly datasetsService: DatasetsService) {}

  @Get()
  @ApiOperation({ summary: 'List all datasets' })
  @ApiResponse({ status: 200, description: 'List of datasets' })
  findAll(@Query() query: QueryDatasetDto) {
    return this.datasetsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dataset by ID' })
  @ApiParam({ name: 'id', description: 'Dataset ID' })
  @ApiResponse({ status: 200, description: 'Dataset details' })
  @ApiResponse({ status: 404, description: 'Dataset not found' })
  findOne(@Param('id') id: string) {
    return this.datasetsService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get dataset by slug' })
  @ApiParam({ name: 'slug', description: 'Dataset slug' })
  @ApiResponse({ status: 200, description: 'Dataset details' })
  @ApiResponse({ status: 404, description: 'Dataset not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.datasetsService.findBySlug(slug);
  }

  @Get(':id/resources')
  @ApiOperation({ summary: 'Get dataset resources' })
  @ApiParam({ name: 'id', description: 'Dataset ID' })
  @ApiResponse({ status: 200, description: 'List of resources' })
  async getResources(@Param('id') id: string) {
    const dataset = await this.datasetsService.findOne(id);
    return dataset.resources;
  }

  @Get(':id/sample')
  @ApiOperation({ summary: 'Get dataset sample data' })
  @ApiParam({ name: 'id', description: 'Dataset ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Sample data' })
  getSample(@Param('id') id: string, @Query('limit') limit?: number) {
    return this.datasetsService.getSample(id, limit ? parseInt(limit.toString()) : 50);
  }

  @Get(':id/query')
  @ApiOperation({ summary: 'Query dataset data' })
  @ApiParam({ name: 'id', description: 'Dataset ID' })
  @ApiResponse({ status: 200, description: 'Query results' })
  queryData(@Param('id') id: string, @Query() query: QueryDatasetDataDto) {
    return this.datasetsService.queryData(id, query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new dataset' })
  @ApiResponse({ status: 201, description: 'Dataset created' })
  create(
    @Body() createDatasetDto: CreateDatasetDto,
    @CurrentUser() user: any,
  ) {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.datasetsService.create(createDatasetDto, user.userId, isAdmin);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload dataset with CSV file' })
  @ApiResponse({ status: 201, description: 'Dataset submitted for approval' })
  async uploadDataset(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) {
      throw new Error('CSV file is required');
    }

    // Parse FormData fields
    const createDatasetDto: CreateDatasetDto = {
      title: body.title,
      description: body.description,
      category: body.category,
      tags: typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags,
      license: body.license || 'CC-BY-4.0',
      sourceOrg: body.sourceOrg,
      updateFrequency: body.updateFrequency || 'monthly',
      dataFormat: typeof body.dataFormat === 'string' ? JSON.parse(body.dataFormat) : body.dataFormat || ['CSV'],
    };

    return this.datasetsService.createSubmission(
      createDatasetDto,
      user.userId,
      {
        buffer: file.buffer,
        filename: file.originalname,
      },
    );
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending dataset submissions (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of pending submissions' })
  getPendingSubmissions() {
    return this.datasetsService.getPendingSubmissions();
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve dataset submission (Admin only)' })
  @ApiResponse({ status: 200, description: 'Dataset approved' })
  approveSubmission(
    @Param('id') id: string,
    @Body() body: { adminNotes?: string },
    @CurrentUser() user: any,
  ) {
    return this.datasetsService.approveSubmission(id, user.userId, body.adminNotes);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject dataset submission (Admin only)' })
  @ApiResponse({ status: 200, description: 'Dataset rejected' })
  rejectSubmission(
    @Param('id') id: string,
    @Body() body: { adminNotes: string },
    @CurrentUser() user: any,
  ) {
    return this.datasetsService.rejectSubmission(id, user.userId, body.adminNotes);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a dataset' })
  @ApiParam({ name: 'id', description: 'Dataset ID' })
  @ApiResponse({ status: 200, description: 'Dataset updated' })
  update(
    @Param('id') id: string,
    @Body() updateDto: Partial<CreateDatasetDto>,
    @CurrentUser() user: any,
  ) {
    // Check if user owns the dataset or is admin
    return this.datasetsService.update(id, updateDto);
  }
}

