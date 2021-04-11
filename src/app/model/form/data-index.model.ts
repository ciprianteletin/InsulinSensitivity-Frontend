/**
 * Interface used for passing data for calculating specific indexes to back-end.
 * Allows null values for optional information that is not needed every time.
 */
export interface DataIndexModel {
  username?: string;
  fullName: string;
  age: number;
  gender: string;
  selectedIndexes: string[];
  placeholders: {
    glucosePlaceholder: string;
    insulinPlaceholder: string;
  };
  glucoseMandatory: {
    fastingGlucose: number;
    glucoseThree: number;
    glucoseSix: number;
    glucoseOneTwenty: number;
  };
  insulinMandatory: {
    fastingInsulin: number;
    insulinThree: number;
    insulinSix: number;
    insulinOneTwenty: number;
  };
  optionalInformation: {
    height?: number;
    weight?: number;
    nefa?: number;
    hdl?: number;
    thyroglobulin?: number;
    triglyceride?: number;
  };
}
