import { Folio } from './models/GuestFinanceModels';
import { IFolioRepository } from './repositories/IGuestFinanceRepositories';
import { ITransactionContext } from '../../../infrastructure/database/ITransactionContext';

/**
 * Acts as the strict orchestration gate between Occupancy flows and Guest Finance.
 * Prevents Occupancy handlers from acquiring DB-level lock ownership of finance tables.
 */
export class FolioEnsureService {
  constructor(private readonly folioRepo: IFolioRepository) {}

  public async ensureFolioExists(stayId: string, txContext?: ITransactionContext): Promise<Folio> {
    const existing = await this.folioRepo.findByStayId(stayId);
    if (existing) {
      return existing;
    }

    const newFolio: Folio = {
      id: `uuid-folio-${stayId}`,
      stayId,
      status: 'Open'
    };

    // Store within the atomic boundary gracefully received from Occupancy
    await this.folioRepo.save(newFolio, txContext);
    
    return newFolio;
  }
}

