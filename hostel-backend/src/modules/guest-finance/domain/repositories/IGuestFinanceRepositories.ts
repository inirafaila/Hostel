import { ITransactionContext } from '../../../../infrastructure/database/ITransactionContext';
import { Folio } from '../models/GuestFinanceModels';

export interface IFolioRepository {
  findByStayId(stayId: string): Promise<Folio | null>;
  save(folio: Folio, txContext?: ITransactionContext): Promise<void>;
}
