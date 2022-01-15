import { CountyTransfer } from "./address.model";

export class SchoolLevelTransfer{
    constructor(
        public id: number,
        public name: string
    ){}
}

export class SchoolTypeTransfer{
    constructor(
        public id: number,
        public name: string
    ){}
}
export class RegisterSchoolInitialData{
    constructor(
        public countyTransfers: CountyTransfer[],
        public schoolLevelTransfers: SchoolLevelTransfer[],
        public schoolTypeTransfers: SchoolTypeTransfer[]

    ){}
}