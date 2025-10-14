// The Factory Method Design Pattern is a creational pattern that provides an interface for creating objects in a superclass,
//  but allows subclasses to alter the type of objects that will be created.

// It’s particularly useful in situations where:
// The exact type of object to be created isn't known until runtime.
// Object creation logic is complex, repetitive, or needs encapsulation.
// You want to follow the Open/Closed Principle, open for extension, closed for modification.

// When you have multiple objects of similar type, you might start with basic conditional logic
// (like if-else or switch statements) to decide which object to create.

// But as your application grows, this approach becomes rigid, harder to test, and tightly couples your code to specific classes,
//  violating key design principles.

// Factory method lets you create different objects without tightly coupling your code to specific classes.

// Core Components-
// The Factory Method pattern consists of three key components:
// 1. Product Interface
// This defines the interface for the objects the factory method creates. It ensures that all products share a common interface.
// 2. Concrete Products
// These are specific implementations of the product interface. Each concrete product represents a different type of object that can be created.
// 3. Creator (Factory)
// This is an abstract class or interface that declares the factory method, which returns an object of the product type. It may also include some default implementation.
// 4. Concrete Creators
// These are subclasses of the creator that implement the factory method to instantiate and return specific concrete products.

//Example of VIOLATION

class EmailNotification {
  send(message: string): void {
    console.log("Sending an Email notification...");
  }
}

class SMSNotification {
  send(message: string): void {
    console.log("Sending an SMS notification...");
  }
}

class NotificationService {
  sendNotification(type: string, message: string): void {
    if (type === "EMAIL") {
      const email = new EmailNotification();
      email.send(message);
    } else if (type === "SMS") {
      const sms = new SMSNotification();
      sms.send(message);
    }
  }
} //Kl nu koi nva notification type add krna h to hme NotificationFactory class m jake code modify krna pdega
//  jo ki open closed principle k against h

// Example of Simple Factory
class SimpleNotificationFactory {
  static createNotification(type: string): Notification {
    switch (type) {
      case "EMAIL":
        return new EmailNotification();
      case "SMS":
        return new SMSNotification();
      case "PUSH":
        return new PushNotification();
      default:
        throw new Error("Unknown type");
    }
  }
}

class NotificationService {
  sendNotification(type: string, message: string): void {
    const notification = SimpleNotificationFactory.createNotification(type);
    notification.send(message);
  }
}

// Above code is better but still not perfect as we have to modify the factory class if we want to add new notification type

//Factory Method Design Pattern-
// The Factory Method Pattern takes the idea of object creation and hands it off to subclasses.
// Instead of one central factory deciding what to create, you delegate the responsibility to specialized classes that know exactly
// what they need to produce.

//Product Interface
interface Notification {
  send(message: string): void;
}

// Concrete Products
class EmailNotification implements Notification {
  send(message: string): void {
    console.log("Sending an Email notification...");
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log("Sending an SMS notification...");
  }
}

class PushNotification implements Notification {
  send(message: string): void {
    console.log("Sending a Push notification...");
  }
}

// Creator (Factory)
abstract class NotificationCreator {
  abstract createNotification(): Notification;

  sendNotification(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

// Concrete Creators
class EmailNotificationFactory extends NotificationCreator {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSNotificationFactory extends NotificationCreator {
  createNotification(): Notification {
    return new SMSNotification();
  }
}

class PushNotificationFactory extends NotificationCreator {
  createNotification(): Notification {
    return new PushNotification();
  }
}

// Usage example:
function clientCode(factory: NotificationCreator, message: string) {
  factory.sendNotification(message);
}

const emailFactory = new EmailNotificationFactory();
clientCode(emailFactory, "Hello via Email!");

const smsFactory = new SMSNotificationFactory();
clientCode(smsFactory, "Hello via SMS!");

const pushFactory = new PushNotificationFactory();
clientCode(pushFactory, "Hello via Push Notification!");

//OR

class FactoryMethodDemo {
  static main(): void {
    let creator: NotificationCreator;

    // Send Email
    creator = new EmailNotificationFactory();
    creator.sendNotification("Welcome to our platform!");

    // Send SMS
    creator = new SMSNotificationFactory();
    creator.sendNotification("Your OTP is 123456");

    // Send Push Notification
    creator = new PushNotificationFactory();
    creator.sendNotification("You have a new follower!");
  }
}

FactoryMethodDemo.main();
