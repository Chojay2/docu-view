"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto = __importStar(require("crypto"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
let StorageService = class StorageService {
    constructor(configService) {
        this.configService = configService;
        const endpoint = this.configService.get('S3_ENDPOINT') || 'http://localhost:9000';
        const accessKeyId = this.configService.get('S3_ACCESS_KEY_ID') || 'minioadmin';
        const secretAccessKey = this.configService.get('S3_SECRET_ACCESS_KEY') || 'minioadmin';
        const region = this.configService.get('S3_REGION') || 'us-east-1';
        this.bucketName = this.configService.get('S3_BUCKET') || 'zhiten-data';
        this.s3Client = new client_s3_1.S3Client({
            endpoint,
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            forcePathStyle: true,
        });
    }
    async uploadFile(file, filename, contentType) {
        const key = `${Date.now()}-${filename}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: contentType,
        });
        await this.s3Client.send(command);
        return key;
    }
    async getPresignedUrl(key, expiresIn = 3600) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        return (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
    }
    calculateHash(buffer) {
        return crypto.createHash('sha256').update(buffer).digest('hex');
    }
    async uploadCSV(file, filename) {
        const maxSize = 100 * 1024 * 1024;
        if (file.length > maxSize) {
            throw new common_1.BadRequestException('File size exceeds 100MB limit');
        }
        if (!filename.toLowerCase().endsWith('.csv')) {
            throw new common_1.BadRequestException('Only CSV files are allowed');
        }
        const hash = this.calculateHash(file);
        const key = `datasets/${Date.now()}-${filename}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file,
            ContentType: 'text/csv',
        });
        await this.s3Client.send(command);
        return {
            key,
            hash: `sha256:${hash}`,
            size: BigInt(file.length),
        };
    }
    async parseCSV(file, limit = 100) {
        return new Promise((resolve, reject) => {
            const results = [];
            let headers = [];
            let rowCount = 0;
            const stream = stream_1.Readable.from(file);
            stream
                .pipe((0, csv_parser_1.default)())
                .on('headers', (headerList) => {
                headers = headerList;
            })
                .on('data', (data) => {
                rowCount++;
                if (results.length < limit) {
                    results.push(data);
                }
            })
                .on('end', () => {
                resolve({
                    headers,
                    rows: results,
                    totalRows: rowCount,
                });
            })
                .on('error', (error) => {
                reject(new common_1.BadRequestException(`Failed to parse CSV: ${error.message}`));
            });
        });
    }
    async detectSchema(file, sampleRows = 10) {
        const { headers, rows } = await this.parseCSV(file, sampleRows);
        const schema = headers.map((header) => {
            const values = rows.map((row) => row[header]).filter((v) => v !== undefined && v !== null && v !== '');
            let type = 'string';
            if (values.length > 0) {
                const firstValue = values[0];
                if (!isNaN(Number(firstValue)) && firstValue !== '') {
                    type = 'number';
                }
                else if (Date.parse(firstValue) && !isNaN(Date.parse(firstValue))) {
                    type = 'date';
                }
                else if (['true', 'false', 'yes', 'no', '1', '0'].includes(firstValue.toLowerCase())) {
                    type = 'boolean';
                }
            }
            return {
                name: header,
                type,
                description: '',
                required: values.length === rows.length,
            };
        });
        return schema;
    }
    async getFile(key) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });
        const response = await this.s3Client.send(command);
        if (!response.Body) {
            throw new common_1.BadRequestException('File not found');
        }
        const chunks = [];
        const stream = response.Body;
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map