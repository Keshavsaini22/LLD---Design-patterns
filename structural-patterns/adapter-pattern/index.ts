//The Adapter pattern is a structural design pattern that acts as a bridge between two incompatible interfaces, allowing them to work together seamlessly.

// The Adapter Design Pattern is a structural design pattern that allows incompatible interfaces
// to work together by converting the interface of one class into another that the client expects.

// It’s particularly useful in situations where:
// You’re integrating with a legacy system or a third-party library that doesn’t match your current interface.
// You want to reuse existing functionality without modifying its source code.
// You need to bridge the gap between new and old code, or between systems built with different interface designs.

// When faced with incompatible interfaces, developers often resort to rewriting large parts of code or embedding conditionals like if (legacyType) to handle special cases. For example, a PaymentProcessor might use if-else logic to handle both a modern StripeService and a legacy BankTransferAPI.
// But as more incompatible services or modules are introduced, this approach quickly becomes messy, tightly coupled, and violates the Open/Closed Principle making the system hard to scale or refactor.
// The Adapter Pattern solves this by introducing a wrapper class that sits between your system and the incompatible component. It translates calls from your interface into calls the legacy or third-party system understands  without changing either side.


// Key Components
// Target Interface — The interface that the client expects and uses. This defines the operations available to the client.
// Adaptee — The existing class with an incompatible interface that needs to be integrated. This is the class that cannot be directly used by the client because its interface doesn't match what's needed.
// Adapter — The bridge class that implements the target interface and internally uses the adaptee. The adapter transforms requests from the client into a format the adaptee understands.
// Client — The code that uses the target interface, remaining unaware of the adapter or adaptee details.

// How It Works
// The Adapter pattern follows a specific workflow:​
// The client calls a method on the adapter using the target interface
// The adapter maps or transforms the client's request into a format the adaptee understands
// The adaptee performs the actual operation based on the transformed request
// The client receives the results, unaware of the adaptation happening behind the scenes

// Two types of adapters:
// Class Adapter: Uses multiple inheritance to adapt one interface to another. This is less common in languages that do not support multiple inheritance.
// Object Adapter: Uses composition to hold an instance of the adaptee and delegates calls to it. This is the more common and flexible approach.


// Example Scenario: Payment Processing System

// Let's say we have a payment processing system that needs to integrate with a legacy payment gateway. The legacy gateway has a different interface than what our system expects. We can use the Adapter pattern to bridge this gap.
// Target Interface
interface PaymentProcessor {
    processPayment(amount: number): void;
}

// Adaptee: Legacy Payment Gateway with an incompatible interface
class LegacyGateway {
    executeTransaction(amount: number, currency: string): void {
        console.log(`Processing ${amount} in ${currency} through Legacy Gateway.`);
    }
    getReferenceNumber(): number {
        return Math.floor(Math.random() * 1000000);
    }
    checkStatus(refNumber: number): boolean {
        console.log(`Checking status for reference number: ${refNumber}`);
        return true; // Simulate a successful transaction
    }
}

// Adapter: Bridges the PaymentProcessor interface to the LegacyGateway
class LegacyGatewayAdapter implements PaymentProcessor {
   private readonly legacyGateway: LegacyGateway;
   private currentRef: number;

   constructor(legacyGateway: LegacyGateway) {
       this.legacyGateway = legacyGateway;
   }

   processPayment(amount: number, currency: string): void {
       console.log("Adapter: Translating processPayment() for " + amount + " " + currency);
       this.legacyGateway.executeTransaction(amount, currency);
       this.currentRef = this.legacyGateway.getReferenceNumber(); // Store for later use
   }

   isPaymentSuccessful(): boolean {
       return this.legacyGateway.checkStatus(this.currentRef);
   }

   getTransactionId(): string {
       return "LEGACY_TXN_" + this.currentRef;
   }
}