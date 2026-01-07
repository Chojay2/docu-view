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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatasetsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const datasets_service_1 = require("./datasets.service");
const create_dataset_dto_1 = require("./dto/create-dataset.dto");
const query_dataset_dto_1 = require("./dto/query-dataset.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
let DatasetsController = class DatasetsController {
    constructor(datasetsService) {
        this.datasetsService = datasetsService;
    }
    findAll(query) {
        return this.datasetsService.findAll(query);
    }
    findOne(id) {
        return this.datasetsService.findOne(id);
    }
    findBySlug(slug) {
        return this.datasetsService.findBySlug(slug);
    }
    async getResources(id) {
        const dataset = await this.datasetsService.findOne(id);
        return dataset.resources;
    }
    getSample(id, limit) {
        return this.datasetsService.getSample(id, limit ? parseInt(limit.toString()) : 50);
    }
    queryData(id, query) {
        return this.datasetsService.queryData(id, query);
    }
    create(createDatasetDto, user) {
        const isAdmin = user.role === client_1.UserRole.ADMIN;
        return this.datasetsService.create(createDatasetDto, user.userId, isAdmin);
    }
    async uploadDataset(body, file, user) {
        if (!file) {
            throw new Error('CSV file is required');
        }
        const createDatasetDto = {
            title: body.title,
            description: body.description,
            category: body.category,
            tags: typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags,
            license: body.license || 'CC-BY-4.0',
            sourceOrg: body.sourceOrg,
            updateFrequency: body.updateFrequency || 'monthly',
            dataFormat: typeof body.dataFormat === 'string' ? JSON.parse(body.dataFormat) : body.dataFormat || ['CSV'],
        };
        return this.datasetsService.createSubmission(createDatasetDto, user.userId, {
            buffer: file.buffer,
            filename: file.originalname,
        });
    }
    getPendingSubmissions() {
        return this.datasetsService.getPendingSubmissions();
    }
    approveSubmission(id, body, user) {
        return this.datasetsService.approveSubmission(id, user.userId, body.adminNotes);
    }
    rejectSubmission(id, body, user) {
        return this.datasetsService.rejectSubmission(id, user.userId, body.adminNotes);
    }
    update(id, updateDto, user) {
        return this.datasetsService.update(id, updateDto);
    }
};
exports.DatasetsController = DatasetsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all datasets' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of datasets' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_dataset_dto_1.QueryDatasetDto]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dataset by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dataset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dataset details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dataset not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dataset by slug' }),
    (0, swagger_1.ApiParam)({ name: 'slug', description: 'Dataset slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dataset details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dataset not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id/resources'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dataset resources' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dataset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of resources' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatasetsController.prototype, "getResources", null);
__decorate([
    (0, common_1.Get)(':id/sample'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dataset sample data' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dataset ID' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sample data' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "getSample", null);
__decorate([
    (0, common_1.Get)(':id/query'),
    (0, swagger_1.ApiOperation)({ summary: 'Query dataset data' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dataset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Query results' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_dataset_dto_1.QueryDatasetDataDto]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "queryData", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new dataset' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dataset created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dataset_dto_1.CreateDatasetDto, Object]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Upload dataset with CSV file' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dataset submitted for approval' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DatasetsController.prototype, "uploadDataset", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending dataset submissions (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of pending submissions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "getPendingSubmissions", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Approve dataset submission (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dataset approved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "approveSubmission", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reject dataset submission (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dataset rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "rejectSubmission", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a dataset' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Dataset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dataset updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], DatasetsController.prototype, "update", null);
exports.DatasetsController = DatasetsController = __decorate([
    (0, swagger_1.ApiTags)('datasets'),
    (0, common_1.Controller)('datasets'),
    __metadata("design:paramtypes", [datasets_service_1.DatasetsService])
], DatasetsController);
//# sourceMappingURL=datasets.controller.js.map