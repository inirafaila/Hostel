export interface BedAssignment {
  id: string;
  stayId: string;
  targetBedId: string;
}

export class AssignmentFactory {
  public createAssignment(stayId: string, targetBedId: string): BedAssignment {
    return {
      id: "uuid-assignment-new",
      stayId,
      targetBedId
    };
  }
}
