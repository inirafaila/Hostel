import { CheckInGuestRequest, CheckInGuestResponse, ValidationFailureResponse } from './contracts/CheckInGuestDto';
import { CheckInCommandHandler } from '../application/CheckInCommandHandler';

/**
 * Controller / Route Handler Skeleton for POST /api/stays/check-in
 * Deliberately thin transport boundary mapping. No framework-specific HTTP semantics frozen here yet.
 */
export class CheckInController {
  constructor(private readonly commandHandler: CheckInCommandHandler) {}

  public async handleCheckIn(request: CheckInGuestRequest): Promise<CheckInGuestResponse | ValidationFailureResponse> {
    if (!request.reservationId || !request.targetBedId) {
      throw new Error("Missing required payload fields");
    }

    try {
      const result = await this.commandHandler.execute(request);
      return result;
    } catch (e: any) {
      if (e.name === 'ValidationError') {
        return {
          error: 'ValidationFailed',
          requiresOverride: e.requiresOverride,
          violations: e.violations
        };
      }
      throw e;
    }
  }
}
