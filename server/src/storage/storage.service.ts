import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT') || 'http://localhost:9000';
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID') || 'minioadmin';
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY') || 'minioadmin';
    const region = this.configService.get<string>('S3_REGION') || 'us-east-1';

    this.bucketName = this.configService.get<string>('S3_BUCKET') || 'zhiten-data';

    this.s3Client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Required for MinIO
    });
  }

  async uploadFile(file: Buffer, filename: string, contentType?: string): Promise<string> {
    const key = `${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return key;
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  calculateHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  async uploadCSV(file: Buffer, filename: string): Promise<{ key: string; hash: string; size: bigint }> {
    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.length > maxSize) {
      throw new BadRequestException('File size exceeds 100MB limit');
    }

    // Validate file extension
    if (!filename.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('Only CSV files are allowed');
    }

    const hash = this.calculateHash(file);
    const key = `datasets/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
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

  async parseCSV(file: Buffer, limit: number = 100): Promise<{ headers: string[]; rows: any[]; totalRows: number }> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      let headers: string[] = [];
      let rowCount = 0;

      const stream = Readable.from(file);
      
      stream
        .pipe(csv())
        .on('headers', (headerList: string[]) => {
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
          reject(new BadRequestException(`Failed to parse CSV: ${error.message}`));
        });
    });
  }

  async detectSchema(file: Buffer, sampleRows: number = 10): Promise<Array<{ name: string; type: string; description?: string; required: boolean }>> {
    const { headers, rows } = await this.parseCSV(file, sampleRows);
    
    const schema = headers.map((header) => {
      const values = rows.map((row) => row[header]).filter((v) => v !== undefined && v !== null && v !== '');
      
      let type = 'string';
      if (values.length > 0) {
        // Try to detect type
        const firstValue = values[0];
        
        // Check if it's a number
        if (!isNaN(Number(firstValue)) && firstValue !== '') {
          type = 'number';
        }
        // Check if it's a date
        else if (Date.parse(firstValue) && !isNaN(Date.parse(firstValue))) {
          type = 'date';
        }
        // Check if it's a boolean
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

  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    
    if (!response.Body) {
      throw new BadRequestException('File not found');
    }

    const chunks: Uint8Array[] = [];
    const stream = response.Body as Readable;
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }
}

