// The Template Method Design Pattern is a behavioral design pattern that defines the 
// skeleton of an algorithm in a base class, but allows subclasses to override specific 
// steps of the algorithm without changing its overall structure.

// It’s particularly useful in situations where:
// You have a well-defined sequence of steps to perform a task.
// Some parts of the process are shared across all implementations.
// You want to allow subclasses to customize specific steps without rewriting the whole algorithm.

// When you're solving a problem that follows a common high-level structure but has slight 
// variations in a few steps, it's tempting to write a single method with branching logic 
// like if-else or switch statements to handle those differences.
// For example, a DataExporter might use if conditions to export in CSV, JSON, or XML format.

// The Template Method Pattern solves this by capturing the common workflow in a base class 
// and pushing the customizable steps into subclasses, ensuring that the overall structure 
// remains consistent while allowing flexibility where needed.

//The problem : Exporting Reports
// Let’s say you’re building a tool that allows your application to export reports in 
// different formats — such as CSV, PDF, and Excel.n the surface, each report exporter 
// has a different output format, but underneath, the overall process is almost identical.
// Here’s the high-level workflow followed by each exporter:
// Prepare Data: Gather and organize the data to be exported.
// Open File: Create or open the output file in the desired format.
// Write Header: Output column headers or metadata (format-specific).
// Write Data Rows: Iterate through the dataset and write the rows (format-specific).
// Write Footer: Add optional summary or footer info.
// Close File: Finalize and close the output file.

//Naive Approach: 
class ReportData {
   getHeaders(): string[] {
       return ["ID", "Name", "Value"];
   }

   getRows(): Map<string, any>[] {
       return [
           new Map([["ID", 1], ["Name", "Item A"], ["Value", 100.0]]),
           new Map([["ID", 2], ["Name", "Item B"], ["Value", 150.5]]),
           new Map([["ID", 3], ["Name", "Item C"], ["Value", 75.25]])
       ];
   }
}

class CsvReportExporterNaive {
   export(data: ReportData, filePath: string): void {
       console.log("CSV Exporter: Preparing data (common)...");
       // ... data preparation logic ...

       console.log("CSV Exporter: Opening file '" + filePath + ".csv' (common)...");
       // ... file opening logic ...

       console.log("CSV Exporter: Writing CSV header (specific)...");
       // data.getHeaders().join(",");
       // ... write header to file ...

       console.log("CSV Exporter: Writing CSV data rows (specific)...");
       // for (const row of data.getRows()) { ... format and write row ... }

       console.log("CSV Exporter: Writing CSV footer (if any) (common)...");

       console.log("CSV Exporter: Closing file '" + filePath + ".csv' (common)...");
       // ... file closing logic ...
       console.log("CSV Report exported to " + filePath + ".csv");
   }
}

class PdfReportExporterNaive {
   export(data: ReportData, filePath: string): void {
       console.log("PDF Exporter: Preparing data (common)...");
       // ... data preparation logic ...

       console.log("PDF Exporter: Opening file '" + filePath + ".pdf' (common)...");
       // ... PDF library specific file opening ...

       console.log("PDF Exporter: Writing PDF header (specific)...");
       // ... PDF library specific header writing ...

       console.log("PDF Exporter: Writing PDF data rows (specific)...");
       // ... PDF library specific data row writing ...

       console.log("PDF Exporter: Writing PDF footer (if any) (common)...");

       console.log("PDF Exporter: Closing file '" + filePath + ".pdf' (common)...");
       // ... PDF library specific file closing ...
       console.log("PDF Report exported to " + filePath + ".pdf");
   }
}

class ReportAppNaive {
   static main(): void {
       const reportData = new ReportData();

       const csvExporter = new CsvReportExporterNaive();
       csvExporter.export(reportData, "sales_report");

       console.log();

       const pdfExporter = new PdfReportExporterNaive();
       pdfExporter.export(reportData, "financial_summary");
   }
}

//What is wrong with the above approach?
//1. Code Duplication
//2. Maintenance Challenges
//3. Violation of Open/Closed Principle

//Template Method Pattern Solution:
//Abstract Base Class
abstract class AbstractReportExporter {
   public final exportReport(data: ReportData, filePath: string): void {
       this.prepareData(data);
       this.openFile(filePath);
       this.writeHeader(data);
       this.writeDataRows(data);
       this.writeFooter(data);
       this.closeFile(filePath);
       console.log("Export complete: " + filePath);
   }

   protected prepareData(data: ReportData): void { // Hook method
       console.log("Preparing report data (common step)...");
   }

   protected openFile(filePath: string): void { // Hook method
       console.log("Opening file '" + filePath);
   }

   protected abstract writeHeader(data: ReportData): void;

   protected abstract writeDataRows(data: ReportData): void;

   protected writeFooter(data: ReportData): void { // Hook method
       console.log("Writing footer (default: no footer).");
   }

   protected closeFile(filePath: string): void { // Hook method
       console.log("Closing file '" + filePath);
   }
}

//Concrete Subclasses
class CsvReportExporter extends AbstractReportExporter {
   //prepareData() not overridden - default will be used
   //openFile() not overridden - default will be used

   protected writeHeader(data: ReportData): void {
       console.log("CSV: Writing header: " + data.getHeaders().join(","));
   }

   protected writeDataRows(data: ReportData): void {
       console.log("CSV: Writing data rows...");
       for (const row of data.getRows()) {
           console.log("CSV: " + Array.from(row.values()));
       }
   }

   // writeFooter() not overridden - default will be used
   // closeFile() not overridden - default will be used
}

class PdfReportExporter extends AbstractReportExporter {
   //prepareData() not overridden - default will be used
   //openFile() not overridden - default will be used

   protected writeHeader(data: ReportData): void {
       console.log("PDF: Writing header: " + data.getHeaders().join(","));
   }

   protected writeDataRows(data: ReportData): void {
       console.log("PDF: Writing data rows...");
       for (const row of data.getRows()) {
           console.log("PDF: " + Array.from(row.values()));
       }
   }

   // writeFooter() not overridden - default will be used
   // closeFile() not overridden - default will be used
}

//Client Code
class ReportAppTemplateMethod {
   static main(): void {
       const data = new ReportData();

       const csvExporter: AbstractReportExporter = new CsvReportExporter();
       csvExporter.exportReport(data, "sales_report");

       console.log();

       const pdfExporter: AbstractReportExporter = new PdfReportExporter();
       pdfExporter.exportReport(data, "financial_summary");
   }
}