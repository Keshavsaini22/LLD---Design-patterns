// The Composite Design Pattern is a structural pattern that lets you treat individual objects and compositions of objects uniformly.

// It allows you to build tree-like structures (e.g., file systems, UI hierarchies, organizational
// charts) where clients can work with both single elements and groups of elements using the same interface.

// It’s particularly useful in situations where:
// You need to represent part-whole hierarchies.
// You want to perform operations on both leaf nodes and composite nodes in a consistent way.
// You want to avoid writing special-case logic to distinguish between "single" and "grouped" objects.

// Key Components
// Understanding the Composite pattern requires knowing three main components:​
// Component Interface — Defines the common operations for both leaf and composite objects. This interface ensures that all objects in the hierarchy can be treated uniformly.
// Leaf — A concrete implementation that represents individual objects with no children. Leaves typically do the actual work since they have no one to delegate to.
// Composite — A concrete implementation that can contain other components (both leaves and other composites). It implements operations by delegating to its children and combining the results.

// How It Works
// The Composite pattern follows this structure:​
// A client calls a method on either a leaf or composite object
// If it's a leaf, the method performs its operation directly
// If it's a composite, the method iterates through its children and calls the same method on each
// The results are combined and returned to the client
// The client never knows whether it's working with a leaf or composite


// 1. The Problem: Modeling a File Explorer
// Imagine you're building a file explorer application (like Finder on macOS or File Explorer on Windows). The system needs to represent:
// Files – simple items that have a name and a size.
// Folders – containers that can hold files and other folders (even nested folders).
// Your goal is to support operations such as:
// getSize() – return the total size of a file or folder (which is the sum of all contents).
// printStructure() – print the name of the item, including indentation to show hierarchy.
// delete() – delete a file or a folder and everything inside it.

//Naive Approach Without Composite Pattern
class File {
   private name: string;
   private size: number;

   getSize(): number {
       return this.size;
   }

   printStructure(indent: string): void {
       console.log(indent + this.name);
   }

   delete(): void {
       console.log("Deleting file: " + this.name);
   }
}

class Folder {
   private name: string;
   private contents: any[] = [];

   getSize(): number {
       let total = 0;
       for (const item of this.contents) {
           if (item instanceof File) {
               total += item.getSize();
           } else if (item instanceof Folder) {
               total += item.getSize();
           }
       }
       return total;
   }

   printStructure(indent: string): void {
       console.log(indent + this.name + "/");
       for (const item of this.contents) {
           if (item instanceof File) {
               item.printStructure(indent + " ");
           } else if (item instanceof Folder) {
               item.printStructure(indent + " ");
           }
       }
   }

   delete(): void {
       for (const item of this.contents) {
           if (item instanceof File) {
               item.delete();
           } else if (item instanceof Folder) {
               item.delete();
           }
       }
       console.log("Deleting folder: " + this.name);
   }
}

// What’s Wrong With This Approach?
// The client code has to check the type of each item (File or Folder) to perform operations.
// This leads to code duplication and makes it hard to add new types of items in the future.
// The Folder class has to know about the File class and vice versa, leading to tight coupling.

// Improved Approach With Composite Pattern
// Component Interface (e.g., FileSystemItem)
// Declares the common interface for all concrete components

// Leaf (e.g., File)
// Represents an end object (no children)

// Composite (e.g., Folder)
// Represents an object that can hold children (including other composites)

// Client (e.g., FileExplorerApp)
// Works with components using the shared interface

interface FileSystemItem {
   getSize(): number;
   printStructure(indent: string): void;
   delete(): void;
}
//leaf class
class File implements FileSystemItem {
   private readonly name: string;
   private readonly size: number;

   constructor(name: string, size: number) {
       this.name = name;
       this.size = size;
   }

   getSize(): number {
       return this.size;
   }

   printStructure(indent: string): void {
       console.log(indent + "- " + this.name + " (" + this.size + " KB)");
   }

   delete(): void {
       console.log("Deleting file: " + this.name);
   }
}

//composite class
class Folder implements FileSystemItem {
   private readonly name: string;
   private readonly children: FileSystemItem[] = [];

   constructor(name: string) {
       this.name = name;
   }

   addItem(item: FileSystemItem): void {
       this.children.push(item);
   }

   getSize(): number {
       let total = 0;
       for (const item of this.children) {
           total += item.getSize();
       }
       return total;
   }

   printStructure(indent: string): void {
       console.log(indent + "+ " + this.name + "/");
       for (const item of this.children) {
           item.printStructure(indent + "  ");
       }
   }

   delete(): void {
       for (const item of this.children) {
           item.delete();
       }
       console.log("Deleting folder: " + this.name);
   }
}
// Client Code
class FileExplorerApp {
   static main(): void {
       const file1: FileSystemItem = new File("readme.txt", 5);
       const file2: FileSystemItem = new File("photo.jpg", 1500);
       const file3: FileSystemItem = new File("data.csv", 300);

       const documents = new Folder("Documents");
       documents.addItem(file1);
       documents.addItem(file3);

       const pictures = new Folder("Pictures");
       pictures.addItem(file2);

       const home = new Folder("Home");
       home.addItem(documents);
       home.addItem(pictures);

       console.log("---- File Structure ----");
       home.printStructure("");

       console.log("\nTotal Size: " + home.getSize() + " KB");

       console.log("\n---- Deleting All ----");
       home.delete();
   }
}