// Import necessary modules for ticket service functionality.
import TicketTypeRequest from "./lib/TicketTypeRequest.js";
import InvalidPurchaseException from "./lib/InvalidPurchaseException.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";

// Define the TicketService class.
export default class TicketService {
  // Define private properties for ticket types and their prices.
  #ticketInfo = { ADULT: 20, CHILD: 10, INFANT: 0 };

  #totalAllowedTickets = 20;

  /**
   * Function to identify ticket type in the given input
   * @param {number[]} ticketTypeRequests - Number of tickets in each type (Adult, Child and Infant)
   * @returns {Object} Ticket details (type and counts)
   */
  #getTicketDetails(ticketTypeRequests) {
    let ticketDetails = {};

    for (let value of ticketTypeRequests) {
      // Create a TicketTypeRequest object for each ticket type request and store the details.
      let ticketReq = new TicketTypeRequest(
        Object.keys(value)[0],
        Object.values(value)[0]
      );
      ticketDetails[ticketReq.getTicketType()] = ticketReq.getNoOfTickets();
    }
    return ticketDetails;
  }

  /**
   * Calculate total amount to be paid
   * @param {Object} ticketDetails
   * @returns {number} - total cost for the tickets
   */
  #getAmountToPay(ticketDetails) {
    if (ticketDetails) {
      return (
        ticketDetails.ADULT * this.#ticketInfo.ADULT +
        (ticketDetails.CHILD || 0) * this.#ticketInfo.CHILD +
        (ticketDetails.INFANT || 0) * this.#ticketInfo.INFANT
      );
    }
  }

  /**
   * Method to validate the provided ticket details and account ID
   * @param {number} accountId - Given account ID
   * @param {Object} ticketDetails - Ticket details from the #getTicketDetails method
   */
  #validateTicketDetails(accountId, ticketReq) {
    // Calculate the total number of tickets from the ticket details.
    const totalTickets = Object.values(ticketReq.ticketDetails).reduce(
      (val1, val2) => val1 + val2,
      0
    );
    // Perform various validation checks and throw InvalidPurchaseException if any condition is not met.
    if (accountId <= 0) {
      throw new InvalidPurchaseException(
        "Account ID should be greater than Zero(0)."
      );
    }
    if (!ticketReq.ticketDetails.ADULT || ticketReq.ticketDetails.ADULT <= 0) {
      throw new InvalidPurchaseException(
        "There should be atleast one adult to book a ticket."
      );
    }
    if (totalTickets > this.#totalAllowedTickets) {
      throw new InvalidPurchaseException(
        `Maximum you can book ${this.#totalAllowedTickets} tickets at a time.`
      );
    }
    if (
      ticketReq.ticketDetails.INFANT >= 0 &&
      ticketReq.ticketDetails.INFANT > ticketReq.ticketDetails.ADULT
    ) {
      throw new InvalidPurchaseException(
        "Each Infant should be accompanying by an Adult. Since they will be sitting on an Adult's lap"
      );
    }
    if (!ticketReq.totalAmountToPay || ticketReq.totalAmountToPay === 0) {
      throw new InvalidPurchaseException(
        `Error in ticket price calculation. Please try again.`
      );
    }
    if (!ticketReq.totalSeats || ticketReq.totalSeats === 0) {
      throw new InvalidPurchaseException(
        `Error in seat count calculation. Please try again.`
      );
    }
  }

  /**
   * Method to purchase tickets for a given account.
   * @param {number} accountId
   * @param  {...number} ticketTypeRequests - Input should be head count of Adult, Child and Infant order.
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      // Get ticket details based on the provided request.
      const ticketDetails = this.#getTicketDetails(ticketTypeRequests);

      // Calculate the total number of seats and the amount to pay.
      const totalSeats = ticketDetails.ADULT + (ticketDetails.CHILD || 0);
      const totalAmountToPay = this.#getAmountToPay(ticketDetails);

      // Validate the provided ticket details and account information.
      this.#validateTicketDetails(accountId, {
        ticketDetails,
        totalAmountToPay,
        totalSeats,
      });

      // Make a payment using Ticket Payment Service (External).
      new TicketPaymentService().makePayment(accountId, totalAmountToPay);

      // Reserve seat(s) using Seat Reservation Service (External).
      new SeatReservationService().reserveSeat(accountId, totalSeats);

      // Log a success message with reservation details.
      console.log(
        `SUCCESS! Reservation completed with Seat(s) = ${totalSeats} & Total amount paid = £${totalAmountToPay}`
      );
    } catch (err) {
      // Handle and log any exceptions, specifically, InvalidPurchaseException.
      if (err instanceof InvalidPurchaseException) {
        console.log("ERROR IN RESERVATION: ", err.message);
      }
    }
  }
}

/**
 * TODO: To be removed after testing.
 * Create an instance of TicketService and purchase tickets with sample values for testing purpose.
 */
// new TicketService().purchaseTickets(
//   1,
//   { ADULT: 10 },
//   { CHILD: 9 },
//   { INFANT: 1 }
// );
