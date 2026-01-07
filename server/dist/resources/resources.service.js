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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let ResourcesService = class ResourcesService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async findByDatasetId(datasetId) {
        const dataset = await this.prisma.dataset.findUnique({
            where: { id: datasetId },
        });
        if (!dataset) {
            throw new common_1.NotFoundException(`Dataset with ID ${datasetId} not found`);
        }
        return this.prisma.datasetResource.findMany({
            where: { datasetId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(datasetId, resourceData) {
        const dataset = await this.prisma.dataset.findUnique({
            where: { id: datasetId },
        });
        if (!dataset) {
            throw new common_1.NotFoundException(`Dataset with ID ${datasetId} not found`);
        }
        return this.prisma.datasetResource.create({
            data: {
                datasetId,
                ...resourceData,
            },
        });
    }
    async getDownloadUrl(resourceId) {
        const resource = await this.prisma.datasetResource.findUnique({
            where: { id: resourceId },
        });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with ID ${resourceId} not found`);
        }
        if (resource.resourceType === 'api') {
            return { url: resource.apiEndpoint, type: 'api' };
        }
        if (resource.storageUrl) {
            const downloadUrl = await this.storageService.getPresignedUrl(resource.storageUrl);
            return { url: downloadUrl, type: 'file' };
        }
        throw new common_1.NotFoundException('Resource URL not found');
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map