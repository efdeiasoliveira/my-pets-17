import { Owner } from "./owner.model";

export interface Owners {
  items: Array<Owner>;
  hasNext: boolean;
  remainingRecords: number;
}
