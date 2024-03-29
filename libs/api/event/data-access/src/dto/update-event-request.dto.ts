export class UpdateEventRequest{
    name!: string | null;
    host!: string | null;
    community!: string | null;
    description!: string | null;
    startDate!: Date | null;
    endDate!: Date | null;
    members!: string[] | null;
    prompt!: string[] | null;
}
