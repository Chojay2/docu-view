import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class SchemasService {
    private prisma;
    private storageService;
    constructor(prisma: PrismaService, storageService: StorageService);
    getSchema(datasetId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
    createOrUpdateSchema(datasetId: string, fields: Array<{
        name: string;
        type: string;
        description?: string;
        required: boolean;
    }>): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
    autoDetectSchema(datasetId: string, fileKey: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateSchema(datasetId: string, fields: Array<{
        name: string;
        type: string;
        description?: string;
        required: boolean;
    }>): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
