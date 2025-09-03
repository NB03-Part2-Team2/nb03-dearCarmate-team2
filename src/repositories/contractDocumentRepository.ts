import prisma from '../libs/prisma';
import { Prisma } from '../generated/prisma';
import type {
  GetContractDocumentsParamsDTO,
  DraftContractDTO,
  ContractDocumentRawData,
} from '../types/contractDocumentType';

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

  getById = async (contractDocumentId: number) => {
    const contractDocument = await prisma.contractDocument.findUnique({
      where: { id: contractDocumentId },
    });
    return contractDocument;
  };

  /**
   * 계약서 목록을 조회합니다.
   */
  getContractDocumentList = async (
    { page, pageSize, searchBy, keyword }: GetContractDocumentsParamsDTO,
    companyId: number,
  ): Promise<ContractDocumentRawData> => {
    // 검색 조건 구성
    let whereCondition: Prisma.ContractWhereInput = {
      companyId,
    };

    if (searchBy && keyword && keyword.trim() !== '') {
      switch (searchBy) {
        case 'contractName':
          // 계약명 검색: 차량 모델명과 고객명으로 검색
          whereCondition.OR = [
            {
              car: {
                model: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
            {
              customer: {
                name: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            },
          ];
          break;
        case 'manager':
          whereCondition.user = {
            name: {
              contains: keyword,
              mode: 'insensitive',
            },
          };
          break;
        case 'carNumber':
          whereCondition.car = {
            carNumber: {
              contains: keyword,
              mode: 'insensitive',
            },
          };
          break;
      }
    }

    // 전체 개수 조회
    const totalItemCount = await prisma.contract.count({
      where: whereCondition,
    });

    // 페이지네이션 계산
    const currentPage = page || 1;
    const currentPageSize = pageSize || 8;
    const skip = (currentPage - 1) * currentPageSize;

    // 계약서 목록 조회
    const contracts = await prisma.contract.findMany({
      where: whereCondition,
      select: {
        id: true,
        resolutionDate: true,
        user: {
          select: {
            name: true,
          },
        },
        car: {
          select: {
            carNumber: true,
            model: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
        contractDocumentRelation: {
          select: {
            contractDocument: {
              select: {
                id: true,
                fileName: true,
              },
            },
          },
        },
      },
      skip,
      take: currentPageSize,
      orderBy: {
        id: 'desc',
      },
    });

    return { contracts, totalItemCount, page: currentPage, pageSize: currentPageSize };
  };

  /**
   * 계약서 작성 중인 거래 목록을 조회합니다.
   */
  getDraftContractList = async (companyId: number): Promise<DraftContractDTO[]> => {
    const draftContracts = await prisma.contract.findMany({
      where: {
        companyId,
        status: 'contractDraft',
      },
      select: {
        id: true,
        car: {
          select: {
            model: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return draftContracts;
  };
}

export default new ContractDocumentRepository();
