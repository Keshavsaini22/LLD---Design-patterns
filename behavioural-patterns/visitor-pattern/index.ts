// The Visitor Design Pattern is a behavioral pattern that lets you add new operations 
// to existing object structures without modifying their classes.

// It allows you to separate an algorithm from the objects on which it operates,
// making it easier to add new operations without changing the existing code.

// It’s particularly useful in situations where:
// You have a complex object structure (like ASTs, documents, or UI elements) that you want to perform multiple unrelated operations on.
// You want to add new behaviors to classes without changing their source code.
// You need to perform different actions depending on an object’s concrete type, without resorting to a long chain of if-else or instanceof checks.

// The Visitor Pattern lets you externalize operations into separate visitor classes. Each 
// visitor implements behavior for every element type, while the elements simply accept the 
// visitor. This keeps your data structures clean and your logic modular and extensible.

// Let’s walk through a real-world example to see how we can apply the Visitor Pattern to 
// cleanly separate behavior from structure and make our system easier to extend without 
// touching existing classes.

//The problrm : Adiing operations to Shape Hierarchy
// Imagine you’re building a vector graphics editor that supports multiple shape types:
// Circle
// Rectangle
// Triangle
// Each shape is part of a common hierarchy and must support a variety of operations, such as:
// Rendering on screen
// Calculating area
// Exporting to SVG
// Serializing to JSON

//Naive Approach
interface Shape {
    draw(): void;
    calculateArea(): number;
    exportAsSvg(): string;
    toJson(): string;
}
class Circle implements Shape {
    private radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    draw(): void {
        console.log("Drawing a circle");
    }

    calculateArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    exportAsSvg(): string {
        return "<circle r=\"" + this.radius + "\" />";
    }

    toJson(): string {
        return "{ \"type\": \"circle\", \"radius\": " + this.radius + " }";
    }
}

//why this is bad?
// This approach tightly couples the shape classes with their behaviors. 
// If we want to add a new operation, we have to modify every shape class, violating the Open/Closed Principle.
// It leads to code duplication and makes it hard to maintain or extend the system.
// It also makes it difficult to add new shapes without modifying existing code, which is not ideal for extensibility.


// The Visitor Pattern Solution
// Instead of embedding behavior directly in the shape classes, we can create a visitor interface 
// that defines operations for each shape type. Each shape will then accept a visitor that performs 
// the operation on it.
//Components of the Visitor Pattern
// 1. Visitor Interface: Defines operations for each concrete element type.
// 2. Concrete Visitors: Implement the visitor interface and define specific behaviors.
// 3. Element Interface: Defines an accept method that takes a visitor.
// 4. Concrete Elements: Implement the element interface and accept visitors.

interface Shape {
    accept(visitor: ShapeVisitor): void;
}

class Circle implements Shape {
    private readonly radius: number;

    constructor(radius: number) {
        this.radius = radius;
    }

    getRadius(): number {
        return this.radius;
    }

    accept(visitor: ShapeVisitor): void {
        visitor.visitCircle(this);
    }
}

class Rectangle implements Shape {
    private readonly width: number;
    private readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    accept(visitor: ShapeVisitor): void {
        visitor.visitRectangle(this);
    }
}

interface ShapeVisitor {
    visitCircle(circle: Circle): void;
    visitRectangle(rectangle: Rectangle): void;
}

class AreaCalculatorVisitor implements ShapeVisitor {
    visitCircle(circle: Circle): void {
        const area = Math.PI * circle.getRadius() * circle.getRadius();
        console.log("Area of Circle: " + area);
    }

    visitRectangle(rectangle: Rectangle): void {
        const area = rectangle.getWidth() * rectangle.getHeight();
        console.log("Area of Rectangle: " + area);
    }
}

class SvgExporterVisitor implements ShapeVisitor {
    visitCircle(circle: Circle): void {
        console.log("<circle r=\"" + circle.getRadius() + "\" />");
    }

    visitRectangle(rectangle: Rectangle): void {
        console.log("<rect width=\"" + rectangle.getWidth() +
            "\" height=\"" + rectangle.getHeight() + "\" />");
    }
}

class VisitorPatternDemo {
    static main(): void {
        const shapes: Shape[] = [
            new Circle(5),
            new Rectangle(10, 4),
            new Circle(2.5)
        ];

        console.log("=== Calculating Areas ===");
        const areaCalculator: ShapeVisitor = new AreaCalculatorVisitor();
        for (const shape of shapes) {
            shape.accept(areaCalculator);
        }

        console.log("\n=== Exporting to SVG ===");
        const svgExporter: ShapeVisitor = new SvgExporterVisitor();
        for (const shape of shapes) {
            shape.accept(svgExporter);
        }
    }
}