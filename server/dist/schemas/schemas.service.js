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
exports.SchemasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../storage/storage.service");
let SchemasService = class SchemasService {
    constructor(prisma, storageService) {
        this.prisma = prisma;
        this.storageService = storageService;
    }
    async getSchema(datasetId) {
        const schema = await this.prisma.datasetSchema.findUnique({
            where: { datasetId },
        });
        if (!schema) {
            throw new common_1.NotFoundException(`Schema not found for dataset ${datasetId}`);
        }
        return schema;
    }
    async createOrUpdateSchema(datasetId, fields) {
        return this.prisma.datasetSchema.upsert({
            where: { datasetId },
            create: {
                datasetId,
                fields: fields,
            },
            update: {
                fields: fields,
            },
        });
    }
    async autoDetectSchema(datasetId, fileKey) {
        const dataset = await this.prisma.dataset.findUnique({
            where: { id: datasetId },
            include: { resources: true },
        });
        if (!dataset) {
            throw new common_1.NotFoundException(`Dataset ${datasetId} not found`);
        }
        const file = await this.storageService.getFile(fileKey);
        const schema = await this.storageService.detectSchema(file);
        return this.createOrUpdateSchema(datasetId, schema);
    }
    async updateSchema(datasetId, fields) {
        return this.createOrUpdateSchema(datasetId, fields);
    }
};
exports.SchemasService = SchemasService;
exports.SchemasService = SchemasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService])
], SchemasService);
//# sourceMappingURL=schemas.service.js.map