// The Flyweight Design Pattern is a structural pattern that focuses on efficiently sharing
// common parts of object state across many objects to reduce memory usage and boost performance.

// The Flyweight pattern is a structural design pattern that reduces memory usage and 
// improves performance by sharing as much data as possible between similar objects. Instead
// of creating thousands or millions of nearly identical objects, the Flyweight pattern lets
// you move shared "intrinsic" state out to a common object, while "extrinsic" (unique/context-specific)
// state stays with the client code or is supplied at runtime.

// It’s particularly useful in situations where:
// You need to create a large number of similar objects, but most of their data is shared or repeated.
// Storing all object data individually would result in high memory consumption.
// You want to separate intrinsic state (shared, reusable data) from extrinsic state (context-specific, passed in at runtime).

//The problem : Rendering Characters
// Imagine you're building a rich text editor that needs to render characters on screen — much like Google Docs or MS Word.
// Every character (a, b, c, ..., z, punctuation, etc.) must be displayed with formatting information such as:
// Font family
// Font size
// Color
// Style (bold, italic, etc.)
// Position (x, y on the screen)

// A naive implementation might look like this:
class CharacterGlyph {
    private symbol: string;      // e.g., 'a', 'b', etc.
    private fontFamily: string;  // e.g., "Arial"
    private fontSize: number;    // e.g., 12
    private color: string;       // e.g., "#000000"
    private x: number;           // position X
    private y: number;           // position Y

    constructor(symbol: string, fontFamily: string, fontSize: number, color: string, x: number, y: number) {
        this.symbol = symbol;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    draw(): void {
        console.log("Drawing '" + this.symbol + "' in " + this.fontFamily +
            ", size " + this.fontSize + ", color " + this.color + " at (" + this.x + "," + this.y + ")");
    }
}

// Now imagine rendering a 10-page document with 500,000 characters. Even if most characters
// share the same font, size, and color — you’re still allocating half a million objects,
// most of which contain duplicate formatting data.

//What we really need is to separate the intrinsic state (the character symbol and formatting)
// from the extrinsic state (the position on screen). This is where the Flyweight pattern comes in.

//Components of the Flyweight Pattern
// Flyweight Interface
// Declares a method like draw(x, y) that takes extrinsic state (position)

// ConcreteFlyweight
// Implements the flyweight and stores intrinsic state like font and symbol

// FlyweightFactory
// Caches and reuses flyweights to avoid duplication

// Client
// Maintains extrinsic state and uses shared flyweights to perform operations

// Flyweight Interface
interface CharacterFlyweight {
    draw(x: number, y: number): void;
}
// ConcreteFlyweight
class ConcreteCharacterFlyweight implements CharacterFlyweight {
    private symbol: string;
    private fontFamily: string;
    private fontSize: number;
    private color: string;
    constructor(symbol: string, fontFamily: string, fontSize: number, color: string) {
        this.symbol = symbol;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
    }
    draw(x: number, y: number): void {
        console.log("Drawing '" + this.symbol + "' in " + this.fontFamily +
            ", size " + this.fontSize + ", color " + this.color + " at (" + x + "," + y + ")");
    }
}

// FlyweightFactory
class CharacterFlyweightFactory {
    private flyweights: { [key: string]: CharacterFlyweight } = {};

    getFlyweight(symbol: string, fontFamily: string, fontSize: number, color: string): CharacterFlyweight {
        const key = symbol + fontFamily + fontSize + color;
        if (!this.flyweights[key]) {
            this.flyweights[key] = new ConcreteCharacterFlyweight(symbol, fontFamily, fontSize, color);
        }
        return this.flyweights[key];
    }
}

// Client
class TextEditorClient {
    private readonly factory = new CharacterFlyweightFactory();
    private readonly document: RenderedCharacter[] = [];

    addCharacter(c: string, x: number, y: number, font: string, size: number, color: string): void {
        const glyph = this.factory.getFlyweight(c, font, size, color);
        this.document.push(new RenderedCharacter(glyph, x, y));
    }

    renderDocument(): void {
        for (const rc of this.document) {
            rc.render();
        }
        console.log("Total flyweight objects used: " + this.factory.getFlyweightCount());
    }

    private static class RenderedCharacter {
       private readonly glyph: CharacterFlyweight;
       private readonly x: number;
       private readonly y: number;

    constructor(glyph: CharacterFlyweight, x: number, y: number) {
        this.glyph = glyph;
        this.x = x;
        this.y = y;
    }

    render(): void {
        this.glyph.draw(this.x, this.y);
    }
}
}