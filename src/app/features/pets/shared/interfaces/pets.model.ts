import { Pet } from "./pet.model";

export interface Pets {
  items: Array<Pet>;
  hasNext: boolean;
  remainingRecords: number;
}
