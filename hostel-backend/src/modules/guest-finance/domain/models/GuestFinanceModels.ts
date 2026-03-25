export type FolioStatus = 'Open' | 'Closed';

export interface Folio {
  id: string;
  stayId: string;
  status: FolioStatus;
  // Financial specifics purposefully excluded in this slice
}
