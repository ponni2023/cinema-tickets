// Import necessary modules for testing.
import assert from "chai";
import TicketService from "../src/pairtest/TicketService.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

describe("TicketService", () => {
  // Test cases for the purchaseTickets method.
  describe("purchaseTickets", () => {
    it("should successfully purchase tickets", () => {
      const ticketService = new TicketService();
      // Ensure no exceptions are thrown when purchasing tickets.
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 2, CHILD: 1, INFANT: 2 })
        )
        .not.to.throw();
    });

    it("should throw an InvalidPurchaseException when the account ID is less than or equal to 0", () => {
      const ticketService = new TicketService();

      assert
        .expect(() =>
          ticketService.purchaseTickets(0, { ADULT: 2, CHILD: 1, INFANT: 1 })
        )
        .to.throw(InvalidPurchaseException);
    });

    it("should throw an InvalidPurchaseException when there are no adult tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 0, CHILD: 2, INFANT: 1 })
        )
        .to.throw(InvalidPurchaseException);
    });

    it("should throw an InvalidPurchaseException when trying to book more than 20 tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 10, CHILD: 10, INFANT: 2 })
        )
        .to.throw(InvalidPurchaseException);
    });

    it("should throw an InvalidPurchaseException when infants are not accompanied by adults", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 2, CHILD: 0, INFANT: 3 })
        )
        .to.throw(InvalidPurchaseException);
    });

    it("should throw an InvalidPurchaseException when attempting to book negative child tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 2, CHILD: -1, INFANT: 3 })
        )
        .to.throw(InvalidPurchaseException);
    });

    it("should throw an InvalidPurchaseException when attempting to book negative infant tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 2, CHILD: 1, INFANT: -1 })
        )
        .to.throw(InvalidPurchaseException);
    });
    it("should successfully purchase tickets with the minimum number of tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() => ticketService.purchaseTickets(1, { ADULT: 1 }))
        .not.to.throw();
    });

    it("should successfully call the TicketPaymentServicetickets.makePayment method from TicketService", () => {
      const ticketService = new TicketService();
      ticketService.purchaseTickets(1, { ADULT: 1 });
      assert.expect(() =>
        new TicketPaymentService().makePayment().calledOnce()
      );
    });

    it("should successfully call the SeatReservationService.reserveSeat method from TicketService", () => {
      const ticketService = new TicketService();
      ticketService.purchaseTickets(1, { ADULT: 1 });
      assert.expect(() =>
        new SeatReservationService().reserveSeat().calledOnce()
      );
    });

    it("should successfully purchase tickets with only 5 adult tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() => ticketService.purchaseTickets(1, { ADULT: 5 }))
        .not.to.throw();
    });

    it("should successfully purchase tickets with no infants", () => {
      const ticketService = new TicketService();
      assert
        .expect(() => ticketService.purchaseTickets(1, { ADULT: 3, CHILD: 2 }))
        .not.to.throw();
    });

    it("should successfully purchase tickets with a mix of adult, child, and infant tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 10, CHILD: 5, INFANT: 5 })
        )
        .not.to.throw();
    });

    it("should successfully purchase tickets with the maximum allowed number of tickets (20)", () => {
      const ticketService = new TicketService();
      assert
        .expect(() => ticketService.purchaseTickets(1, { ADULT: 20 }))
        .not.to.throw();
    });

    it("should successfully purchase tickets with a large number of adult tickets (within the limit)", () => {
      const ticketService = new TicketService();
      assert
        .expect(() => ticketService.purchaseTickets(1, { ADULT: 18, CHILD: 2 }))
        .not.to.throw();
    });

    it("should successfully purchase tickets with infants accompanied by adults", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { ADULT: 10, INFANT: 10 })
        )
        .not.to.throw();
    });

    it("should successfully purchase tickets with a different order of adult, child, and infant tickets", () => {
      const ticketService = new TicketService();
      assert
        .expect(() =>
          ticketService.purchaseTickets(1, { INFANT: 3, ADULT: 5, CHILD: 2 })
        )
        .not.to.throw();
    });
  });
});
