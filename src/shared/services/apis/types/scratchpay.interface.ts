export interface IDentalResponse {
  name: string;
  stateName: string;
  availability: Availability;
}

export interface Availability {
  from: string;
  to: string;
}

export interface IVetResponse {
  clinicName: string;
  stateCode: string;
  opening: Opening;
}

export interface Opening {
  from: string;
  to: string;
}
