export class InsulinConverter {

  constructor() {
  }

  convertMgAndMmol(model: any, currentPlaceholder: string): any {
    return {
      ...model,
      fastingGlucose: this.convertGlucose(model.fastingGlucose, currentPlaceholder),
      glucoseThree: this.convertGlucose(model.glucoseThree, currentPlaceholder),
      glucoseSix: this.convertGlucose(model.glucoseSix, currentPlaceholder),
      glucoseOneTwenty: this.convertGlucose(model.glucoseOneTwenty, currentPlaceholder),
      nefa: this.convertNefa(model.nefa, currentPlaceholder),
      hdl: this.convertHDL(model.hdl, currentPlaceholder),
      triglyceride: this.convertTriglicerides(model.triglyceride, currentPlaceholder)
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

  private roundValue(value: number): number {
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
  }

  private convertGlucose(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val / 18;
    } else {
      val = val * 18;
    }
    val = this.roundValue(val);
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
    val = this.roundValue(val);
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
    val = this.roundValue(val);
    return val.toString();
  }

  private convertTriglicerides(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val * 0.01129;
    } else {
      val = val / 0.01129;
    }
    val = this.roundValue(val);
    return val.toString();
  }

  private convertHDL(value: string, currentPlaceholder: string): string {
    if (value === undefined || isNaN(Number(value))) {
      return undefined;
    }
    let val = +value;
    if (currentPlaceholder === 'mg/dL') {
      val = val / 38.67;
    } else {
      val = val * 38.67;
    }
    val = this.roundValue(val);
    return val.toString();
  }
}

