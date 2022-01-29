export class ResendEmailActivationRequest {

    public constructor(
        public email: string, 
        public localeStr: string) {

    }
}

export class EmailSentResponse {

    public constructor(
        public emailSent: boolean, 
        public error: string) {

    }
}


export class EmailActivationRequest {

    public constructor(
        public emailValidationCode: string, 
        public localeStr: string) {

    }
}
export class EmailActivationResponse {

    public constructor(
        public emailActivated: boolean,
        public error: string) {

    }
}

export class ValidateEmailRequest {

    public constructor(
        public email: string) {

    }
}

export class ActivateEmailRequest{
    public constructor(
        public email: string,
        public code: string
    ){}
}