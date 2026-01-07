export declare enum LinkType {
    GITHUB = "github",
    PAPER = "paper",
    WEBSITE = "website",
    VIDEO = "video",
    DEMO = "demo"
}
export declare class CreateProjectDto {
    title: string;
    abstract?: string;
    linkType: LinkType;
    linkUrl: string;
    authors?: string[];
    tags?: string[];
    datasetsUsed?: string[];
}
