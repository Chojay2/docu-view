import { SchemasService } from './schemas.service';
export declare class SchemasController {
    private readonly schemasService;
    constructor(schemasService: SchemasService);
    getSchema(datasetId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
    autoDetectSchema(datasetId: string, body: {
        fileKey: string;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateSchema(datasetId: string, body: {
        fields: Array<{
            name: string;
            type: string;
            description?: string;
            required: boolean;
        }>;
    }): Promise<{
        createdAt: Date;
        updatedAt: Date;
        id: string;
        datasetId: string;
        fields: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
