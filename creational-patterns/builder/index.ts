// The Builder Design Pattern is a creational pattern that lets you construct complex objects step-by-step,
//  separating the construction logic from the final representation.

// It’s particularly useful in situations where:
// An object requires many optional fields, and not all of them are needed every time.
// You want to avoid telescoping constructors or large constructors with multiple parameters.
// The object construction process involves multiple steps that need to happen in a particular order.

//The Problem: Building Complex HttpRequest Objects
// Let's say we want to create an HttpRequest object that can have various optional parameters like headers, body, query parameters, etc.
// Without the Builder pattern, we might end up with a constructor that has many parameters, leading to confusion and errors.

class HttpRequestTelescoping {
  private url: string;
  private method: string;
  private headers: Map<string, string>;
  private queryParams: Map<string, string>;
  private body: string | null;
  private timeout: number;

  constructor(url: string);
  constructor(url: string, method: string);
  constructor(url: string, method: string, headers: Map<string, string>);
  constructor(url: string, method: string, headers: Map<string, string>, queryParams: Map<string, string>);
  constructor(
    url: string,
    method: string,
    headers: Map<string, string>,
    queryParams: Map<string, string>,
    body: string
  );
  constructor(
    url: string,
    method: string,
    headers: Map<string, string>,
    queryParams: Map<string, string>,
    body: string,
    timeout: number
  );
  constructor(
    url: string,
    method: string = "GET",
    headers: Map<string, string> | null = null,
    queryParams: Map<string, string> | null = null,
    body: string | null = null,
    timeout: number = 30000
  ) {
    this.url = url;
    this.method = method;
    this.headers = headers === null ? new Map() : headers;
    this.queryParams = queryParams === null ? new Map() : queryParams;
    this.body = body;
    this.timeout = timeout;

    console.log(
      `HttpRequest Created: URL=${url}, Method=${method}, Headers=${this.headers.size}, Params=${
        this.queryParams.size
      }, Body=${body !== null}, Timeout=${timeout}`
    );
  }

  // Getters could be added here
}
// Usage of the telescoping constructor
class HttpAppTelescoping {
  static main(): void {
    const req1 = new HttpRequestTelescoping("https://api.example.com/data");

    const req2 = new HttpRequestTelescoping("https://api.example.com/submit", "POST", null, null, '{"key":"value"}');

    const req3 = new HttpRequestTelescoping(
      "https://api.example.com/config",
      "PUT",
      new Map([["X-API-Key", "secret"]]),
      null,
      "config_data",
      5000
    );
  }
}

HttpAppTelescoping.main();

//What is wrong with this approach?
// 1. Hard to read and write
// 2. Error-prone
// 3. Inflexible
// 4. Poor scalability

//The Solution: Implementing the Builder Pattern
// The Builder pattern separates the construction of a complex object from its representation.

//Components
// 1. Product: The complex object that is being built (HttpRequest).
// 2. Builder: An interface or abstract class defining the steps to build the product.
// 3. Concrete Builder: A class that implements the Builder interface and provides specific implementations for the steps.
// 4. Director (optional): A class that controls the construction process using a Builder instance.

// Product
class HttpRequest {
  private url: string;
  private method: string;
  private headers: Map<string, string>;
  private queryParams: Map<string, string>;
  private body: string | null;
  private timeout: number;

  constructor(
    url: string,
    method: string,
    headers: Map<string, string>,
    queryParams: Map<string, string>,
    body: string | null,
    timeout: number
  ) {
    this.url = url;
    this.method = method;
    this.headers = headers;
    this.queryParams = queryParams;
    this.body = body;
    this.timeout = timeout;

    console.log(
      `HttpRequest Created: URL=${url}, Method=${method}, Headers=${headers.size}, Params=${queryParams.size}, Body=${
        body !== null
      }, Timeout=${timeout}`
    );
  }

  // Getters could be added here
}

// Builder Interface
interface HttpRequestBuilder {
  setUrl(url: string): HttpRequestBuilder;
  setMethod(method: string): HttpRequestBuilder;
  addHeader(key: string, value: string): HttpRequestBuilder;
  addQueryParam(key: string, value: string): HttpRequestBuilder;
  setBody(body: string): HttpRequestBuilder;
  setTimeout(timeout: number): HttpRequestBuilder;
  build(): HttpRequest;
}

// Concrete Builder
class ConcreteHttpRequestBuilder implements HttpRequestBuilder {
  private url: string = "";
  private method: string = "GET";
  private headers: Map<string, string> = new Map();
  private queryParams: Map<string, string> = new Map();
  private body: string | null = null;
  private timeout: number = 30000;

  setUrl(url: string): HttpRequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: string): HttpRequestBuilder {
    this.method = method;
    return this;
  }

  addHeader(key: string, value: string): HttpRequestBuilder {
    this.headers.set(key, value);
    return this;
  }

  addQueryParam(key: string, value: string): HttpRequestBuilder {
    this.queryParams.set(key, value);
    return this;
  }

  setBody(body: string): HttpRequestBuilder {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): HttpRequestBuilder {
    this.timeout = timeout;
    return this;
  }

  build(): HttpRequest {
    return new HttpRequest(this.url, this.method, this.headers, this.queryParams, this.body, this.timeout);
  }
}

// Director (optional)
class HttpRequestDirector {
  private builder: HttpRequestBuilder;

  constructor(builder: HttpRequestBuilder) {
    this.builder = builder;
  }

  constructSimpleGetRequest(url: string): HttpRequest {
    return this.builder.setUrl(url).setMethod("GET").build();
  }

  constructPostRequest(url: string, body: string): HttpRequest {
    return this.builder.setUrl(url).setMethod("POST").setBody(body).build();
  }
}

// Usage of the Builder pattern
class HttpAppBuilder {
  static main(): void {
    const builder = new ConcreteHttpRequestBuilder();

    const req1 = builder.setUrl("https://api.example.com/data").build();

    const req2 = builder.setUrl("https://api.example.com/submit").setMethod("POST").setBody('{"key":"value"}').build();

    const req3 = builder
      .setUrl("https://api.example.com/config")
      .setMethod("PUT")
      .addHeader("X-API-Key", "secret")
      .setBody("config_data")
      .setTimeout(5000)
      .build();

    // Using Director
    const director = new HttpRequestDirector(new ConcreteHttpRequestBuilder());
    const req4 = director.constructSimpleGetRequest("https://api.example.com/simple");
    const req5 = director.constructPostRequest("https://api.example.com/post", '{"data":"value"}');
  }
}

HttpAppBuilder.main();
