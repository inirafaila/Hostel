import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { CheckInController } from './modules/occupancy/api/CheckInController';
import { CheckInGuestRequest } from './modules/occupancy/api/contracts/CheckInGuestDto';
import { CheckInCommandHandler } from './modules/occupancy/application/CheckInCommandHandler';
import { CheckInReadinessValidator } from './modules/occupancy/domain/validators/CheckInReadinessValidator';
import {
    IReservationValidationProvider,
    IInventoryValidationProvider
} from './modules/occupancy/domain/validators/CheckInValidationContracts';
import {
    IReservationRepository,
    IStayRepository,
    IAssignmentRepository
} from './modules/occupancy/domain/repositories/IOccupancyRepositories';
import { IFolioRepository } from './modules/guest-finance/domain/repositories/IGuestFinanceRepositories';
import {
    Reservation,
    ReservationStatus,
    Stay,
    BedAssignment
} from './modules/occupancy/domain/models/OccupancyModels';
import { Folio } from './modules/guest-finance/domain/models/GuestFinanceModels';
import { StayFactory } from './modules/occupancy/domain/factories/StayFactory';
import { AssignmentFactory } from './modules/occupancy/domain/factories/AssignmentFactory';
import { FolioEnsureService } from './modules/guest-finance/domain/FolioEnsureService';
import { TransactionCoordinator } from './infrastructure/database/TransactionCoordinator';
import { EventPublisher } from './infrastructure/events/EventPublisher';
import { ITransactionContext } from './infrastructure/database/ITransactionContext';

type BedReadiness = {
    isOccupied: boolean;
    hasSevereMaintenance: boolean;
    isDirty: boolean;
    genderDesignation: string;
};

class InMemoryReservationStore
    implements IReservationRepository, IReservationValidationProvider {
    private readonly reservations = new Map<string, Reservation>();

    constructor() {
        this.reservations.set('reservation-clean-1', {
            id: 'reservation-clean-1',
            status: 'Confirmed',
            guestId: 'guest-clean-1',
            guestGender: 'Male'
        });

        this.reservations.set('reservation-female-1', {
            id: 'reservation-female-1',
            status: 'Confirmed',
            guestId: 'guest-female-1',
            guestGender: 'Female'
        });

        this.reservations.set('reservation-cancelled-1', {
            id: 'reservation-cancelled-1',
            status: 'Cancelled',
            guestId: 'guest-cancelled-1',
            guestGender: 'Male'
        });
    }

    private inferGuestGender(reservationId: string): string | undefined {
        const lowered = reservationId.toLowerCase();

        if (lowered.includes('female')) {
            return 'Female';
        }

        if (lowered.includes('male')) {
            return 'Male';
        }

        return undefined;
    }

    private ensureReservation(reservationId: string): Reservation | null {
        const lowered = reservationId.toLowerCase();

        if (lowered.includes('missing')) {
            return null;
        }

        const existing = this.reservations.get(reservationId);
        if (existing) {
            return existing;
        }

        let status: ReservationStatus = 'Confirmed';

        if (lowered.includes('cancelled')) {
            status = 'Cancelled';
        } else if (lowered.includes('inhouse')) {
            status = 'In-House';
        } else if (lowered.includes('checkedout')) {
            status = 'Checked-Out';
        } else if (lowered.includes('arriving')) {
            status = 'Arriving';
        }

        const created: Reservation = {
            id: reservationId,
            status,
            guestId: `guest-${reservationId}`,
            guestGender: this.inferGuestGender(reservationId)
        };

        this.reservations.set(reservationId, created);
        return created;
    }

    public async getReservationState(
        reservationId: string
    ): Promise<{ exists: boolean; status: string; guestGender?: string }> {
        const reservation = this.ensureReservation(reservationId);

        if (!reservation) {
            return {
                exists: false,
                status: 'Missing'
            };
        }

        return {
            exists: true,
            status: reservation.status,
            guestGender: reservation.guestGender
        };
    }

    public async findById(id: string): Promise<Reservation | null> {
        return this.ensureReservation(id);
    }

    public async save(
        reservation: Reservation,
        _txContext?: ITransactionContext
    ): Promise<void> {
        this.reservations.set(reservation.id, { ...reservation });
    }
}

