export class CoefficientCell {
  isSuccess: boolean;

  id: number;

  coefficient: number;

  constructor(id: number, coefficient: number) {
    this.id = id;
    this.coefficient = coefficient;
    this.isSuccess = coefficient <= 1.99 ? true : false;
  }

  toString() {
    return {
      id: this.id,
      coefificient: this.coefficient,
      isSuccess: this.isSuccess,
    }.toString();
  }
}
