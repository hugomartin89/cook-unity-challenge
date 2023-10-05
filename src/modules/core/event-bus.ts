/**
 * Base class for all domain events.
 */
export abstract class Event<Payload> {
    private payload: Payload;

    constructor(payload: Payload) {
        this.payload = payload;
    }

    public getPayload(): Payload {
        return this.payload;
    }
}

/**
 * Base class for all event listeners.
 */
export abstract class Listener<T extends Event<any>> {
    abstract shouldHandle(event: T): boolean;
    abstract handle(event: T): Promise<void>;
}

/**
 * Event orchestrator.
 *
 * TODO: make async event commits.
*/
export class EventManager {
    private static instance: EventManager;
    private listeners: Listener<any>[];

    public static getInstance(): EventManager {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }

        return EventManager.instance;
    }

    private constructor() {
        this.listeners = [];
    }

    public subscribe(listener: Listener<any>) {
        this.listeners.push(listener);
    };

    public async dispatch(event: Event<any>): Promise<void> {
        const promises = this.listeners
            .filter((listener) => listener.shouldHandle(event))
            .map((listener) => listener.handle(event));

        await Promise.all(promises);
    }
}
