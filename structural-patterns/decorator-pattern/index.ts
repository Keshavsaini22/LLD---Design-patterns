// The Decorator Design Pattern is a structural pattern that lets you dynamically add new 
// behavior or responsibilities to objects without modifying their underlying code.

// It’s particularly useful in situations where:
// You want to extend the functionality of a class without subclassing it.
// You need to compose behaviors at runtime, in various combinations.
// You want to avoid bloated classes filled with if-else logic for optional features.

// The Decorator pattern solves the problem of adding features or behavior to objects at runtime without using inheritance. Rather than creating a new subclass for every combination of features (which leads to exponential class explosion),
// decorators wrap objects dynamically and layer multiple decorators to achieve complex behavior combinations.

// Key Components
// Component: An interface or abstract class defining the core functionality.
// Concrete Component: A class that implements the Component interface and represents the core object to be decorated.
// Decorator: An abstract class that implements the Component interface and contains a reference to a Component object. It delegates calls to the wrapped object.
// Concrete Decorators: Classes that extend the Decorator class and add new behavior before or after delegating to the wrapped object.

// Example Implementation
// Component Interface
interface TextView {
    render(): string;
}

// Concrete Component
class PlainTextView implements TextView {
    private text: string;
    constructor(text: string) {
        this.text = text;
    }
    render(): string {
        return this.text;
    }
}

// Decorator
abstract class TextViewDecorator implements TextView {
    protected decoratedTextView: TextView;

    constructor(decoratedTextView: TextView) {
        this.decoratedTextView = decoratedTextView;
    }

    abstract render(): string;
}

// Concrete Decorators
class BoldDecorator extends TextViewDecorator {
    constructor(decoratedTextView: TextView) {
        super(decoratedTextView);
    }

    render(): string {
        return `<b>${this.decoratedTextView.render()}</b>`;
    }
}

class ItalicDecorator extends TextViewDecorator {
    constructor(decoratedTextView: TextView) {
        super(decoratedTextView);
    }
    
    render(): string {
        return `<i>${this.decoratedTextView.render()}</i>`;
    }
}

// Usage
class TextRendererApp {
    public static main(): void {
        let textView: TextView = new PlainTextView("Hello, World!");
        console.log("Plain Text: " + textView.render());

        textView = new BoldDecorator(textView);
        console.log("Bold Text: " + textView.render());

        textView = new ItalicDecorator(textView);
        console.log("Bold & Italic Text: " + textView.render());

        const anotherTextView: TextView = new ItalicDecorator(new BoldDecorator(new PlainTextView("Design Patterns")));
        console.log("Another Text View: " + anotherTextView.render());
    }
}

TextRendererApp.main();