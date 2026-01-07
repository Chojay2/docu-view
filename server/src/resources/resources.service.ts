import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async findByDatasetId(datasetId: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { id: datasetId },
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${datasetId} not found`);
    }

    return this.prisma.datasetResource.findMany({
      where: { datasetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(datasetId: string, resourceData: any) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { id: datasetId },
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${datasetId} not found`);
    }

    return this.prisma.datasetResource.create({
      data: {
        datasetId,
        ...resourceData,
      },
    });
  }

  async getDownloadUrl(resourceId: string) {
    const resource = await this.prisma.datasetResource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${resourceId} not found`);
    }

    if (resource.resourceType === 'api') {
      return { url: resource.apiEndpoint, type: 'api' };
    }

    if (resource.storageUrl) {
      const downloadUrl = await this.storageService.getPresignedUrl(resource.storageUrl);
      return { url: downloadUrl, type: 'file' };
    }

    throw new NotFoundException('Resource URL not found');
  }
}