class InMemoryInventoryProvider implements IInventoryValidationProvider {
    private readonly bedStates = new Map<string, BedReadiness>();

    constructor() {
        this.bedStates.set('bed-clean-1', {
            isOccupied: false,
            hasSevereMaintenance: false,
            isDirty: false,
            genderDesignation: 'Mixed'
        });

        this.bedStates.set('bed-dirty-1', {
            isOccupied: false,
            hasSevereMaintenance: false,
            isDirty: true,
            genderDesignation: 'Mixed'
        });

        this.bedStates.set('bed-occupied-1', {
            isOccupied: true,
            hasSevereMaintenance: false,
            isDirty: false,
            genderDesignation: 'Mixed'
        });

        this.bedStates.set('bed-maintenance-1', {
            isOccupied: false,
            hasSevereMaintenance: true,
            isDirty: false,
            genderDesignation: 'Mixed'
        });

        this.bedStates.set('bed-femaleonly-1', {
            isOccupied: false,
            hasSevereMaintenance: false,
            isDirty: false,
            genderDesignation: 'Female'
        });

        this.bedStates.set('bed-maleonly-1', {
            isOccupied: false,
            hasSevereMaintenance: false,
            isDirty: false,
            genderDesignation: 'Male'
        });
    }

    private buildDefaultBedState(bedId: string): BedReadiness {
        const lowered = bedId.toLowerCase();

        return {
            isOccupied: lowered.includes('occupied'),
            hasSevereMaintenance: lowered.includes('maintenance'),
            isDirty: lowered.includes('dirty'),
            genderDesignation: lowered.includes('femaleonly')
                ? 'Female'
                : lowered.includes('maleonly')
                    ? 'Male'
                    : 'Mixed'
        };
    }

    public markOccupied(bedId: string): void {
        const current = this.bedStates.get(bedId) ?? this.buildDefaultBedState(bedId);

        this.bedStates.set(bedId, {
            ...current,
            isOccupied: true
        });
    }

    public async getBedReadiness(bedId: string): Promise<BedReadiness> {
        const current = this.bedStates.get(bedId) ?? this.buildDefaultBedState(bedId);
        this.bedStates.set(bedId, current);
        return current;
    }
}

class InMemoryStayRepository implements IStayRepository {
    private readonly stays = new Map<string, Stay>();

    public async findById(id: string): Promise<Stay | null> {
        return this.stays.get(id) ?? null;
    }

    public async save(stay: Stay, _txContext?: ITransactionContext): Promise<void> {
        this.stays.set(stay.id, { ...stay });
    }
}

class InMemoryAssignmentRepository implements IAssignmentRepository {
    private readonly assignments = new Map<string, BedAssignment>();

    constructor(private readonly inventoryProvider: InMemoryInventoryProvider) { }

    public async save(
        assignment: BedAssignment,
        _txContext?: ITransactionContext
    ): Promise<void> {
        this.assignments.set(assignment.id, { ...assignment });

        if (assignment.isActive) {
            this.inventoryProvider.markOccupied(assignment.targetBedId);
        }
    }

    public async findActiveByBedId(bedId: string): Promise<BedAssignment | null> {
        for (const assignment of this.assignments.values()) {
            if (assignment.targetBedId === bedId && assignment.isActive) {
                return assignment;
            }
        }

        return null;
    }
}

class InMemoryFolioRepository implements IFolioRepository {
    private readonly folios = new Map<string, Folio>();

    public async findByStayId(stayId: string): Promise<Folio | null> {
        for (const folio of this.folios.values()) {
            if (folio.stayId === stayId) {
                return folio;
            }
        }

        return null;
    }

    public async save(
        folio: Folio,
        _txContext?: ITransactionContext
    ): Promise<void> {
        this.folios.set(folio.id, { ...folio });
    }
}

