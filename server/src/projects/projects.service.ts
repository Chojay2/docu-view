import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        skip,
        take: limit,
        include: {
          datasets: {
            include: {
              dataset: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.project.count(),
    ]);

    return {
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        datasets: {
          include: {
            dataset: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const { datasetsUsed, ...projectData } = createProjectDto;

    const project = await this.prisma.project.create({
      data: {
        ...projectData,
        authors: projectData.authors || [],
        tags: projectData.tags || [],
        createdBy: userId,
        status: 'APPROVED', // Projects are auto-approved
      },
      include: {
        datasets: true,
      },
    });

    // Link datasets if provided
    if (datasetsUsed && datasetsUsed.length > 0) {
      await Promise.all(
        datasetsUsed.map((datasetId) =>
          this.prisma.projectDataset.create({
            data: {
              projectId: project.id,
              datasetId,
            },
          }),
        ),
      );
    }

    return this.findOne(project.id);
  }

  async update(id: string, updateData: Partial<CreateProjectDto>) {
    const { datasetsUsed, ...projectData } = updateData;

    // Update project
    await this.prisma.project.update({
      where: { id },
      data: projectData,
    });

    // Update dataset links if provided
    if (datasetsUsed !== undefined) {
      // Remove existing links
      await this.prisma.projectDataset.deleteMany({
        where: { projectId: id },
      });

      // Add new links
      if (datasetsUsed.length > 0) {
        await Promise.all(
          datasetsUsed.map((datasetId) =>
            this.prisma.projectDataset.create({
              data: {
                projectId: id,
                datasetId,
              },
            }),
          ),
        );
      }
    }

    return this.findOne(id);
  }
}

