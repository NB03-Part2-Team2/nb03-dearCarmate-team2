import prisma from '../libs/prisma';

class ContractDocumentRepository {
  /**
   * 계약서 문서를 생성합니다.
   */
  create = async (fileName: string) => {
    const contractDocument = await prisma.contractDocument.create({
      data: {
        fileName,
      },
    });

    return contractDocument;
  };

  findById = async (contractDocumentId: number) => {
    const contractDocument = await prisma.contractDocument.findUnique({
      where: { id: contractDocumentId },
    });
    return contractDocument;
  };
}

export default new ContractDocumentRepository();
