export class EventPublisher {
  public async publish(eventName: string, payload: any): Promise<void> {
    console.log(`[EventPublisher] Emitting ${eventName}`, payload);
  }
}
