export default class InvalidPurchaseException extends Error {
  constructor(errorMsg) {
    super(errorMsg); // constructor of the parent class 'Error'
    this.name = "purchaseError";
  }
}
