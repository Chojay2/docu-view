import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class SchemasService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async getSchema(datasetId: string) {
    const schema = await this.prisma.datasetSchema.findUnique({
      where: { datasetId },
    });

    if (!schema) {
      throw new NotFoundException(`Schema not found for dataset ${datasetId}`);
    }

    return schema;
  }

  async createOrUpdateSchema(
    datasetId: string,
    fields: Array<{ name: string; type: string; description?: string; required: boolean }>,
  ) {
    return this.prisma.datasetSchema.upsert({
      where: { datasetId },
      create: {
        datasetId,
        fields: fields as any,
      },
      update: {
        fields: fields as any,
      },
    });
  }

  async autoDetectSchema(datasetId: string, fileKey: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { resources: true },
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset ${datasetId} not found`);
    }

    const file = await this.storageService.getFile(fileKey);
    const schema = await this.storageService.detectSchema(file);

    return this.createOrUpdateSchema(datasetId, schema);
  }

  async updateSchema(
    datasetId: string,
    fields: Array<{ name: string; type: string; description?: string; required: boolean }>,
  ) {
    return this.createOrUpdateSchema(datasetId, fields);
  }
}

