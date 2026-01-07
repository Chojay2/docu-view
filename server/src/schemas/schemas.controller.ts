import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SchemasService } from './schemas.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('schemas')
@Controller('schemas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SchemasController {
  constructor(private readonly schemasService: SchemasService) {}

  @Get('dataset/:datasetId')
  @ApiOperation({ summary: 'Get schema for a dataset' })
  @ApiResponse({ status: 200, description: 'Schema details' })
  getSchema(@Param('datasetId') datasetId: string) {
    return this.schemasService.getSchema(datasetId);
  }

  @Post('dataset/:datasetId/auto-detect')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Auto-detect schema from CSV file (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schema auto-detected' })
  autoDetectSchema(
    @Param('datasetId') datasetId: string,
    @Body() body: { fileKey: string },
  ) {
    return this.schemasService.autoDetectSchema(datasetId, body.fileKey);
  }

  @Put('dataset/:datasetId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update schema manually (Admin only)' })
  @ApiResponse({ status: 200, description: 'Schema updated' })
  updateSchema(
    @Param('datasetId') datasetId: string,
    @Body() body: {
      fields: Array<{
        name: string;
        type: string;
        description?: string;
        required: boolean;
      }>;
    },
  ) {
    return this.schemasService.updateSchema(datasetId, body.fields);
  }
}

