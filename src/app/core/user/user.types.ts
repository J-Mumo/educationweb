export interface User
{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
}

export class RegisterRequest{
    public constructor(
        public adminFirstName: string,
        public adminSecondName: string,
        public adminPhoneNumber: string,
        public adminEmail: string,
        public schoolName: string,
        public wardId: number,
        public firstLine: string,
        public secondLine: string,
        public longitude: string,
        public latitude: string,
        public schoolTypeId: number,
        public schoolLevelId: number,
        public description: string,
        public password: string
    ){}
}
  