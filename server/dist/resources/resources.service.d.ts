import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class ResourcesService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    findByDatasetId(datasetId: string): Promise<{
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
    create(datasetId: string, resourceData: any): Promise<{
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
    }>;
    getDownloadUrl(resourceId: string): Promise<{
        url: string;
        type: string;
    }>;
}
