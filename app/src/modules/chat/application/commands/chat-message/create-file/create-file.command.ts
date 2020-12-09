export class CreateFileCommand {
    constructor(
        public readonly id: string,
        public readonly path: string,
        public readonly mimeType: string,
        public readonly originalName: string,
        public readonly name: string,
        public readonly size: number,
    ) {}
}