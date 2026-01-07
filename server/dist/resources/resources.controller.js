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
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const resources_service_1 = require("./resources.service");
let ResourcesController = class ResourcesController {
    constructor(resourcesService) {
        this.resourcesService = resourcesService;
    }
    findByDataset(datasetId) {
        return this.resourcesService.findByDatasetId(datasetId);
    }
    getDownloadUrl(id) {
        return this.resourcesService.getDownloadUrl(id);
    }
    create(datasetId, resourceData) {
        return this.resourcesService.create(datasetId, resourceData);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Get)('dataset/:datasetId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get resources for a dataset' }),
    (0, swagger_1.ApiParam)({ name: 'datasetId', description: 'Dataset ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of resources' }),
    __param(0, (0, common_1.Param)('datasetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "findByDataset", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Get download URL for a resource' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Resource ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Download URL' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "getDownloadUrl", null);
__decorate([
    (0, common_1.Post)('dataset/:datasetId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a resource for a dataset' }),
    (0, swagger_1.ApiParam)({ name: 'datasetId', description: 'Dataset ID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Resource created' }),
    __param(0, (0, common_1.Param)('datasetId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "create", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, swagger_1.ApiTags)('resources'),
    (0, common_1.Controller)('resources'),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map