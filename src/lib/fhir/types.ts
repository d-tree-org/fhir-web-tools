export type Patient = {
    id: string,
    locationId: string,
    identifier: string,
    name: string,
    firstName: string,
    lastName: string,
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
    links: {
        name: string,
        id: string,
        initials: string;
    }[]
}