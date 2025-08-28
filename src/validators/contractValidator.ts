import { object, string, number, array, refine, optional, enums } from 'superstruct';

const isoDateString = refine(string(), 'isodate', (value) => {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/;
  return isoRegex.test(value);
});

const meetingSchema = object({
  date: isoDateString,
  alarms: array(isoDateString),
});

const createContractBodySchema = object({
  carId: number(),
  customerId: number(),
  meetings: array(meetingSchema),
});

const searchByOptions = ['customerName', 'userName'];

const getContractListParamsSchema = object({
  searchBy: optional(enums(searchByOptions)),
  keyword: optional(string()),
});

const contractIdSchema = refine(string(), 'numeric_string', (value) => {
  const isNumeric = /^\d+$/.test(value);
  if (!isNumeric) {
    return '문자열이 유효한 숫자로만 구성되어야 합니다.';
  }
  return true;
});

const contractStatusOptions = [
  'carInspection',
  'priceNegotiation',
  'contractDraft',
  'contractSuccessful',
  'contractFailed',
];

const contractDocumentSchema = object({
  id: number(),
  filename: string(),
});

const updateContractBodySchema = object({
  status: optional(enums(contractStatusOptions)),
  resolutionDate: optional(isoDateString),
  contractPrice: optional(number()),
  meetings: optional(array(meetingSchema)),
  contractDocuments: optional(array(contractDocumentSchema)),
  userId: optional(number()),
  carId: optional(number()),
  customerId: optional(number()),
});

export {
  createContractBodySchema,
  getContractListParamsSchema,
  contractIdSchema,
  updateContractBodySchema,
};
