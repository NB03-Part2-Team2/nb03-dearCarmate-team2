import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

class ContractDocumentRepository {
  /**
   * 계약서 문서를 생성합니다.
   */
  async create(fileName: string) {
    const contractDocument = await prisma.contractDocument.create({
      data: {
        fileName,
      },
    });

    return contractDocument;
  }
}

export default new ContractDocumentRepository();
