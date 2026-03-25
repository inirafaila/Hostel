import { CheckInValidationRuleCode } from '../../domain/validators/CheckInValidationContracts';

export interface OverridePayload {
  rule: CheckInValidationRuleCode;
  reason: string;
}

export interface CheckInGuestRequest {
  reservationId: string;
  targetBedId: string;
  overrides?: OverridePayload[];
  operatorId: string;
}

export interface CheckInGuestResponse {
  stayId: string;
  assignmentId: string;
  folioId: string;
  status: string;
}

export interface ValidationFailureResponse {
  error: 'ValidationFailed';
  requiresOverride: boolean;
  violations: Array<{
    ruleCode: CheckInValidationRuleCode;
    severity: string;
    message: string;
    isOverrideable: boolean;
  }>;
}
