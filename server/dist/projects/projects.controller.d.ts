import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(page?: number, limit?: number): Promise<{
        data: ({
            datasets: ({
                dataset: {
                    title: string;
                    description: string | null;
                    category: string;
                    tags: string[];
                    license: string;
                    sourceOrg: string;
                    updateFrequency: string;
                    spatialCoverage: import("@prisma/client/runtime/library").JsonValue | null;
                    temporalCoverageStart: Date | null;
                    temporalCoverageEnd: Date | null;
                    dataFormat: string[];
                    isPublic: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    id: string;
                    slug: string;
                    ownerUserId: string | null;
                    submittedBy: string | null;
                    status: import(".prisma/client").$Enums.DatasetStatus;
                    previewSchema: import("@prisma/client/runtime/library").JsonValue | null;
                };
            } & {
                createdAt: Date;
                id: string;
                datasetId: string;
                projectId: string;
            })[];
        } & {
            title: string;
            tags: string[];
            createdAt: Date;
            updatedAt: Date;
            id: string;
            status: import(".prisma/client").$Enums.DatasetStatus;
            abstract: string | null;
            linkType: string;
            linkUrl: string;
            authors: string[];
            createdBy: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        datasets: ({
            dataset: {
                title: string;
                description: string | null;
                category: string;
                tags: string[];
                license: string;
                sourceOrg: string;
                updateFrequency: string;
                spatialCoverage: import("@prisma/client/runtime/library").JsonValue | null;
                temporalCoverageStart: Date | null;
                temporalCoverageEnd: Date | null;
                dataFormat: string[];
                isPublic: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                slug: string;
                ownerUserId: string | null;
                submittedBy: string | null;
                status: import(".prisma/client").$Enums.DatasetStatus;
                previewSchema: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            createdAt: Date;
            id: string;
            datasetId: string;
            projectId: string;
        })[];
    } & {
        title: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        id: string;
        status: import(".prisma/client").$Enums.DatasetStatus;
        abstract: string | null;
        linkType: string;
        linkUrl: string;
        authors: string[];
        createdBy: string | null;
    }>;
    create(createProjectDto: CreateProjectDto, user: any): Promise<{
        datasets: ({
            dataset: {
                title: string;
                description: string | null;
                category: string;
                tags: string[];
                license: string;
                sourceOrg: string;
                updateFrequency: string;
                spatialCoverage: import("@prisma/client/runtime/library").JsonValue | null;
                temporalCoverageStart: Date | null;
                temporalCoverageEnd: Date | null;
                dataFormat: string[];
                isPublic: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                slug: string;
                ownerUserId: string | null;
                submittedBy: string | null;
                status: import(".prisma/client").$Enums.DatasetStatus;
                previewSchema: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            createdAt: Date;
            id: string;
            datasetId: string;
            projectId: string;
        })[];
    } & {
        title: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        id: string;
        status: import(".prisma/client").$Enums.DatasetStatus;
        abstract: string | null;
        linkType: string;
        linkUrl: string;
        authors: string[];
        createdBy: string | null;
    }>;
    update(id: string, updateDto: Partial<CreateProjectDto>, user: any): Promise<{
        datasets: ({
            dataset: {
                title: string;
                description: string | null;
                category: string;
                tags: string[];
                license: string;
                sourceOrg: string;
                updateFrequency: string;
                spatialCoverage: import("@prisma/client/runtime/library").JsonValue | null;
                temporalCoverageStart: Date | null;
                temporalCoverageEnd: Date | null;
                dataFormat: string[];
                isPublic: boolean;
                createdAt: Date;
                updatedAt: Date;
                id: string;
                slug: string;
                ownerUserId: string | null;
                submittedBy: string | null;
                status: import(".prisma/client").$Enums.DatasetStatus;
                previewSchema: import("@prisma/client/runtime/library").JsonValue | null;
            };
        } & {
            createdAt: Date;
            id: string;
            datasetId: string;
            projectId: string;
        })[];
    } & {
        title: string;
        tags: string[];
        createdAt: Date;
        updatedAt: Date;
        id: string;
        status: import(".prisma/client").$Enums.DatasetStatus;
        abstract: string | null;
        linkType: string;
        linkUrl: string;
        authors: string[];
        createdBy: string | null;
    }>;
}
