export class SaveResponseWithId{
    constructor(
        public saved: boolean,
        public error: string,
        public savedId: number
    ){}
}