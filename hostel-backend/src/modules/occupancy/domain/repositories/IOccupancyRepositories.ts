import { ITransactionContext } from '../../../../infrastructure/database/ITransactionContext';
import { Reservation, Stay, BedAssignment } from '../models/OccupancyModels';

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  save(reservation: Reservation, txContext?: ITransactionContext): Promise<void>;
}

export interface IStayRepository {
  findById(id: string): Promise<Stay | null>;
  save(stay: Stay, txContext?: ITransactionContext): Promise<void>;
}

export interface IAssignmentRepository {
  // Explicitly enforces Assignment creation over modifying a "Bed" table
  save(assignment: BedAssignment, txContext?: ITransactionContext): Promise<void>;
  findActiveByBedId(bedId: string): Promise<BedAssignment | null>;
}
