import { OverridePayload } from '../../api/contracts/CheckInGuestDto';

export interface ValidationResult {
  isValid: boolean;
  requiresOverride: boolean;
  violations: Array<{ rule: string; message: string }>;
}

export class CheckInReadinessValidator {
  public async validateEligibility(reservationId: string, targetBedId: string, providedOverrides?: OverridePayload[]): Promise<ValidationResult> {
    return {
      isValid: true,
      requiresOverride: false,
      violations: []
    };
  }
}
