import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio CMS API",
      version: "1.0.0",
      description: "API documentation for Portfolio CMS backend",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string" },
            code: { type: "string" },
          },
        },
        Article: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            slug: { type: "string" },
            excerpt: { type: "string" },
            content: { type: "string" },
            coverImage: { type: "string" },
            status: {
              type: "string",
              enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
            },
            featured: { type: "boolean" },
            readTime: { type: "integer" },
            publishedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            content: { type: "string" },
            thumbnailUrl: { type: "string" },
            demoUrl: { type: "string" },
            repoUrl: { type: "string" },
            status: {
              type: "string",
              enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
            },
            featured: { type: "boolean" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
          },
        },
        Profile: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            fullName: { type: "string" },
            title: { type: "string" },
            bio: { type: "string" },
            avatarUrl: { type: "string" },
            resumeUrl: { type: "string" },
            location: { type: "string" },
            socialLinks: { type: "object" },
          },
        },
        Skill: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            proficiency: { type: "integer", minimum: 0, maximum: 100 },
            order: { type: "integer" },
          },
        },
        Experience: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            company: { type: "string" },
            position: { type: "string" },
            location: { type: "string" },
            description: { type: "string" },
            startDate: { type: "string", format: "date-time" },
            endDate: { type: "string", format: "date-time" },
            isCurrent: { type: "boolean" },
            type: {
              type: "string",
              enum: ["WORK", "EDUCATION", "ORGANIZATION", "VOLUNTEER"],
            },
          },
        },
        Certification: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            issuer: { type: "string" },
            credentialId: { type: "string" },
            credentialUrl: { type: "string" },
            issueDate: { type: "string", format: "date-time" },
            expiryDate: { type: "string", format: "date-time" },
            imageUrl: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
