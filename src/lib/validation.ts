/**
 * Validation class
 */
export default class Validation {
  success: boolean;
  message: string;

  /**
   * Creates a new validation object
   * @param success if the validation was successful
   * @param message message to display if failed
   */
  constructor(success: boolean = true, message: string = '') {
    this.success = success;
    this.message = message;
  }
}
