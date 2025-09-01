import prisma from '../libs/prisma';
import { Prisma } from '../generated/prisma';
import type { GetContractDocumentsParamsDTO } from '../types/contractDocumentType';

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

  /**
   * 계약서 목록을 조회합니다.
   */
  findContractDocumentList = async (
    { page, pageSize, searchBy, keyword }: GetContractDocumentsParamsDTO,
    companyId: number,
  ) => {
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
    const totalPages =
      totalItemCount % currentPageSize === 0
        ? totalItemCount / currentPageSize
        : (totalItemCount - (totalItemCount % currentPageSize)) / currentPageSize + 1;

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

    // 응답 데이터 변환
    const data = contracts.map((contract) => ({
      id: contract.id,
      contractName: `${contract.car.model} - ${contract.customer.name} 고객님`,
      resolutionDate: contract.resolutionDate,
      documentCount: contract.contractDocumentRelation.length,
      manager: contract.user.name,
      carNumber: contract.car.carNumber,
      documents: contract.contractDocumentRelation.map((relation) => ({
        id: relation.contractDocument.id,
        fileName: relation.contractDocument.fileName,
      })),
    }));

    return {
      currentPage,
      totalPages,
      totalItemCount,
      data,
    };
  };
}

export default new ContractDocumentRepository();
