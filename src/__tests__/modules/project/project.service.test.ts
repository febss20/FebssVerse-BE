import { projectService } from "../../../modules/project/project.service";
import { projectRepository } from "../../../modules/project/project.repository";

jest.mock("../../../modules/project/project.repository");

describe("ProjectService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProjects", () => {
    it("should return published projects for unauthenticated users", async () => {
      const mockProjects = [
        { id: "1", title: "Project 1", status: "PUBLISHED" },
      ];

      (projectRepository.findMany as jest.Mock).mockResolvedValue(mockProjects);
      (projectRepository.count as jest.Mock).mockResolvedValue(1);

      const result = await projectService.getProjects({
        isAuthenticated: false,
      });

      expect(result).toEqual({ projects: mockProjects, total: 1 });
      expect(projectRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "PUBLISHED" },
        })
      );
    });

    it("should return all projects for authenticated users", async () => {
      const mockProjects = [
        { id: "1", title: "Project 1", status: "DRAFT" },
        { id: "2", title: "Project 2", status: "PUBLISHED" },
      ];

      (projectRepository.findMany as jest.Mock).mockResolvedValue(mockProjects);
      (projectRepository.count as jest.Mock).mockResolvedValue(2);

      const result = await projectService.getProjects({
        isAuthenticated: true,
      });

      expect(result).toEqual({ projects: mockProjects, total: 2 });
    });

    it("should filter featured projects", async () => {
      (projectRepository.findMany as jest.Mock).mockResolvedValue([]);
      (projectRepository.count as jest.Mock).mockResolvedValue(0);

      await projectService.getProjects({
        isAuthenticated: false,
        featured: true,
      });

      expect(projectRepository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ featured: true }),
        })
      );
    });
  });

  describe("getProjectBySlug", () => {
    it("should return project if found", async () => {
      const mockProject = { id: "1", title: "Test", slug: "test" };
      (projectRepository.findBySlug as jest.Mock).mockResolvedValue(
        mockProject
      );

      const result = await projectService.getProjectBySlug("test");

      expect(result).toEqual(mockProject);
    });

    it("should throw NotFoundError if project not found", async () => {
      (projectRepository.findBySlug as jest.Mock).mockResolvedValue(null);

      await expect(
        projectService.getProjectBySlug("nonexistent")
      ).rejects.toThrow("Project not found");
    });
  });

  describe("createProject", () => {
    it("should create project with generated slug", async () => {
      const mockProject = {
        id: "1",
        title: "My Project",
        slug: "my-project",
      };
      (projectRepository.create as jest.Mock).mockResolvedValue(mockProject);

      const result = await projectService.createProject("user-123", {
        title: "My Project",
        status: "DRAFT",
        featured: false,
      });

      expect(result).toEqual(mockProject);
      expect(projectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My Project",
          slug: "my-project",
        })
      );
    });

    it("should connect technologies when provided", async () => {
      (projectRepository.create as jest.Mock).mockResolvedValue({});

      await projectService.createProject("user-123", {
        title: "Tech Project",
        technologies: ["React", "Node.js"],
        status: "DRAFT",
        featured: false,
      });

      expect(projectRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          technologies: {
            connectOrCreate: expect.arrayContaining([
              expect.objectContaining({
                where: { name: "React" },
                create: { name: "React" },
              }),
            ]),
          },
        })
      );
    });
  });

  describe("updateProject", () => {
    it("should update project if exists", async () => {
      const existingProject = { id: "1", title: "Old Title" };
      const updatedProject = { id: "1", title: "New Title" };

      (projectRepository.findById as jest.Mock).mockResolvedValue(
        existingProject
      );
      (projectRepository.update as jest.Mock).mockResolvedValue(updatedProject);

      const result = await projectService.updateProject("1", {
        title: "New Title",
      });

      expect(result).toEqual(updatedProject);
    });

    it("should throw NotFoundError if project not found", async () => {
      (projectRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        projectService.updateProject("nonexistent", { title: "New" })
      ).rejects.toThrow("Project not found");
    });

    it("should clear technologies before updating when technologies provided", async () => {
      (projectRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (projectRepository.clearTechnologies as jest.Mock).mockResolvedValue({});
      (projectRepository.update as jest.Mock).mockResolvedValue({});

      await projectService.updateProject("1", { technologies: ["Vue.js"] });

      expect(projectRepository.clearTechnologies).toHaveBeenCalledWith("1");
    });
  });

  describe("deleteProject", () => {
    it("should delete project if exists", async () => {
      (projectRepository.findById as jest.Mock).mockResolvedValue({ id: "1" });
      (projectRepository.delete as jest.Mock).mockResolvedValue({});

      await projectService.deleteProject("1");

      expect(projectRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if project not found", async () => {
      (projectRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(projectService.deleteProject("nonexistent")).rejects.toThrow(
        "Project not found"
      );
    });
  });

  describe("reorderProjects", () => {
    it("should update order for all items", async () => {
      (projectRepository.updateOrder as jest.Mock).mockResolvedValue({});

      const result = await projectService.reorderProjects([
        { id: "1", order: 0 },
        { id: "2", order: 1 },
      ]);

      expect(result).toEqual({ message: "Projects reordered successfully" });
      expect(projectRepository.updateOrder).toHaveBeenCalledTimes(2);
    });
  });

  describe("getTechnologies", () => {
    it("should return all technologies", async () => {
      const mockTechnologies = [{ id: "1", name: "React" }];
      (projectRepository.findTechnologies as jest.Mock).mockResolvedValue(
        mockTechnologies
      );

      const result = await projectService.getTechnologies();

      expect(result).toEqual(mockTechnologies);
    });
  });
});
