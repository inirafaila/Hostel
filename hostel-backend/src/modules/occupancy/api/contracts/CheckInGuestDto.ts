export interface OverridePayload {
  rule: string;
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
    rule: string;
    message: string;
  }>;
}
