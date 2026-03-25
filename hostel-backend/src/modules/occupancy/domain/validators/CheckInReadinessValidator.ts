import {
    CheckInOverrideRequest,
    CheckInValidationResult,
    CheckInValidationIssue,
    IReservationValidationProvider,
    IInventoryValidationProvider,
    CheckInResolvedOverride
  } from './CheckInValidationContracts';
  
  export class CheckInReadinessValidator {
    constructor(
      private readonly reservationProvider: IReservationValidationProvider,
      private readonly inventoryProvider: IInventoryValidationProvider
    ) {}
  
    public async validateEligibility(
      reservationId: string,
      targetBedId: string,
      providedOverrides: CheckInOverrideRequest[] = []
    ): Promise<CheckInValidationResult> {
      const issues: CheckInValidationIssue[] = [];
      const acceptedOverrides: CheckInResolvedOverride[] = [];
      const invalidOverrides: CheckInOverrideRequest[] = [];

      // STUBBED: Gather operational facts
      const resState = await this.reservationProvider.getReservationState(reservationId);
      const bedState = await this.inventoryProvider.getBedReadiness(targetBedId);
  
      // RULE 1: Reservation Existence (Hard Block)
      if (!resState.exists) {
        issues.push({
          ruleCode: 'ReservationMissing',
          severity: 'HardBlock',
          message: 'Reservation does not exist.',
          isOverrideable: false,
          overrideSupplied: false,
          overrideAccepted: false
        });
      } else if (resState.status !== 'Confirmed') {
        // RULE 1.5: Reservation Invalid State (Hard Block)
        // Assume 'Confirmed' is the only valid pre-check-in state for this slice logic
        issues.push({
          ruleCode: 'ReservationInvalidState',
          severity: 'HardBlock',
          message: `Reservation cannot be checked in from status: ${resState.status}.`,
          isOverrideable: false,
          overrideSupplied: false,
          overrideAccepted: false
        });
      }
  
      // RULE 2: Bed Occupancy (Hard Block)
      if (bedState.isOccupied) {
        issues.push({
          ruleCode: 'BedAlreadyOccupied',
          severity: 'HardBlock',
          message: 'Target bed is already occupied.',
          isOverrideable: false,
          overrideSupplied: false,
          overrideAccepted: false
        });
      }
  
      // RULE 3: Severe Maintenance (Hard Block)
      if (bedState.hasSevereMaintenance) {
        issues.push({
          ruleCode: 'BedMaintenanceBlocked',
          severity: 'HardBlock',
          message: 'Target bed is locked by a severe maintenance case.',
          isOverrideable: false,
          overrideSupplied: false,
          overrideAccepted: false
        });
      }
  
      // RULE 4: Housekeeping / Dirty (Overrideable Block)
      if (bedState.isDirty) {
        const oReq = providedOverrides.find((o) => o.rule === 'BedDirty');
        const hasValidReason = !!oReq?.reason && oReq.reason.trim().length > 0;
  
        issues.push({
          ruleCode: 'BedDirty',
          severity: 'OverrideableBlock',
          message: 'Target bed is marked dirty.',
          isOverrideable: true,
          overrideSupplied: !!oReq,
          overrideAccepted: hasValidReason,
          resolvedOverrideContext: hasValidReason && oReq ? { rule: oReq.rule, reason: oReq.reason, accepted: true } : undefined
        });
  
        if (hasValidReason && oReq) {
          acceptedOverrides.push({ rule: oReq.rule, reason: oReq.reason, accepted: true });
        }
      }

      // RULE 5: Gender Mismatch (Overrideable Block)
      if (bedState.genderDesignation !== 'Mixed' && resState.guestGender && bedState.genderDesignation !== resState.guestGender) {
        const oReq = providedOverrides.find((o) => o.rule === 'GenderMismatch');
        const hasValidReason = !!oReq?.reason && oReq.reason.trim().length > 0;
  
        issues.push({
          ruleCode: 'GenderMismatch',
          severity: 'OverrideableBlock',
          message: `Dorm restricts assignment to ${bedState.genderDesignation} guests only.`,
          isOverrideable: true,
          overrideSupplied: !!oReq,
          overrideAccepted: hasValidReason,
          resolvedOverrideContext: hasValidReason && oReq ? { rule: oReq.rule, reason: oReq.reason, accepted: true } : undefined
        });
  
        if (hasValidReason && oReq) {
          acceptedOverrides.push({ rule: oReq.rule, reason: oReq.reason, accepted: true });
        }
      }

      // SURFACE INVALID/UNUSED OVERRIDES
      for (const override of providedOverrides) {
        const matchedIssue = issues.find(i => i.ruleCode === override.rule && i.isOverrideable);
        if (!matchedIssue) {
          invalidOverrides.push(override);
        }
      }
  
      // COMPILE RESULT
      const hardBlocks = issues.filter((i) => i.severity === 'HardBlock');
      const warnings = issues.filter((i) => i.severity === 'Warning');
      const overrideableBlocks = issues.filter((i) => i.severity === 'OverrideableBlock');
      const unresolvedOverrideableBlocks = overrideableBlocks.filter((i) => !i.overrideAccepted);
  
      const isReadyToExecute = hardBlocks.length === 0 && unresolvedOverrideableBlocks.length === 0;
  
      return {
        isReadyToExecute,
        issues,
        hardBlocks,
        warnings,
        overrideableBlocks,
        unresolvedOverrideableBlocks,
        acceptedOverrides,
        invalidOverrides
      };
    }
  }
  
