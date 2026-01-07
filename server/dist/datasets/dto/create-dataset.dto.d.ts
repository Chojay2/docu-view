export declare enum UpdateFrequency {
    ONCE = "once",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    AD_HOC = "ad-hoc"
}
export declare class CreateDatasetDto {
    title: string;
    description?: string;
    category: string;
    tags?: string[];
    license: string;
    sourceOrg: string;
    updateFrequency: UpdateFrequency;
    spatialCoverage?: any;
    temporalCoverageStart?: string;
    temporalCoverageEnd?: string;
    dataFormat: string[];
    isPublic?: boolean;
}
