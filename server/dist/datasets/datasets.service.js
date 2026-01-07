"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const search_service_1 = require("../search/search.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let DatasetsService = class DatasetsService {
    constructor(prisma, searchService, storageService) {
        this.prisma = prisma;
        this.searchService = searchService;
        this.storageService = storageService;
    }
    async findAll(query) {
        const { q, category, tag, format, organization, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
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
        const where = {
            isPublic: true,
            status: client_1.DatasetStatus.APPROVED,
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
    async findOne(id) {
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
            throw new common_1.NotFoundException(`Dataset with ID ${id} not found`);
        }
        return dataset;
    }
    async findBySlug(slug) {
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
            throw new common_1.NotFoundException(`Dataset with slug ${slug} not found`);
        }
        return dataset;
    }
    async getSample(id, limit = 50) {
        const dataset = await this.findOne(id);
        const csvResource = dataset.resources.find((r) => r.fileFormat === 'CSV' && r.storageUrl);
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
        }
        catch (error) {
            return {
                datasetId: id,
                schema: dataset.previewSchema,
                sample: [],
                limit,
            };
        }
    }
    async queryData(id, query) {
        const dataset = await this.findOne(id);
        const { limit = 50, offset = 0, filter, sort } = query;
        const csvResource = dataset.resources.find((r) => r.fileFormat === 'CSV' && r.storageUrl);
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
            const { headers, rows: allRows, totalRows } = await this.storageService.parseCSV(file, 10000);
            let filteredRows = allRows;
            if (filter) {
                try {
                    const filterObj = typeof filter === 'string' ? JSON.parse(filter) : filter;
                    filteredRows = allRows.filter((row) => {
                        return Object.entries(filterObj).every(([key, value]) => {
                            const rowValue = row[key];
                            if (value === null || value === undefined)
                                return true;
                            if (typeof value === 'string') {
                                return String(rowValue).toLowerCase().includes(String(value).toLowerCase());
                            }
                            return rowValue == value;
                        });
                    });
                }
                catch (e) {
                }
            }
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
                }
                catch (e) {
                }
            }
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
        }
        catch (error) {
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
    async create(createDatasetDto, userId, isAdmin = false) {
        const slug = createDatasetDto.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const status = isAdmin ? client_1.DatasetStatus.APPROVED : client_1.DatasetStatus.PENDING;
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
        if (!isAdmin) {
            await this.prisma.datasetSubmission.create({
                data: {
                    datasetId: dataset.id,
                    submittedBy: userId,
                    status: client_1.SubmissionStatus.PENDING,
                },
            });
        }
        else {
            await this.searchService.indexDataset(dataset);
        }
        return dataset;
    }
    async createSubmission(createDatasetDto, userId, file) {
        const dataset = await this.create(createDatasetDto, userId, false);
        if (file) {
            const { key, hash, size } = await this.storageService.uploadCSV(file.buffer, file.filename);
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
                status: client_1.SubmissionStatus.PENDING,
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
    async approveSubmission(datasetId, adminId, adminNotes) {
        const submission = await this.prisma.datasetSubmission.findFirst({
            where: {
                datasetId,
                status: client_1.SubmissionStatus.PENDING,
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Pending submission not found');
        }
        const dataset = await this.prisma.dataset.update({
            where: { id: datasetId },
            data: {
                status: client_1.DatasetStatus.APPROVED,
                isPublic: true,
            },
            include: {
                resources: true,
            },
        });
        await this.prisma.datasetSubmission.update({
            where: { id: submission.id },
            data: {
                status: client_1.SubmissionStatus.APPROVED,
                reviewedBy: adminId,
                reviewedAt: new Date(),
                adminNotes,
            },
        });
        await this.searchService.indexDataset(dataset);
        return dataset;
    }
    async rejectSubmission(datasetId, adminId, adminNotes) {
        const submission = await this.prisma.datasetSubmission.findFirst({
            where: {
                datasetId,
                status: client_1.SubmissionStatus.PENDING,
            },
        });
        if (!submission) {
            throw new common_1.NotFoundException('Pending submission not found');
        }
        await this.prisma.dataset.update({
            where: { id: datasetId },
            data: {
                status: client_1.DatasetStatus.REJECTED,
                isPublic: false,
            },
        });
        await this.prisma.datasetSubmission.update({
            where: { id: submission.id },
            data: {
                status: client_1.SubmissionStatus.REJECTED,
                reviewedBy: adminId,
                reviewedAt: new Date(),
                adminNotes,
            },
        });
        return { message: 'Submission rejected' };
    }
    async update(id, updateData) {
        const dataset = await this.prisma.dataset.update({
            where: { id },
            data: updateData,
            include: {
                resources: true,
            },
        });
        await this.searchService.indexDataset(dataset);
        return dataset;
    }
};
exports.DatasetsService = DatasetsService;
exports.DatasetsService = DatasetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        search_service_1.SearchService,
        storage_service_1.StorageService])
], DatasetsService);
//# sourceMappingURL=datasets.service.js.map