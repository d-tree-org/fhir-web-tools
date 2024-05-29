export type Patient = {
    id: string,
    identifier: string,
    name: string,
    gender: string,
    birthDate: string,
    active: boolean,
    address: {facility:string, physical: string}[],
    registrationDate: string,
    registratedBy: string,
    phoneNumbers: {
        number: string,
        owner: string,
    }[],
}