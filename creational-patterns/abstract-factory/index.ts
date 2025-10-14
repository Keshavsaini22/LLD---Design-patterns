// The Abstract Factory Design Pattern is a creational pattern that provides an interface
// for creating families of related or dependent objects without specifying their concrete classes.

// It’s particularly useful in situations where:
// You need to create objects that must be used together and are part of a consistent family (e.g., GUI elements like buttons, checkboxes, and menus).
// Your system must support multiple configurations, environments, or product variants (e.g., light vs. dark themes, Windows vs. macOS look-and-feel).
// You want to enforce consistency across related objects, ensuring that they are all created from the same factory.

// The Problem: Platform-Specific UI
// Imagine you're building a cross-platform desktop application that must support both Windows and macOS.
// To provide a good user experience, your application should render native-looking UI components for each operating system like:
// Buttons
// Checkboxes
// Text fields
// Menus

class WindowsButton {
  paint(): void {
    console.log("Painting a Windows-style button.");
  }

  onClick(): void {
    console.log("Windows button clicked.");
  }
}

class WindowsCheckbox {
  paint(): void {
    console.log("Painting a Windows-style checkbox.");
  }

  onSelect(): void {
    console.log("Windows checkbox selected.");
  }
}

class MacOSButton {
  paint(): void {
    console.log("Painting a macOS-style button.");
  }

  onClick(): void {
    console.log("macOS button clicked.");
  }
}

class MacOSCheckbox {
  paint(): void {
    console.log("Painting a macOS-style checkbox.");
  }

  onSelect(): void {
    console.log("macOS checkbox selected.");
  }
}

class App {
  static main(): void {
    const os = process.platform;

    if (os === "win32") {
      const button = new WindowsButton();
      const checkbox = new WindowsCheckbox();
      button.paint();
      checkbox.paint();
    } else if (os === "darwin") {
      const button = new MacOSButton();
      const checkbox = new MacOSCheckbox();
      button.paint();
      checkbox.paint();
    }
  }
}

App.main();

// While this setup looks simple for two UI components on two platforms, it quickly becomes a nightmare as your app grows.

// In our case, we want to create a family of UI components (like Button, Checkbox, TextField, etc.) that look and behave
// differently on different platforms (such as Windows or macOS) but expose the same interface to the application.

//Components
// Abstract Factory - Common Interface for creating a family of related products.
// Concrete Factories - Implement the abstract factory interface to create concrete products.
// Abstract Products - Declare interfaces for a set of related products.
// Concrete Products - Implement the abstract product interfaces.

// Implementing the Abstract Factory Pattern

// Abstract Products
interface Button {
  paint(): void;
  onClick(): void;
}

interface Checkbox {
  paint(): void;
  onSelect(): void;
}

// Concrete Products for Windows
class WinButton implements Button {
  paint(): void {
    console.log("Painting a Windows-style button.");
  }

  onClick(): void {
    console.log("Windows button clicked.");
  }
}

class WinCheckbox implements Checkbox {
  paint(): void {
    console.log("Painting a Windows-style checkbox.");
  }

  onSelect(): void {
    console.log("Windows checkbox selected.");
  }
}

// Concrete Products for macOS
class MacButton implements Button {
  paint(): void {
    console.log("Painting a macOS-style button.");
  }

  onClick(): void {
    console.log("macOS button clicked.");
  }
}

class MacCheckbox implements Checkbox {
  paint(): void {
    console.log("Painting a macOS-style checkbox.");
  }

  onSelect(): void {
    console.log("macOS checkbox selected.");
  }
}

// Abstract Factory
interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

// Concrete Factory for Windows
class WinFactory implements GUIFactory {
  createButton(): Button {
    return new WinButton();
  }

  createCheckbox(): Checkbox {
    return new WinCheckbox();
  }
}

// Concrete Factory for macOS
class MacFactory implements GUIFactory {
  createButton(): Button {
    return new MacButton();
  }

  createCheckbox(): Checkbox {
    return new MacCheckbox();
  }
}

// Client Code
class Application {
  private button: Button;
  private checkbox: Checkbox;

  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }

  render(): void {
    this.button.paint();
    this.checkbox.paint();
  }
}

// Application Configuration
class ApplicationConfigurator {
  static configure(): Application {
    const os = process.platform;
    let factory: GUIFactory;

    if (os === "win32") {
      factory = new WinFactory();
    } else if (os === "darwin") {
      factory = new MacFactory();
    } else {
      throw new Error("Unsupported platform");
    }

    return new Application(factory);
  }
}

// Running the Application
const app = ApplicationConfigurator.configure();
app.render();

