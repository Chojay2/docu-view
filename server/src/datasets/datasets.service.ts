import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { QueryDatasetDto, QueryDatasetDataDto } from './dto/query-dataset.dto';
import { SearchService } from '../search/search.service';
import { StorageService } from '../storage/storage.service';
import { DatasetStatus, SubmissionStatus } from '@prisma/client';

@Injectable()
export class DatasetsService {
  constructor(
    private prisma: PrismaService,
    private searchService: SearchService,
    private storageService: StorageService,
  ) {}

  async findAll(query: QueryDatasetDto) {
    const { q, category, tag, format, organization, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // If search query exists, use search service
    if (q) {
      return this.searchService.searchDatasets(q, {
        category,
        tag,
        format,
        organization,
        page,
        limit,
      });
    }

    // Otherwise, use Prisma filters
    const where: any = {
      isPublic: true,
      status: DatasetStatus.APPROVED,
    };

    if (category) {
      where.category = category;
    }

    if (tag && tag.length > 0) {
      where.tags = {
        hasSome: Array.isArray(tag) ? tag : [tag],
      };
    }

    if (format) {
      where.dataFormat = {
        has: format,
      };
    }

    if (organization) {
      where.sourceOrg = organization;
    }

    const [datasets, total] = await Promise.all([
      this.prisma.dataset.findMany({
        where,
        skip,
        take: limit,
        include: {
          resources: true,
          _count: {
            select: {
              projects: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.dataset.count({ where }),
    ]);

    return {
      data: datasets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { id },
      include: {
        resources: true,
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset with ID ${id} not found`);
    }

    return dataset;
  }

  async findBySlug(slug: string) {
    const dataset = await this.prisma.dataset.findUnique({
      where: { slug },
      include: {
        resources: true,
        projects: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!dataset) {
      throw new NotFoundException(`Dataset with slug ${slug} not found`);
    }

    return dataset;
  }

  async getSample(id: string, limit: number = 50) {
    const dataset = await this.findOne(id);
    
    // Find CSV resource
    const csvResource = dataset.resources.find(
      (r) => r.fileFormat === 'CSV' && r.storageUrl,
    );

    if (!csvResource || !csvResource.storageUrl) {
      return {
        datasetId: id,
        schema: dataset.previewSchema,
        sample: [],
        limit,
      };
    }

    try {
      const file = await this.storageService.getFile(csvResource.storageUrl);
      const { headers, rows } = await this.storageService.parseCSV(file, limit);

      return {
        datasetId: id,
        schema: dataset.previewSchema,
        sample: rows,
        headers,
        limit,
      };
    } catch (error) {
      return {
        datasetId: id,
        schema: dataset.previewSchema,
        sample: [],
        limit,
      };
    }
  }

  async queryData(id: string, query: QueryDatasetDataDto) {
    const dataset = await this.findOne(id);
    const { limit = 50, offset = 0, filter, sort } = query;

    // Find CSV resource
    const csvResource = dataset.resources.find(
      (r) => r.fileFormat === 'CSV' && r.storageUrl,
    );

    if (!csvResource || !csvResource.storageUrl) {
      return {
        datasetId: id,
        data: [],
        pagination: {
          limit,
          offset,
          total: 0,
        },
      };
    }

    try {
      const file = await this.storageService.getFile(csvResource.storageUrl);
      const { headers, rows: allRows, totalRows } = await this.storageService.parseCSV(file, 10000); // Load up to 10k rows

      // Apply filters if provided
      let filteredRows = allRows;
      if (filter) {
        try {
          const filterObj = typeof filter === 'string' ? JSON.parse(filter) : filter;
          filteredRows = allRows.filter((row) => {
            return Object.entries(filterObj).every(([key, value]) => {
              const rowValue = row[key];
              if (value === null || value === undefined) return true;
              if (typeof value === 'string') {
                return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
              }
              return rowValue == value;
            });
          });
        } catch (e) {
          // Invalid filter, ignore
        }
      }

      // Apply sorting if provided
      if (sort) {
        try {
          const sortObj = typeof sort === 'string' ? JSON.parse(sort) : sort;
          const [field, direction] = Object.entries(sortObj)[0] || [];
          if (field) {
            filteredRows.sort((a, b) => {
              const aVal = a[field];
              const bVal = b[field];
              const multiplier = direction === 'desc' ? -1 : 1;
              
              if (typeof aVal === 'number' && typeof bVal === 'number') {
                return (aVal - bVal) * multiplier;
              }
              return String(aVal).localeCompare(String(bVal)) * multiplier;
            });
          }
        } catch (e) {
          // Invalid sort, ignore
        }
      }

      // Apply pagination
      const paginatedRows = filteredRows.slice(offset, offset + limit);

      return {
        datasetId: id,
        data: paginatedRows,
        headers,
        pagination: {
          limit,
          offset,
          total: filteredRows.length,
          totalPages: Math.ceil(filteredRows.length / limit),
        },
      };
    } catch (error) {
      return {
        datasetId: id,
        data: [],
        pagination: {
          limit,
          offset,
          total: 0,
        },
      };
    }
  }

  async create(createDatasetDto: CreateDatasetDto, userId: string, isAdmin: boolean = false) {
    // Generate slug from title
    const slug = createDatasetDto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const status = isAdmin ? DatasetStatus.APPROVED : DatasetStatus.PENDING;
    const isPublic = isAdmin;

    const dataset = await this.prisma.dataset.create({
      data: {
        ...createDatasetDto,
        slug,
        tags: createDatasetDto.tags || [],
        dataFormat: createDatasetDto.dataFormat || [],
        status,
        isPublic,
        submittedBy: userId,
      },
      include: {
        resources: true,
      },
    });

    // Create submission record if not admin
    if (!isAdmin) {
      await this.prisma.datasetSubmission.create({
        data: {
          datasetId: dataset.id,
          submittedBy: userId,
          status: SubmissionStatus.PENDING,
        },
      });
    } else {
      // Index in search if approved
      await this.searchService.indexDataset(dataset);
    }

    return dataset;
  }

  async createSubmission(
    createDatasetDto: CreateDatasetDto,
    userId: string,
    file?: { buffer: Buffer; filename: string },
  ) {
    const dataset = await this.create(createDatasetDto, userId, false);

    // Upload file if provided
    if (file) {
      const { key, hash, size } = await this.storageService.uploadCSV(
        file.buffer,
        file.filename,
      );

      await this.prisma.datasetResource.create({
        data: {
          datasetId: dataset.id,
          resourceType: 'file',
          storageUrl: key,
          fileFormat: 'CSV',
          size,
          hash,
          version: '1.0.0',
        },
      });
    }

    return dataset;
  }

  async getPendingSubmissions() {
    return this.prisma.datasetSubmission.findMany({
      where: {
        status: SubmissionStatus.PENDING,
      },
      include: {
        dataset: {
          include: {
            resources: true,
            submitter: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async approveSubmission(datasetId: string, adminId: string, adminNotes?: string) {
    const submission = await this.prisma.datasetSubmission.findFirst({
      where: {
        datasetId,
        status: SubmissionStatus.PENDING,
      },
    });

    if (!submission) {
      throw new NotFoundException('Pending submission not found');
    }

    // Update dataset status
    const dataset = await this.prisma.dataset.update({
      where: { id: datasetId },
      data: {
        status: DatasetStatus.APPROVED,
        isPublic: true,
      },
      include: {
        resources: true,
      },
    });

    // Update submission
    await this.prisma.datasetSubmission.update({
      where: { id: submission.id },
      data: {
        status: SubmissionStatus.APPROVED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminNotes,
      },
    });

    // Index in search
    await this.searchService.indexDataset(dataset);

    return dataset;
  }

  async rejectSubmission(datasetId: string, adminId: string, adminNotes: string) {
    const submission = await this.prisma.datasetSubmission.findFirst({
      where: {
        datasetId,
        status: SubmissionStatus.PENDING,
      },
    });

    if (!submission) {
      throw new NotFoundException('Pending submission not found');
    }

    // Update dataset status
    await this.prisma.dataset.update({
      where: { id: datasetId },
      data: {
        status: DatasetStatus.REJECTED,
        isPublic: false,
      },
    });

    // Update submission
    await this.prisma.datasetSubmission.update({
      where: { id: submission.id },
      data: {
        status: SubmissionStatus.REJECTED,
        reviewedBy: adminId,
        reviewedAt: new Date(),
        adminNotes,
      },
    });

    return { message: 'Submission rejected' };
  }

  async update(id: string, updateData: Partial<CreateDatasetDto>) {
    const dataset = await this.prisma.dataset.update({
      where: { id },
      data: updateData,
      include: {
        resources: true,
      },
    });

    // Re-index in search
    await this.searchService.indexDataset(dataset);

    return dataset;
  }
}

