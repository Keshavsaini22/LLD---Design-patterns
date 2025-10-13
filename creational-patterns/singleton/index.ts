//Singleton Pattern is a creational design pattern that guarantees a class has only one instance and provides a global point of access to it.

// Core Components-
// The Singleton pattern consists of three key components:
// 1. Private Constructor
// The constructor is made private to prevent external instantiation using the new operator. This ensures that only the class itself can create instances.
// 2. Static Instance Variable
// A private static member variable holds the single instance of the class. This variable is shared across all potential references to the class.
// 3. Static Factory Method
// A public static method (typically called getInstance()) provides controlled access to the singleton instance. This method implements the logic for creating the instance on first access or returning the existing one


// Singleton is useful in scenarios like:
// Managing Shared Resources (database connections, thread pools, caches, configuration settings)
// Coordinating System-Wide Actions (logging, print spoolers, file managers)
// Managing State (user session, application state)

//There are several ways to implement the Singleton pattern in TypeScript.
// Below is a common approach using a class with a private constructor and a static method to get the instance.

class Singleton {
  private static instance: Singleton;

  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialization code here
  }

  // Static method to get the single instance of the class
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  // Example method to demonstrate functionality
  public someMethod() {
    console.log("Method called on singleton instance");
  }
}

// Usage example:
const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();

console.log(singleton1 === singleton2); // true, both references point to the same instance
singleton1.someMethod();
