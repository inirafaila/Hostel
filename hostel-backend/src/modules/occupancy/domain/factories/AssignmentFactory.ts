import { BedAssignment } from '../models/OccupancyModels';

export class AssignmentFactory {
  public createAssignment(stayId: string, targetBedId: string): BedAssignment {
    return {
      id: "uuid-assignment-new",
      stayId,
      targetBedId,
      isActive: true
    };
  }
}
