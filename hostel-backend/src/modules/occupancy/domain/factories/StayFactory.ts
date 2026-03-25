import { Stay } from '../models/OccupancyModels';

export class StayFactory {
  public createStayFromReservation(reservationId: string): Stay {
    return {
      id: "uuid-stay-new",
      reservationId,
      status: "In-House"
    };
  }
}
