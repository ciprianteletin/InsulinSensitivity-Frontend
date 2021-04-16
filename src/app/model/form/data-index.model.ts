/**
 * Interface used for passing data for calculating specific indexes to back-end.
 * Allows null values for optional information that is not needed every time.
 */
export interface DataIndexModel {
  fullName: string;
  age: number;
  gender: string;
  selectedIndexes: string[];
  glucoseMandatory: {
    fastingGlucose: number;
    glucoseThree: number;
    glucoseSix: number;
    glucoseOneTwenty: number;
    glucosePlaceholder: string;
  };
  insulinMandatory: {
    fastingInsulin: number;
    insulinThree: number;
    insulinSix: number;
    insulinOneTwenty: number;
    insulinPlaceholder: string;
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
