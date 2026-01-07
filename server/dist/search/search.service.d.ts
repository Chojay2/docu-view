import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class SearchService implements OnModuleInit {
    private configService;
    private prisma;
    private client;
    private indexName;
    constructor(configService: ConfigService, prisma: PrismaService);
    onModuleInit(): Promise<void>;
    private initializeIndex;
    indexDataset(dataset: any): Promise<void>;
    searchDatasets(query: string, filters?: any): Promise<{
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
    private transformDataset;
}
