// The Proxy Design Pattern is a structural pattern that provides a placeholder or surrogate
// for another object, allowing you to control access to it.
// It acts as an intermediary that lets you execute something either before or after the real
// operation, managing access, lazy initialization, logging, caching, and access control
//  without modifying the original object's code.

// Sometimes you also want to:
// Defer or control access to the actual implementation
// Add extra functionality (e.g., logging, authentication) without modifying existing code.
// A proxy sits between the client and the real object, intercepting calls and optionally altering the behavior.

// The Proxy pattern solves the problem of controlling access to objects that may be expensive to
// create, remote, or require special access permissions. Instead of the client directly 
// accessing the real object, the client accesses a proxy object that controls access to the
// real object and can add additional behavior like logging, caching, or security checks.​

// Think of it like a security guard at a gated community—the guard acts as a proxy for 
// residents. When a visitor arrives, the guard checks credentials before allowing access.

//The Problem : Eager Loading
// Imagine you're building an image gallery application. Users can scroll through a list of 
// image thumbnails, and when they click on one, the full high-resolution image is displayed.

interface Image {
    display(): void;
    getFileName(): string;
}

class HighResolutionImage implements Image {
    private fileName: string;
    private imageData: Uint8Array;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.loadImageFromDisk(); // Expensive operation!
    }

    private loadImageFromDisk(): void {
        console.log("Loading image: " + this.fileName + " from disk (Expensive Operation)...");
        // Simulate disk I/O delay
        const start = Date.now();
        while (Date.now() - start < 2000) {
            // Busy wait for 2 seconds
        }
        this.imageData = new Uint8Array(10 * 1024 * 1024); // Simulate 10MB memory usage
        console.log("Image " + this.fileName + " loaded successfully.");
    }

    display(): void {
        console.log("Displaying image: " + this.fileName);
    }

    getFileName(): string {
        return this.fileName;
    } 
}

class ImageGalleryAppV1 {
    static main(): void {
        console.log("Application Started. Initializing images for gallery...");

        // Images are created eagerly – loaded even if not viewed!
        const image1: Image = new HighResolutionImage("photo1.jpg");
        const image2: Image = new HighResolutionImage("photo2.png");
        const image3: Image = new HighResolutionImage("photo3.gif");

        console.log("\nGallery initialized. User might view an image now.");

        // User clicks on image1
        console.log("User requests to display " + image1.getFileName());
        image1.display();

        // User clicks on image3
        console.log("\nUser requests to display " + image3.getFileName());
        image3.display();

        console.log("\nApplication finished.");
    }
}

//What's the issue here?
// In this implementation, all high-resolution images are loaded into memory
// as soon as the application starts, regardless of whether the user views them or not.
// This eager loading can lead to significant performance issues, especially if there are many images
// or if the images are large, resulting in high memory consumption and slow startup times.

//What we really need
//defer the loading of high-resolution images until they are actually requested by the user.
//add extra functionality like logging when an image is loaded and displayed.
//maintain the same Image interface so that the client code remains unchanged.

// The Solution: Proxy Pattern
// The Proxy Design Pattern provides a stand-in or placeholder for another object to control
// access to it. Instead of the client interacting directly with the “real” object
// (e.g., HighResolutionImage), it interacts with a Proxy that implements the same interface.
//This allows the proxy to perform additional responsibilities — such as lazy initialization,
//access control, logging, or caching without changing the original class or the client code.

//key components:
// Subject Interface: Defines the common interface for both the Real Subject and the Proxy.
// Real Subject: The actual object that performs the core functionality (e.g., HighResolutionImage).
// Proxy: The intermediary that controls access to the Real Subject, adding extra behavior as needed.

class ImageProxy implements Image {
    private fileName: string;
    private realImage: HighResolutionImage | null = null;

    constructor(fileName: string) {
        this.fileName = fileName;
        console.log("ImageProxy: Created for " + fileName + ". Real image not loaded yet.");
    }

    getFileName(): string {
        // Can safely return without loading the image
        return this.fileName;
    }

    display(): void {
        // Lazy initialization: Load only when display() is called
        if (this.realImage === null) {
            console.log("ImageProxy: display() requested for " + this.fileName + ". Loading high-resolution image...");
            this.realImage = new HighResolutionImage(this.fileName);
        } else {
            console.log("ImageProxy: Using cached high-resolution image for " + this.fileName);
        }

        // Delegate the display call to the real image
        this.realImage.display();
    }
}

//client code 
class ImageGalleryAppV2 {
    static main(): void {
        console.log("Application Started. Initializing image proxies for gallery...");

        // Create lightweight proxies instead of full image objects
        const image1: Image = new ImageProxy("photo1.jpg");
        const image2: Image = new ImageProxy("photo2.png"); // Never displayed
        const image3: Image = new ImageProxy("photo3.gif");

        console.log("\nGallery initialized. No images actually loaded yet.");
        console.log("Image 1 Filename: " + image1.getFileName()); // Does not trigger image load

        // User clicks on image1
        console.log("\nUser requests to display " + image1.getFileName());
        image1.display(); // Lazy loading happens here

        // User clicks on image1 again
        console.log("\nUser requests to display " + image1.getFileName() + " again.");
        image1.display(); // Already loaded; no loading delay

        // User clicks on image3
        console.log("\nUser requests to display " + image3.getFileName());
        image3.display(); // Triggers loading for image3

        console.log("\nApplication finished. Note: photo2.png was never loaded.");
    }
}