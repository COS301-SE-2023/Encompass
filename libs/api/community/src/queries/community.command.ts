export class GetCommunityCommand {
    constructor(
        public readonly name: string,
        public readonly admin: string,
        public readonly about: string,
        public readonly members: string[],
        public readonly events: string[],
        public readonly posts: string[],
    ){}
}