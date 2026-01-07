import { DatasetsService } from './datasets.service';
import { CreateDatasetDto } from './dto/create-dataset.dto';
import { QueryDatasetDto, QueryDatasetDataDto } from './dto/query-dataset.dto';
export declare class DatasetsController {
    private readonly datasetsService;
    constructor(datasetsService: DatasetsService);
    findAll(query: QueryDatasetDto): Promise<{
        data: ({
            resources: {
                createdAt: Date;
                updatedAt: Date;
                id: string;
                datasetId: string;
                resourceType: string;
                storageUrl: string | null;
                apiEndpoint: string | null;
                fileFormat: string | null;
                size: bigint | null;
                hash: string | null;
                version: string;
            }[];
            _count: {
                projects: number;
            };
        } & {
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
        })[];
        pagination: {
            page: any;
            limit: any;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        resources: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            datasetId: string;
            resourceType: string;
            storageUrl: string | null;
            apiEndpoint: string | null;
            fileFormat: string | null;
            size: bigint | null;
            hash: string | null;
            version: string;
        }[];
        projects: ({
            project: {
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
            };
        } & {
            createdAt: Date;
            id: string;
            datasetId: string;
            projectId: string;
        })[];
    } & {
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
    }>;
    findBySlug(slug: string): Promise<{
        resources: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            datasetId: string;
            resourceType: string;
            storageUrl: string | null;
            apiEndpoint: string | null;
            fileFormat: string | null;
            size: bigint | null;
            hash: string | null;
            version: string;
        }[];
        projects: ({
            project: {
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
            };
        } & {
            createdAt: Date;
            id: string;
            datasetId: string;
            projectId: string;
        })[];
    } & {
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
    }>;
    getResources(id: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        resourceType: string;
        storageUrl: string | null;
        apiEndpoint: string | null;
        fileFormat: string | null;
        size: bigint | null;
        hash: string | null;
        version: string;
    }[]>;
    getSample(id: string, limit?: number): Promise<{
        datasetId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        sample: any[];
        limit: number;
        headers?: undefined;
    } | {
        datasetId: string;
        schema: import("@prisma/client/runtime/library").JsonValue;
        sample: any[];
        headers: string[];
        limit: number;
    }>;
    queryData(id: string, query: QueryDatasetDataDto): Promise<{
        datasetId: string;
        data: any[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
            totalPages?: undefined;
        };
        headers?: undefined;
    } | {
        datasetId: string;
        data: any[];
        headers: string[];
        pagination: {
            limit: number;
            offset: number;
            total: number;
            totalPages: number;
        };
    }>;
    create(createDatasetDto: CreateDatasetDto, user: any): Promise<{
        resources: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            datasetId: string;
            resourceType: string;
            storageUrl: string | null;
            apiEndpoint: string | null;
            fileFormat: string | null;
            size: bigint | null;
            hash: string | null;
            version: string;
        }[];
    } & {
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
    }>;
    uploadDataset(body: any, file: Express.Multer.File, user: any): Promise<{
        resources: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            datasetId: string;
            resourceType: string;
            storageUrl: string | null;
            apiEndpoint: string | null;
            fileFormat: string | null;
            size: bigint | null;
            hash: string | null;
            version: string;
        }[];
    } & {
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
    }>;
    getPendingSubmissions(): Promise<({
        dataset: {
            resources: {
                createdAt: Date;
                updatedAt: Date;
                id: string;
                datasetId: string;
                resourceType: string;
                storageUrl: string | null;
                apiEndpoint: string | null;
                fileFormat: string | null;
                size: bigint | null;
                hash: string | null;
                version: string;
            }[];
            submitter: {
                id: string;
                name: string;
                email: string;
            };
        } & {
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
        id: string;
        submittedBy: string;
        status: import(".prisma/client").$Enums.SubmissionStatus;
        datasetId: string;
        adminNotes: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        reviewedBy: string | null;
    })[]>;
    approveSubmission(id: string, body: {
        adminNotes?: string;
    }, user: any): Promise<{
        resources: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            datasetId: string;
            resourceType: string;
            storageUrl: string | null;
            apiEndpoint: string | null;
            fileFormat: string | null;
            size: bigint | null;
            hash: string | null;
            version: string;
        }[];
    } & {
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
    }>;
    rejectSubmission(id: string, body: {
        adminNotes: string;
    }, user: any): Promise<{
        message: string;
    }>;
    update(id: string, updateDto: Partial<CreateDatasetDto>, user: any): Promise<{
        resources: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            datasetId: string;
            resourceType: string;
            storageUrl: string | null;
            apiEndpoint: string | null;
            fileFormat: string | null;
            size: bigint | null;
            hash: string | null;
            version: string;
        }[];
    } & {
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
    }>;
}
