import { certificationService } from "../../../modules/certification/certification.service";
import { certificationRepository } from "../../../modules/certification/certification.repository";

jest.mock("../../../modules/certification/certification.repository");

describe("CertificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCertifications", () => {
    it("should return all certifications", async () => {
      const mockCertifications = [
        { id: "1", name: "AWS Certified", issuer: "Amazon" },
        { id: "2", name: "Google Cloud", issuer: "Google" },
      ];

      (certificationRepository.findMany as jest.Mock).mockResolvedValue(
        mockCertifications
      );

      const result = await certificationService.getCertifications();

      expect(result).toEqual(mockCertifications);
    });
  });

  describe("createCertification", () => {
    it("should create certification with parsed dates", async () => {
      const mockCertification = {
        id: "1",
        name: "AWS Certified",
        issuer: "Amazon",
        issueDate: new Date("2023-01-01"),
      };

      (certificationRepository.create as jest.Mock).mockResolvedValue(
        mockCertification
      );

      const result = await certificationService.createCertification(
        "user-123",
        {
          name: "AWS Certified",
          issuer: "Amazon",
          issueDate: "2023-01-01",
        }
      );

      expect(result).toEqual(mockCertification);
      expect(certificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "AWS Certified",
          issuer: "Amazon",
          issueDate: expect.any(Date),
        })
      );
    });

    it("should handle expiryDate when provided", async () => {
      (certificationRepository.create as jest.Mock).mockResolvedValue({});

      await certificationService.createCertification("user-123", {
        name: "Cert",
        issuer: "Issuer",
        issueDate: "2022-01-01",
        expiryDate: "2025-01-01",
      });

      expect(certificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          expiryDate: expect.any(Date),
        })
      );
    });
  });

  describe("updateCertification", () => {
    it("should update certification if exists", async () => {
      const existing = { id: "1", name: "Old Cert" };
      const updated = { id: "1", name: "New Cert" };

      (certificationRepository.findById as jest.Mock).mockResolvedValue(
        existing
      );
      (certificationRepository.update as jest.Mock).mockResolvedValue(updated);

      const result = await certificationService.updateCertification("1", {
        name: "New Cert",
      });

      expect(result).toEqual(updated);
    });

    it("should throw NotFoundError if certification not found", async () => {
      (certificationRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        certificationService.updateCertification("nonexistent", {
          name: "New",
        })
      ).rejects.toThrow("Certification not found");
    });
  });

  describe("deleteCertification", () => {
    it("should delete certification if exists", async () => {
      (certificationRepository.findById as jest.Mock).mockResolvedValue({
        id: "1",
      });
      (certificationRepository.delete as jest.Mock).mockResolvedValue({});

      await certificationService.deleteCertification("1");

      expect(certificationRepository.delete).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundError if certification not found", async () => {
      (certificationRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        certificationService.deleteCertification("nonexistent")
      ).rejects.toThrow("Certification not found");
    });
  });
});
