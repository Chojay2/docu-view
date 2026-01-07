const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Dataset {
  id: string;
  slug: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  license: string;
  sourceOrg: string;
  updateFrequency: string;
  spatialCoverage?: any;
  temporalCoverageStart?: string;
  temporalCoverageEnd?: string;
  dataFormat: string[];
  previewSchema?: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  resources?: DatasetResource[];
  projects?: any[];
  _count?: {
    projects: number;
  };
}

export interface DatasetResource {
  id: string;
  datasetId: string;
  resourceType: string;
  storageUrl?: string;
  apiEndpoint?: string;
  fileFormat?: string;
  size?: number;
  hash?: string;
  version: string;
}

export interface Project {
  id: string;
  title: string;
  abstract?: string;
  linkType: string;
  linkUrl: string;
  authors: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  datasets?: Array<{
    dataset: Dataset;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      ...options.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    // Only set Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API error: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Use default error message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ access_token: string; user: any }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { name?: string; email: string; password: string }): Promise<{ access_token: string; user: any }> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me');
  }

  // Dataset upload
  async uploadDataset(formData: FormData): Promise<Dataset> {
    return this.request('/datasets/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // Admin methods
  async getPendingDatasets(): Promise<any[]> {
    return this.request('/datasets/pending');
  }

  async approveDataset(id: string, adminNotes?: string): Promise<Dataset> {
    return this.request(`/datasets/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    });
  }

  async rejectDataset(id: string, adminNotes: string): Promise<any> {
    return this.request(`/datasets/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    });
  }

  // Schema methods
  async getSchema(datasetId: string): Promise<any> {
    return this.request(`/schemas/dataset/${datasetId}`);
  }

  async autoDetectSchema(datasetId: string, fileKey: string): Promise<any> {
    return this.request(`/schemas/dataset/${datasetId}/auto-detect`, {
      method: 'POST',
      body: JSON.stringify({ fileKey }),
    });
  }

  async updateSchema(datasetId: string, fields: any[]): Promise<any> {
    return this.request(`/schemas/dataset/${datasetId}`, {
      method: 'PUT',
      body: JSON.stringify({ fields }),
    });
  }

  // Datasets
  async getDatasets(params?: {
    q?: string;
    category?: string;
    tag?: string | string[];
    format?: string;
    organization?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Dataset>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(key, v));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    return this.request<PaginatedResponse<Dataset>>(
      `/datasets?${searchParams.toString()}`,
    );
  }

  async getDataset(id: string): Promise<Dataset> {
    return this.request<Dataset>(`/datasets/${id}`);
  }

  async getDatasetBySlug(slug: string): Promise<Dataset> {
    return this.request<Dataset>(`/datasets/slug/${slug}`);
  }

  async getDatasetResources(id: string): Promise<DatasetResource[]> {
    return this.request<DatasetResource[]>(`/datasets/${id}/resources`);
  }

  async getDatasetSample(id: string, limit?: number): Promise<any> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<any>(`/datasets/${id}/sample${params}`);
  }

  async queryDatasetData(
    id: string,
    params?: { limit?: number; offset?: number; filter?: string },
  ): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return this.request<any>(`/datasets/${id}/query?${searchParams.toString()}`);
  }

  // Projects
  async getProjects(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Project>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    return this.request<PaginatedResponse<Project>>(
      `/projects?${searchParams.toString()}`,
    );
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  // Resources
  async getResourceDownloadUrl(id: string): Promise<{ url: string; type: string }> {
    return this.request<{ url: string; type: string }>(`/resources/${id}/download`);
  }

  // Projects
  async createProject(data: {
    title: string;
    abstract?: string;
    linkType: string;
    linkUrl: string;
    authors: string[];
    tags: string[];
    datasetsUsed?: string[];
  }): Promise<Project> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();

