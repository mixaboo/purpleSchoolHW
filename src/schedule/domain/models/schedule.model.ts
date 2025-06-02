export class ScheduleModel {
    _id: string;
    roomId: number;
    clientId: string;
    reservationDate:{
        begin: Date,
        end: Date
    };
    reservedAt: Date;
    active: boolean;
    paid: boolean;
}
