// The Bridge Design Pattern is a structural pattern that lets you decouple an abstraction 
// from its implementation, allowing the two to vary independently.
// Think of it like a physical bridge connecting two islands. The bridge separates the island
//  of abstraction from the island of implementation, allowing people (clients) to cross
//   without knowing the details of either island's internal structure.
// It’s particularly useful in situations where:
// You have classes that can be extended in multiple orthogonal dimensions 
// (e.g., shape vs. rendering technology, UI control vs. platform).
// You want to avoid a deep inheritance hierarchy that multiplies combinations of features.
// You need to combine multiple variations of behavior or implementation at runtime.

// The Bridge Pattern splits a class into two separate hierarchies:
// One for the abstraction (e.g., shape, UI control)
// One for the implementation (e.g., rendering engine, platform)

// These two hierarchies are "bridged" via composition — not inheritance — allowing you to mix and match independently

// The problem : drawing shapes using different rendering methods
// Imagine you're building a cross-platform graphics library. It supports rendering shapes
// like circles and rectangles using different rendering approaches:
// 1. Vector Rendering (using lines and curves)
// 2. Raster Rendering (using pixels)


abstract class Shape {
    public abstract draw(): void;
}
// circle category
class VectorCircle extends Shape {
    public draw(): void {
        console.log("Drawing Circle as VECTORS");
    }
}

class RasterCircle extends Shape {
    public draw(): void {
        console.log("Drawing Circle as PIXELS");
    }
}
// rectangle category
class VectorRectangle extends Shape {
    public draw(): void {
        console.log("Drawing Rectangle as VECTORS");
    }
}
class RasterRectangle extends Shape {
    public draw(): void {
        console.log("Drawing Rectangle as PIXELS");
    }
}

class App {
    static main(): void {
        const s1: Shape = new VectorCircle();
        const s2: Shape = new RasterRectangle();

        s1.draw(); // Drawing Circle as VECTORS
        s2.draw(); // Drawing Rectangle as PIXELS
    }
}

//why this quickly breaks down
// If we want to add more shapes or rendering methods, we would need to create new classes for each combination,
// leading to a combinatorial explosion of classes (e.g., VectorTriangle, RasterTriangle, etc.).

//what we really need is to separate the shape hierarchy from the rendering hierarchy

//components of bridge pattern
// Implementor eg: Renderer
// Concrete Implementor eg: VectorRenderer, RasterRenderer
// Abstraction eg: Shape
// Refined Abstraction eg: Circle, Rectangle

interface Renderer {
    renderCircle(radius: number): void;
    renderRectangle(width: number, height: number): void;
}

class VectorRenderer implements Renderer {
    renderCircle(radius: number): void {
        console.log("Drawing a circle of radius " + radius + " using VECTOR rendering.");
    }

    renderRectangle(width: number, height: number): void {
        console.log("Drawing a rectangle " + width + "x" + height + " using VECTOR rendering.");
    }
}

class RasterRenderer implements Renderer {
    renderCircle(radius: number): void {
        console.log("Drawing pixels for a circle of radius " + radius + " (RASTER).");
    }

    renderRectangle(width: number, height: number): void {
        console.log("Drawing pixels for a rectangle " + width + "x" + height + " (RASTER).");
    }
}

abstract class Shape {
    protected renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    public abstract draw(): void;
}

class Circle extends Shape {
    private readonly radius: number;

    constructor(renderer: Renderer, radius: number) {
        super(renderer);
        this.radius = radius;
    }

    draw(): void {
        this.renderer.renderCircle(this.radius);
    }
}

class Rectangle extends Shape {
    private readonly width: number;
    private readonly height: number;

    constructor(renderer: Renderer, width: number, height: number) {
        super(renderer);
        this.width = width;
        this.height = height;
    }

    draw(): void {
        this.renderer.renderRectangle(this.width, this.height);
    }
}

class BridgeDemo {
   static main(): void {
       const vector: Renderer = new VectorRenderer();
       const raster: Renderer = new RasterRenderer();

       const circle1: Shape = new Circle(vector, 5);
       const circle2: Shape = new Circle(raster, 5);

       const rectangle1: Shape = new Rectangle(vector, 10, 4);
       const rectangle2: Shape = new Rectangle(raster, 10, 4);

       circle1.draw();     // Vector
       circle2.draw();     // Raster
       rectangle1.draw();  // Vector
       rectangle2.draw();  // Raster
   }
}