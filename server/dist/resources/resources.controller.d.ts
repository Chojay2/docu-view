import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    findByDataset(datasetId: string): Promise<{
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
    getDownloadUrl(id: string): Promise<{
        url: string;
        type: string;
    }>;
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
}
