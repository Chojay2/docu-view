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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                skip,
                take: limit,
                include: {
                    datasets: {
                        include: {
                            dataset: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.project.count(),
        ]);
        return {
            data: projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
            include: {
                datasets: {
                    include: {
                        dataset: true,
                    },
                },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async create(createProjectDto, userId) {
        const { datasetsUsed, ...projectData } = createProjectDto;
        const project = await this.prisma.project.create({
            data: {
                ...projectData,
                authors: projectData.authors || [],
                tags: projectData.tags || [],
                createdBy: userId,
                status: 'APPROVED',
            },
            include: {
                datasets: true,
            },
        });
        if (datasetsUsed && datasetsUsed.length > 0) {
            await Promise.all(datasetsUsed.map((datasetId) => this.prisma.projectDataset.create({
                data: {
                    projectId: project.id,
                    datasetId,
                },
            })));
        }
        return this.findOne(project.id);
    }
    async update(id, updateData) {
        const { datasetsUsed, ...projectData } = updateData;
        await this.prisma.project.update({
            where: { id },
            data: projectData,
        });
        if (datasetsUsed !== undefined) {
            await this.prisma.projectDataset.deleteMany({
                where: { projectId: id },
            });
            if (datasetsUsed.length > 0) {
                await Promise.all(datasetsUsed.map((datasetId) => this.prisma.projectDataset.create({
                    data: {
                        projectId: id,
                        datasetId,
                    },
                })));
            }
        }
        return this.findOne(id);
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map