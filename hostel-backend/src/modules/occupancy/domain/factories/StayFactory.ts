export interface Stay {
  id: string;
  reservationId: string;
  status: string;
}

export class StayFactory {
  public createStayFromReservation(reservationId: string): Stay {
    return {
      id: "uuid-stay-new",
      reservationId,
      status: "In-House"
    };
  }
}