const reservationStore = new InMemoryReservationStore();
const inventoryProvider = new InMemoryInventoryProvider();
const stayRepository = new InMemoryStayRepository();
const assignmentRepository = new InMemoryAssignmentRepository(inventoryProvider);
const folioRepository = new InMemoryFolioRepository();

const validator = new CheckInReadinessValidator(
    reservationStore,
    inventoryProvider
);

const commandHandler = new CheckInCommandHandler(
    validator,
    reservationStore,
    stayRepository,
    assignmentRepository,
    new StayFactory(),
    new AssignmentFactory(),
    new FolioEnsureService(folioRepository),
    new TransactionCoordinator(),
    new EventPublisher()
);

const controller = new CheckInController(commandHandler);

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';
const PORT = Number(process.env.PORT ?? 3001);

function setJsonHeaders(response: ServerResponse, statusCode = 200): void {
    response.statusCode = statusCode;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function parseJsonBody<T>(request: IncomingMessage): Promise<T> {
    const chunks: Buffer[] = [];

    for await (const chunk of request) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const rawBody = Buffer.concat(chunks).toString('utf8');

    if (!rawBody) {
        throw new Error('Request body is empty.');
    }

    return JSON.parse(rawBody) as T;
}

function writeJson(
    response: ServerResponse,
    statusCode: number,
    payload: unknown
): void {
    setJsonHeaders(response, statusCode);
    response.end(JSON.stringify(payload, null, 2));
}

const server = createServer(async (request, response) => {
    if (!request.url) {
        writeJson(response, 404, { error: 'NotFound' });
        return;
    }

    const url = new URL(request.url, `http://localhost:${PORT}`);

    if (request.method === 'OPTIONS') {
        setJsonHeaders(response, 204);
        response.end();
        return;
    }

    if (request.method === 'GET' && url.pathname === '/health') {
        writeJson(response, 200, {
            status: 'ok',
            service: 'hostel-backend-dev-runtime'
        });
        return;
    }

    if (request.method === 'GET' && url.pathname === '/api/dev/check-in-fixtures') {
        writeJson(response, 200, {
            cleanCheckIn: {
                reservationId: 'reservation-clean-1',
                targetBedId: 'bed-clean-1',
                operatorId: 'operator-1'
            },
            overrideRequiredDirtyBed: {
                reservationId: 'reservation-clean-1',
                targetBedId: 'bed-dirty-1',
                overrides: [
                    {
                        rule: 'BedDirty',
                        reason: 'Manager approved manual check-in while turnover is being completed.'
                    }
                ],
                operatorId: 'operator-1'
            },
            hardBlockedOccupiedBed: {
                reservationId: 'reservation-clean-1',
                targetBedId: 'bed-occupied-1',
                operatorId: 'operator-1'
            },
            hardBlockedReservationState: {
                reservationId: 'reservation-cancelled-1',
                targetBedId: 'bed-clean-1',
                operatorId: 'operator-1'
            },
            overrideRequiredGenderMismatch: {
                reservationId: 'reservation-female-1',
                targetBedId: 'bed-maleonly-1',
                overrides: [
                    {
                        rule: 'GenderMismatch',
                        reason: 'Manager explicitly approved this exception.'
                    }
                ],
                operatorId: 'operator-1'
            }
        });
        return;
    }

    if (request.method === 'POST' && url.pathname === '/api/stays/check-in') {
        try {
            const payload = await parseJsonBody<CheckInGuestRequest>(request);
            const result = await controller.handleCheckIn(payload);

            if ('error' in result) {
                writeJson(response, 422, result);
                return;
            }

            writeJson(response, 200, result);
            return;
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Unexpected server error';

            writeJson(response, 400, {
                error: 'RequestFailed',
                message
            });
            return;
        }
    }

    writeJson(response, 404, { error: 'NotFound' });
});

server.listen(PORT, () => {
    console.log(`Hostel backend dev runtime listening on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`QA fixtures: http://localhost:${PORT}/api/dev/check-in-fixtures`);
    console.log(`Allowed frontend origin: ${FRONTEND_ORIGIN}`);
});