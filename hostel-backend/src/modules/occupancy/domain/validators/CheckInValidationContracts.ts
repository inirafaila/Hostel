export type CheckInValidationSeverity = 'Warning' | 'OverrideableBlock' | 'HardBlock';

// Minimal set of domain truth rules needed for VS1 check-in
export type CheckInValidationRuleCode =
  | 'ReservationMissing'
  | 'ReservationInvalidState'
  | 'BedAlreadyOccupied'
  | 'BedMaintenanceBlocked'
  | 'BedDirty'
  | 'GenderMismatch';

export interface CheckInOverrideRequest {
  rule: CheckInValidationRuleCode;
  reason: string;
}

export interface CheckInResolvedOverride {
  rule: CheckInValidationRuleCode;
  reason: string;
  accepted: boolean;
  ignoredMessage?: string;
}

export interface CheckInValidationIssue {
  ruleCode: CheckInValidationRuleCode;
  severity: CheckInValidationSeverity;
  message: string;
  isOverrideable: boolean;
  overrideSupplied: boolean;
  overrideAccepted: boolean;
  resolvedOverrideContext?: CheckInResolvedOverride;
}

export interface CheckInValidationResult {
  isReadyToExecute: boolean;
  issues: CheckInValidationIssue[];
  hardBlocks: CheckInValidationIssue[];
  warnings: CheckInValidationIssue[];
  overrideableBlocks: CheckInValidationIssue[];
  unresolvedOverrideableBlocks: CheckInValidationIssue[];
  acceptedOverrides: CheckInResolvedOverride[];
  invalidOverrides: CheckInOverrideRequest[];
}

export interface IReservationValidationProvider {
  getReservationState(reservationId: string): Promise<{ exists: boolean; status: string; guestGender?: string }>;
}

export interface IInventoryValidationProvider {
  getBedReadiness(bedId: string): Promise<{
    isOccupied: boolean;
    hasSevereMaintenance: boolean;
    isDirty: boolean;
    genderDesignation: string;
  }>;
}
