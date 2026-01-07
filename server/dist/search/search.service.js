"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const meilisearch_1 = require("meilisearch");
const prisma_service_1 = require("../prisma/prisma.service");
let SearchService = class SearchService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        this.indexName = 'datasets';
        const meilisearchUrl = this.configService.get('MEILISEARCH_URL') || 'http://localhost:7700';
        const meilisearchKey = this.configService.get('MEILISEARCH_KEY');
        this.client = new meilisearch_1.MeiliSearch({
            host: meilisearchUrl,
            apiKey: meilisearchKey,
        });
    }
    async onModuleInit() {
        try {
            await this.initializeIndex();
        }
        catch (error) {
            console.warn('Meilisearch not available, search will be limited:', error.message);
        }
    }
    async initializeIndex() {
        try {
            const index = this.client.index(this.indexName);
            await index.updateSearchableAttributes([
                'title',
                'description',
                'tags',
                'category',
                'sourceOrg',
            ]);
            await index.updateFilterableAttributes([
                'category',
                'tags',
                'dataFormat',
                'sourceOrg',
                'license',
            ]);
            await index.updateSortableAttributes(['createdAt', 'updatedAt']);
        }
        catch (error) {
            console.log('Index configuration skipped:', error.message);
        }
    }
    async indexDataset(dataset) {
        try {
            const index = this.client.index(this.indexName);
            await index.addDocuments([this.transformDataset(dataset)]);
        }
        catch (error) {
            console.warn('Failed to index dataset:', error.message);
        }
    }
    async searchDatasets(query, filters = {}) {
        try {
            const index = this.client.index(this.indexName);
            const searchOptions = {
                limit: filters.limit || 20,
                offset: ((filters.page || 1) - 1) * (filters.limit || 20),
            };
            const filterParts = [];
            if (filters.category) {
                filterParts.push(`category = "${filters.category}"`);
            }
            if (filters.tag && filters.tag.length > 0) {
                const tagFilters = Array.isArray(filters.tag)
                    ? filters.tag.map((t) => `tags = "${t}"`).join(' OR ')
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
            const datasetIds = results.hits.map((hit) => hit.id);
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
            const datasetMap = new Map(datasets.map((d) => [d.id, d]));
            const orderedDatasets = datasetIds
                .map((id) => datasetMap.get(id))
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
        }
        catch (error) {
            console.warn('Search failed, falling back to database:', error.message);
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
    transformDataset(dataset) {
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
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map