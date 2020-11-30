import {ApiProperty} from "@nestjs/swagger";

export class PaginatedData<T> {
    @ApiProperty({name: 'total', type: 'number'})
    public readonly total: number;

    @ApiProperty({name: 'pages', type: 'number'})
    public readonly pages: number;

    @ApiProperty({name: 'items', isArray: true, type: 'string'})
    public readonly items: T[];

    constructor(
        total: number,
        pages: number,
        items: T[],
    ) {
        this.total = total;
        this.pages = pages;
        this.items = items;
    }
}