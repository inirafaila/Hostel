export class TransactionCoordinator {
  public async executeAtomic<T>(work: (transactionContext: any) => Promise<T>): Promise<T> {
    const fakeContext = {};
    try {
      const result = await work(fakeContext);
      return result;
    } catch (e) {
      throw e;
    }
  }
}
