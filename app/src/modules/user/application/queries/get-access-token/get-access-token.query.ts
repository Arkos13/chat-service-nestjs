export class GetAccessTokenQuery {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {}
}