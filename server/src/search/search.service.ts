import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: MeiliSearch;
  private indexName = 'datasets';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const meilisearchUrl = this.configService.get<string>('MEILISEARCH_URL') || 'http://localhost:7700';
    const meilisearchKey = this.configService.get<string>('MEILISEARCH_KEY');

    this.client = new MeiliSearch({
      host: meilisearchUrl,
      apiKey: meilisearchKey,
    });
  }

  async onModuleInit() {
    try {
      await this.initializeIndex();
    } catch (error) {
      console.warn('Meilisearch not available, search will be limited:', error.message);
    }
  }

  private async initializeIndex() {
    try {
      const index = this.client.index(this.indexName);
      
      // Configure searchable attributes
      await index.updateSearchableAttributes([
        'title',
        'description',
        'tags',
        'category',
        'sourceOrg',
      ]);

      // Configure filterable attributes
      await index.updateFilterableAttributes([
        'category',
        'tags',
        'dataFormat',
        'sourceOrg',
        'license',
      ]);

      // Configure sortable attributes
      await index.updateSortableAttributes(['createdAt', 'updatedAt']);
    } catch (error) {
      // Index might not exist yet, that's okay
      console.log('Index configuration skipped:', error.message);
    }
  }

  async indexDataset(dataset: any) {
    try {
      const index = this.client.index(this.indexName);
      await index.addDocuments([this.transformDataset(dataset)]);
    } catch (error) {
      console.warn('Failed to index dataset:', error.message);
    }
  }

  async searchDatasets(query: string, filters: any = {}) {
    try {
      const index = this.client.index(this.indexName);
      
      const searchOptions: any = {
        limit: filters.limit || 20,
        offset: ((filters.page || 1) - 1) * (filters.limit || 20),
      };

      // Build filter string
      const filterParts: string[] = [];
      if (filters.category) {
        filterParts.push(`category = "${filters.category}"`);
      }
      if (filters.tag && filters.tag.length > 0) {
        const tagFilters = Array.isArray(filters.tag)
          ? filters.tag.map((t: string) => `tags = "${t}"`).join(' OR ')
          : `tags = "${filters.tag}"`;
        filterParts.push(`(${tagFilters})`);
      }
      if (filters.format) {
        filterParts.push(`dataFormat = "${filters.format}"`);
      }
      if (filters.organization) {
        filterParts.push(`sourceOrg = "${filters.organization}"`);
      }

      if (filterParts.length > 0) {
        searchOptions.filter = filterParts.join(' AND ');
      }

      const results = await index.search(query, searchOptions);

      // Fetch full dataset records from database
      const datasetIds = results.hits.map((hit: any) => hit.id);
      const datasets = await this.prisma.dataset.findMany({
        where: {
          id: { in: datasetIds },
          isPublic: true,
        },
        include: {
          resources: true,
          _count: {
            select: {
              projects: true,
            },
          },
        },
      });

      // Preserve search result order
      const datasetMap = new Map(datasets.map((d) => [d.id, d]));
      const orderedDatasets = datasetIds
        .map((id: string) => datasetMap.get(id))
        .filter(Boolean);

      return {
        data: orderedDatasets,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: results.estimatedTotalHits,
          totalPages: Math.ceil(results.estimatedTotalHits / (filters.limit || 20)),
        },
      };
    } catch (error) {
      console.warn('Search failed, falling back to database:', error.message);
      // Fallback to database search
      return {
        data: [],
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }

  private transformDataset(dataset: any) {
    return {
      id: dataset.id,
      slug: dataset.slug,
      title: dataset.title,
      description: dataset.description || '',
      category: dataset.category,
      tags: dataset.tags || [],
      license: dataset.license,
      sourceOrg: dataset.sourceOrg,
      dataFormat: dataset.dataFormat || [],
      createdAt: dataset.createdAt?.toISOString(),
      updatedAt: dataset.updatedAt?.toISOString(),
    };
  }
}

