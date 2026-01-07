import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private s3Client;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Buffer, filename: string, contentType?: string): Promise<string>;
    getPresignedUrl(key: string, expiresIn?: number): Promise<string>;
    calculateHash(buffer: Buffer): string;
    uploadCSV(file: Buffer, filename: string): Promise<{
        key: string;
        hash: string;
        size: bigint;
    }>;
    parseCSV(file: Buffer, limit?: number): Promise<{
        headers: string[];
        rows: any[];
        totalRows: number;
    }>;
    detectSchema(file: Buffer, sampleRows?: number): Promise<Array<{
        name: string;
        type: string;
        description?: string;
        required: boolean;
    }>>;
    getFile(key: string): Promise<Buffer>;
}
