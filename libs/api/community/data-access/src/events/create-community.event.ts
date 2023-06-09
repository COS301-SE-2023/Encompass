export class CommunityCreatedEvent {
    constructor(public readonly communityId: string | null | undefined) {}
}