import { PrismaClient } from '../src/generated/prisma';
import {
  COMPANIES,
  USERS,
  CUSTOMERS,
  CARS,
  CAR_MODELS,
  CONTRACTS,
  MEETINGS,
  CONTRACT_DOCUMENTS,
} from './mock';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시드 데이터 삽입을 시작합니다...');

  // 기존 데이터 삭제 및 시퀀스 리셋
  console.log('🗑️ 기존 데이터를 삭제하고 시퀀스를 리셋합니다...');
  await prisma.$executeRaw`
    TRUNCATE TABLE 
      "Company", 
      "User", 
      "Customer", 
      "Car", 
      "CarModel", 
      "Contract", 
      "Meeting", 
      "ContractDocument" 
    RESTART IDENTITY CASCADE
  `;

  // 회사 데이터 삽입
  console.log('🏢 회사 데이터를 삽입합니다...');
  for (const company of COMPANIES) {
    await prisma.company.create({
      data: {
        companyName: company.companyName,
        companyCode: company.companyCode,
      },
    });
  }

  // 유저 데이터 삽입
  console.log('👥 유저 데이터를 삽입합니다...');
  for (const user of USERS) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        employeeNumber: user.employeeNumber,
        phoneNumber: user.phoneNumber,
        password: user.password,
        isAdmin: user.isAdmin || false,
        companyId: user.companyId,
      },
    });
  }

  // 고객 데이터 삽입
  console.log('👤 고객 데이터를 삽입합니다...');
  for (const customer of CUSTOMERS) {
    await prisma.customer.create({
      data: {
        name: customer.name,
        gender: customer.gender as any,
        phoneNumber: customer.phoneNumber,
        ageGroup: customer.ageGroup as any,
        region: customer.region as any,
        email: customer.email,
        companyId: customer.companyId,
      },
    });
  }

  // 차량 모델 데이터 삽입
  console.log('🚗 차량 모델 데이터를 삽입합니다...');
  for (const carModel of CAR_MODELS) {
    await prisma.carModel.create({
      data: {
        model: carModel.model,
        manufacturer: carModel.manufacturer,
        type: carModel.type,
      },
    });
  }

  // 차량 데이터 삽입
  console.log('🚙 차량 데이터를 삽입합니다...');
  for (const car of CARS) {
    await prisma.car.create({
      data: {
        carNumber: car.carNumber,
        model: car.model,
        manufacturingYear: car.manufacturingYear,
        mileage: car.mileage,
        price: car.price,
        accidentCount: car.accidentCount,
        status: car.status as any,
        companyId: car.companyId,
      },
    });
  }

  // 계약 데이터 삽입
  console.log('📋 계약 데이터를 삽입합니다...');
  for (const contract of CONTRACTS) {
    await prisma.contract.create({
      data: {
        status: contract.status as any,
        userId: contract.userId,
        customerId: contract.customerId,
        carId: contract.carId,
        companyId: contract.companyId,
      },
    });
  }

  // 미팅 데이터 삽입
  console.log('📅 미팅 데이터를 삽입합니다...');
  for (const meeting of MEETINGS) {
    await prisma.meeting.create({
      data: {
        date: new Date(meeting.date),
        alarms: meeting.alarms,
        contractId: meeting.contractId,
      },
    });
  }

  // 계약서 데이터 삽입
  console.log('📄 계약서 데이터를 삽입합니다...');
  for (const document of CONTRACT_DOCUMENTS) {
    await prisma.contractDocument.create({
      data: {
        fileName: document.fileName,
        contractId: document.contractId,
      },
    });
  }

  console.log('✅ 시드 데이터 삽입이 완료되었습니다!');
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 삽입 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
