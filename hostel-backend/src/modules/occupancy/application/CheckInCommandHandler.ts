import { CheckInGuestRequest, CheckInGuestResponse } from '../api/contracts/CheckInGuestDto';
import { CheckInReadinessValidator } from '../domain/validators/CheckInReadinessValidator';
import { StayFactory } from '../domain/factories/StayFactory';
import { AssignmentFactory } from '../domain/factories/AssignmentFactory';
import { FolioEnsureService } from '../../guest-finance/domain/FolioEnsureService';
import { IReservationRepository, IStayRepository, IAssignmentRepository } from '../domain/repositories/IOccupancyRepositories';
import { TransactionCoordinator } from '../../../infrastructure/database/TransactionCoordinator';
import { ITransactionContext } from '../../../infrastructure/database/ITransactionContext';
import { EventPublisher } from '../../../infrastructure/events/EventPublisher';

/**
 * Command Handler Skeleton defining the transactional orchestration steps.
 */
export class CheckInCommandHandler {
  constructor(
    private readonly validator: CheckInReadinessValidator,
    private readonly reservationRepo: IReservationRepository,
    private readonly stayRepo: IStayRepository,
    private readonly assignmentRepo: IAssignmentRepository,
    private readonly stayFactory: StayFactory,
    private readonly assignmentFactory: AssignmentFactory,
    private readonly folioEnsureService: FolioEnsureService,
    private readonly transactionCoordinator: TransactionCoordinator,
    private readonly eventPublisher: EventPublisher
  ) {}

  public async execute(cmd: CheckInGuestRequest): Promise<CheckInGuestResponse> {
    const validationResult = await this.validator.validateEligibility(cmd.reservationId, cmd.targetBedId, cmd.overrides);
    
    if (!validationResult.isReadyToExecute) {
      throw {
        name: 'ValidationError',
        requiresOverride: validationResult.unresolvedOverrideableBlocks.length > 0,
        violations: [...validationResult.hardBlocks, ...validationResult.unresolvedOverrideableBlocks]
      };
    }

    const transactionResult = await this.transactionCoordinator.executeAtomic(async (txContext: ITransactionContext) => {
      // 2a. Update Reservation State
      const reservation = await this.reservationRepo.findById(cmd.reservationId);
      if (!reservation) {
        throw new Error(`Reservation ${cmd.reservationId} not found during check-in transaction lock.`);
      }
      reservation.status = 'In-House';
      await this.reservationRepo.save(reservation, txContext);

      // 2b. Activate Stay
      const newStay = this.stayFactory.createStayFromReservation(reservation.id);
      await this.stayRepo.save(newStay, txContext);

      // 2c. Create Bed Assignment
      const newAssignment = this.assignmentFactory.createAssignment(newStay.id, cmd.targetBedId);
      await this.assignmentRepo.save(newAssignment, txContext);

      // 2d. Synchronous Folio Ensure / Open
      const folio = await this.folioEnsureService.ensureFolioExists(newStay.id, txContext);

      return {
        stayId: newStay.id,
        assignmentId: newAssignment.id,
        folioId: folio.id
      };
    });

    await this.eventPublisher.publish('GuestCheckedInEvent', {
      stayId: transactionResult.stayId,
      reservationId: cmd.reservationId,
      targetBedId: cmd.targetBedId,
      overrides: cmd.overrides,
      operatorId: cmd.operatorId,
      timestamp: new Date().toISOString()
    });

    return {
      stayId: transactionResult.stayId,
      assignmentId: transactionResult.assignmentId,
      folioId: transactionResult.folioId,
      status: 'In-House'
    };
  }
}
