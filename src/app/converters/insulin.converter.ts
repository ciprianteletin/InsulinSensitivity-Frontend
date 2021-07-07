/**
 * Class used mainly for converting values from one unit of measurement to another.
 */
export class InsulinConverter {

  constructor() {
  }

  public static roundValue(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  public checkEmptyConvertGlucose(value: string, placeholder: string): string {
    if (value === '') {
      return '';
    }
    return this.convertGlucose(value, placeholder);
  }

  public checkEmptyConvertCholesterol(value: string, placeholder: string): string {
    if (value === '') {
      return '';
    }
    return this.convertCholesterol(value, placeholder);
  }

  public checkEmptyConvertTriglycerides(value: string, placeholder: string): string {
    if (value === '') {
      return '';
    }
    return this.convertTriglycerides(value, placeholder);
  }

  convertMgAndMmol(model: any, currentPlaceholder: string): any {
    return {
      ...model,
      fastingGlucose: this.convertGlucose(model.fastingGlucose, currentPlaceholder),
      glucoseThree: this.convertGlucose(model.glucoseThree, currentPlaceholder),
      glucoseSix: this.convertGlucose(model.glucoseSix, currentPlaceholder),
      glucoseOneTwenty: this.convertGlucose(model.glucoseOneTwenty, currentPlaceholder),
      nefa: this.convertNefa(model.nefa, currentPlaceholder),
      hdl: this.convertCholesterol(model.hdl, currentPlaceholder),
      triglyceride: this.convertTriglycerides(model.triglyceride, currentPlaceholder)
    };
  }

  convertUiAndPmol(model: any, currentPlaceholder: string): any {
    return {
      ...model,
      fastingInsulin: this.convertInsulin(model.fastingInsulin, currentPlaceholder),
      insulinThree: this.convertInsulin(model.insulinThree, currentPlaceholder),
      insulinSix: this.convertInsulin(model.insulinSix, currentPlaceholder),
      insulinOneTwenty: this.convertInsulin(model.insulinOneTwenty, currentPlaceholder)
    };
  }

  public convertGlucose(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val / 18;
    } else {
      val = val * 18;
    }
    return val.toString();
  }

  private convertInsulin(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'pmol/L') {
      val = val / 6;
    } else {
      val = val * 6;
    }
    return val.toString();
  }

  private convertNefa(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val * 0.35;
    } else {
      val = val / 0.35;
    }
    return val.toString();
  }

  private convertTriglycerides(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val * 0.01129;
    } else {
      val = val / 0.01129;
    }
    return val.toString();
  }

  private convertCholesterol(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val / 38.67;
    } else {
      val = val * 38.67;
    }
    return val.toString();
  }
}

