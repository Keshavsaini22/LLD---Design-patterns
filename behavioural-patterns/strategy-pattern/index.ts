// The Strategy Design Pattern is a behavioral design pattern that lets you define a family
// of algorithms, put each one into a separate class, and makes their objects interchangeable
//  — allowing the algorithm to vary independently from the clients that use it. 
// It enables selecting an algorithm dynamically based on the context or specific requirements.

// It’s particularly useful in situations where:
// You have multiple ways to perform a task or calculation.
// The behavior of a class needs to change dynamically at runtime.
// You want to avoid cluttering your code with conditional logic (like if-else or switch
//  statements) for every variation.


// When you have multiple ways to achieve the same goal, you might use branching logic 
// inside a class to handle different cases. For example, a PaymentService might use 
// if-else to choose between credit card, cash, or UPI.But as more payment types are 
// added, this approach becomes hard to scale, violates the Open/Closed Principle, and 
// makes your code harder to test and maintain.

//The Problem - Shipping cost calculation

// Let's say we have an e-commerce application that needs to calculate shipping costs
// based on different shipping strategies- flat rate, weight-based, and express shipping.
//Naive approach
class ShippingCostCalculatorNaive {
    calculateShippingCost(order: Order, strategyType: string): number {
        let cost = 0.0;

        if (strategyType.toUpperCase() === "FLAT_RATE") {
            console.log("Calculating with Flat Rate strategy.");
            cost = 10.0;

        } else if (strategyType.toUpperCase() === "WEIGHT_BASED") {
            console.log("Calculating with Weight-Based strategy.");
            cost = order.getTotalWeight() * 2.5;

        } else if (strategyType.toUpperCase() === "DISTANCE_BASED") {
            console.log("Calculating with Distance-Based strategy.");
            if (order.getDestinationZone() === "ZoneA") {
                cost = 5.0;
            } else if (order.getDestinationZone() === "ZoneB") {
                cost = 12.0;
            } else {
                cost = 20.0; // fallback
            }

        } else if (strategyType.toUpperCase() === "THIRD_PARTY_API") {
            console.log("Calculating with Third-Party API strategy.");
            // Simulated external call
            cost = 7.5 + (order.getOrderValue() * 0.02);

        } else {
            throw new Error("Unknown shipping strategy: " + strategyType);
        }

        console.log("Calculated Shipping Cost: $" + cost);
        return cost;
    }
}
//client code
class ECommerceAppV1 {
   static main(): void {
       const calculator = new ShippingCostCalculatorNaive();
       const order1 = new Order();

       console.log("--- Order 1 ---");
       calculator.calculateShippingCost(order1, "FLAT_RATE");
       calculator.calculateShippingCost(order1, "WEIGHT_BASED");
       calculator.calculateShippingCost(order1, "DISTANCE_BASED");
       calculator.calculateShippingCost(order1, "THIRD_PARTY_API");

       // What if we want to try a new "PremiumZone" strategy?
       // We have to go modify this calculator class again...
   }
}

// Refactored approach using Strategy Pattern
//Key Components:

// Strategy Interface
interface ShippingStrategy {
   calculateCost(order: Order): number;
}
// Concrete Strategies
class FlatRateShipping implements ShippingStrategy {
   private rate: number;

   constructor(rate: number) {
       this.rate = rate;
   }

   calculateCost(order: Order): number {
       console.log("Calculating with Flat Rate strategy ($" + this.rate + ")");
       return this.rate;
   }
}
class WeightBasedShipping implements ShippingStrategy {
   private readonly ratePerKg: number;

   constructor(ratePerKg: number) {
       this.ratePerKg = ratePerKg;
   }

   calculateCost(order: Order): number {
       console.log("Calculating with Weight-Based strategy ($" + this.ratePerKg + "/kg)");
       return order.getTotalWeight() * this.ratePerKg;
   }
}

class DistanceBasedShipping implements ShippingStrategy {
   private ratePerKm: number;

   constructor(ratePerKm: number) {
       this.ratePerKm = ratePerKm;
   }

   calculateCost(order: Order): number {
       console.log("Calculating with Distance-Based strategy for zone: " + order.getDestinationZone());
       switch (order.getDestinationZone()) {
           case "ZoneA":
               return this.ratePerKm * 5.0;
           case "ZoneB":
               return this.ratePerKm * 7.0;
           default:
               return this.ratePerKm * 10.0;
       }
   }
}

class ThirdPartyApiShipping implements ShippingStrategy {
   private readonly baseFee: number;
   private readonly percentageFee: number;

   constructor(baseFee: number, percentageFee: number) {
       this.baseFee = baseFee;
       this.percentageFee = percentageFee;
   }

   calculateCost(order: Order): number {
       console.log("Calculating with Third-Party API strategy.");
       // Simulate API call
       return this.baseFee + (order.getOrderValue() * this.percentageFee);
   }
}

class ShippingCostService {
   private strategy: ShippingStrategy;

   // Constructor to set initial strategy
   constructor(strategy: ShippingStrategy) {
       this.strategy = strategy;
   }

   // Method to change strategy at runtime
   setStrategy(strategy: ShippingStrategy): void {
       console.log("ShippingCostService: Strategy changed to " + strategy.constructor.name);
       this.strategy = strategy;
   }

   calculateShippingCost(order: Order): number {
       if (!this.strategy) {
           throw new Error("Shipping strategy not set.");
       }
       const cost = this.strategy.calculateCost(order);
       console.log("ShippingCostService: Final Calculated Shipping Cost: $" + cost +
                  " (using " + this.strategy.constructor.name + ")");
       return cost;
   }
}

class ECommerceAppV2 {
   static main(): void {
       const order1 = new Order();

       // Create different strategy instances
       const flatRate: ShippingStrategy = new FlatRateShipping(10.0);
       const weightBased: ShippingStrategy = new WeightBasedShipping(2.5);
       const distanceBased: ShippingStrategy = new DistanceBasedShipping(5.0);
       const thirdParty: ShippingStrategy = new ThirdPartyApiShipping(7.5, 0.02);

       // Create context with an initial strategy
       const shippingService = new ShippingCostService(flatRate);

       console.log("--- Order 1: Using Flat Rate (initial) ---");
       shippingService.calculateShippingCost(order1);

       console.log("\n--- Order 1: Changing to Weight-Based ---");
       shippingService.setStrategy(weightBased);
       shippingService.calculateShippingCost(order1);

       console.log("\n--- Order 1: Changing to Distance-Based ---");
       shippingService.setStrategy(distanceBased);
       shippingService.calculateShippingCost(order1);

       console.log("\n--- Order 1: Changing to Third-Party API ---");
       shippingService.setStrategy(thirdParty);
       shippingService.calculateShippingCost(order1);

       // Adding a NEW strategy is easy:
       // 1. Create a new class implementing ShippingStrategy (e.g., FreeShippingStrategy)
       // 2. Client can then instantiate and use it:
       //    const freeShipping: ShippingStrategy = new FreeShippingStrategy();
       //    shippingService.setStrategy(freeShipping);
       //    shippingService.calculateShippingCost(primeMemberOrder);
       // No modification to ShippingCostService is needed!
   }
}