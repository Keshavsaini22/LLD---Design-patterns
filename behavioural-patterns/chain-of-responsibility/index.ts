// The Chain of Responsibility Design Pattern is a behavioral pattern that lets you pass requests along a chain of handlers,
// allowing each handler to decide whether to process the request or pass it to the next handler in the chain.

// It’s particularly useful in situations where:
// A request must be handled by one of many possible handlers, and you don’t want the sender to be tightly coupled to any specific one.
// You want to decouple request logic from the code that processes it.
// You want to flexibly add, remove, or reorder handlers without changing the client code.

//The problem : Handling HTTP Requests
// Imagine you’re building a backend server that processes incoming HTTP requests for a web application or RESTful API.

//Naive Approach
class Request {
  public user: string;
  public userRole: string;
  public requestCount: number;
  public payload: string;

  constructor(user: string, role: string, requestCount: number, payload: string) {
    this.user = user;
    this.userRole = role;
    this.requestCount = requestCount;
    this.payload = payload;
  }
}
// Each incoming request must go through a sequence of processing steps before it reaches the core business logic.
// Common Pre-processing Steps
// Authentication – Is the user properly authenticated (e.g., via token or session)?
// Authorization – Is the authenticated user allowed to perform this action?
// Rate Limiting – Has the user exceeded their allowed number of requests?
// Data Validation – Is the request payload well-formed and valid?

// Only after all these checks pass should the request reach the actual business logic
// (e.g., creating a resource, returning data, or updating a record).

// A typical first attempt might look like this: implement all logic inside a single
// class using a long chain of if-else or method calls.

class RequestHandler {
  handle(request: Request): void {
    if (!this.authenticate(request)) {
      console.log("Request Rejected: Authentication failed.");
      return;
    }

    if (!this.authorize(request)) {
      console.log("Request Rejected: Authorization failed.");
      return;
    }

    if (!this.rateLimit(request)) {
      console.log("Request Rejected: Rate limit exceeded.");
      return;
    }

    if (!this.validate(request)) {
      console.log("Request Rejected: Invalid payload.");
      return;
    }

    console.log("Request passed all checks. Executing business logic...");
    // Proceed to business logic
  }

  private authenticate(req: Request): boolean {
    return req.user !== null;
  }

  private authorize(req: Request): boolean {
    return req.userRole === "ADMIN";
  }

  private rateLimit(req: Request): boolean {
    return req.requestCount < 100;
  }

  private validate(req: Request): boolean {
    return req.payload !== null && req.payload.trim() !== "";
  }
}

class App {
  static main(): void {
    const req = new Request("john_doe", "ADMIN", 42, "{ 'data': 123 }");
    const handler = new RequestHandler();
    handler.handle(req);
  }
}

//Why this is a problem?
//Hard to extend or modify
//Poor separation of concerns
//No reusability
//Inflexible Configuration

//What we really need is
//Break each step into its own unit of responsibility
//Chain these units together dynamically
//Allow each unit to decide whether to process the request or pass it along

//Key Components of the Pattern
//Handler Interface: Declares a method for building the chain and a method for handling requests.
//Concrete Handlers: Implement the handler interface and define specific processing logic.
//Client: Configures the chain of handlers and initiates the request processing.

interface RequestHandler {
  setNext(next: RequestHandler): void;
  handle(request: Request): void;
}

//TO avoid duplicating the setNext() and forwarding logic in every handler, we
// define an abstract base class with reusable functionality.

abstract class BaseHandler implements RequestHandler {
  protected next: RequestHandler | null = null;

  setNext(next: RequestHandler): void {
    this.next = next;
  }

  protected forward(request: Request): void {
    if (this.next !== null) {
      this.next.handle(request);
    }
  }
}

//Concrete handlers
class AuthHandler extends BaseHandler {
  handle(request: Request): void {
    if (request.user === null) {
      console.log("AuthHandler: ❌ User not authenticated.");
      return; // Stop the chain
    }
    console.log("AuthHandler: ✅ Authenticated.");
    this.forward(request);
  }
}

class AuthorizationHandler extends BaseHandler {
  handle(request: Request): void {
    if (request.userRole !== "ADMIN") {
      console.log("AuthorizationHandler: ❌ Access denied.");
      return;
    }
    console.log("AuthorizationHandler: ✅ Authorized.");
    this.forward(request);
  }
}
class RateLimitHandler extends BaseHandler {
  handle(request: Request): void {
    if (request.requestCount >= 100) {
      console.log("RateLimitHandler: ❌ Rate limit exceeded.");
      return;
    }
    console.log("RateLimitHandler: ✅ Within rate limit.");
    this.forward(request);
  }
}
class ValidationHandler extends BaseHandler {
  handle(request: Request): void {
    if (request.payload === null || request.payload.trim() === "") {
      console.log("ValidationHandler: ❌ Invalid payload.");
      return;
    }
    console.log("ValidationHandler: ✅ Payload valid.");
    this.forward(request);
  }
}

class BusinessLogicHandler extends BaseHandler {
  handle(request: Request): void {
    console.log("BusinessLogicHandler: 🚀 Processing request...");
    // Core application logic goes here
  }
}

//Assemble the Chain in Client code
class RequestHandlerApp {
  static main(): void {
    // Create handlers
    const auth: RequestHandler = new AuthHandler();
    const authorization: RequestHandler = new AuthorizationHandler();
    const rateLimit: RequestHandler = new RateLimitHandler();
    const validation: RequestHandler = new ValidationHandler();
    const businessLogic: RequestHandler = new BusinessLogicHandler();

    // Build the chain
    auth.setNext(authorization);
    authorization.setNext(rateLimit);
    rateLimit.setNext(validation);
    validation.setNext(businessLogic);

    // Send a request through the chain
    const request = new Request("john", "ADMIN", 10, '{ "data": "valid" }');
    auth.handle(request);

    console.log("\n--- Trying an invalid request ---");
    const badRequest = new Request(null, "USER", 150, "");
    auth.handle(badRequest);
  }
}
