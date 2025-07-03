// Raw API response types (what the API actually returns)
export interface RawMovement {
  accountingDate: string;
  transactionDate: string;
  operationTime: string;
  newBalance: string;
  codeOperationMovement: string;
  movementAmount: string;
  observation: string;
  expandedCode: string;
  movementNumber: string;
  chargePaymentFlag: string;
}

export interface SantanderApiResponse {
  movements?: RawMovement[];
  totalCount?: number;
  hasMore?: boolean;
}

// Processed types (what we return to the client)
export interface Movement {
  accountingDate: Date;
  transactionDate: Date;
  operationTime: string;
  newBalance: string;
  codeOperationMovement: string;
  movementAmount: string;
  observation: string;
  expandedCode: string;
  movementNumber: string;
  chargePaymentFlag: string;
}

export class MovementResponseDto {
  movements: Movement[];
}
