// The Facade Design Pattern is a structural design pattern that provides a unified, simplified interface to a complex 
// subsystem making it easier for clients to interact with multiple components without getting overwhelmed by their intricacies

// It’s particularly useful in situations where:
// Your system contains many interdependent classes or low-level APIs.
// The client doesn’t need to know how those parts work internally.
// You want to reduce the learning curve or coupling between clients and complex systems.

// It acts as a "front-facing" API, allowing clients to interact with a single, easy-to-use 
// object rather than dealing with the complexity of multiple underlying classes or methods.

// The Problem: Deployment Complexity
// Let’s say you’re building a deployment automation tool for your development team.
// On the surface, deploying an application may seem like a straightforward task, but in reality, it involves a sequence of coordinated, error-prone steps.
// Here’s a simplified version of a typical deployment flow:
// Pull the latest code from a Git repository
// Build the project using a tool like Maven or Gradle
// Run automated tests (unit, integration, maybe end-to-end)
// Deploy the build to a production environment

// Deployment Subsystems
// 1. Version Control System
class VersionControlSystem {
   pullLatestChanges(branch: string): void {
       console.log("VCS: Pulling latest changes from '" + branch + "'...");
       this.simulateDelay();
       console.log("VCS: Pull complete.");
   }

   private simulateDelay(): void {
       // TypeScript/JavaScript doesn't have Thread.sleep, using setTimeout would be async
       // For simulation purposes, we'll use a synchronous delay
       const start = Date.now();
       while (Date.now() - start < 1000) {
           // Busy wait for 1 second
       }
   }
}

// 2. Build System
class BuildSystem {
   compileProject(): boolean {
       console.log("BuildSystem: Compiling project...");
       this.simulateDelay(2000);
       console.log("BuildSystem: Build successful.");
       return true;
   }

   getArtifactPath(): string {
       const path = "target/myapplication-1.0.jar";
       console.log("BuildSystem: Artifact located at " + path);
       return path;
   }

   private simulateDelay(ms: number): void {
       const start = Date.now();
       while (Date.now() - start < ms) {
           // Busy wait
       }
   }
}

// 3. Testing Framework
class TestingFramework {
   runUnitTests(): boolean {
       console.log("Testing: Running unit tests...");
       this.simulateDelay(1500);
       console.log("Testing: Unit tests passed.");
       return true;
   }

   runIntegrationTests(): boolean {
       console.log("Testing: Running integration tests...");
       this.simulateDelay(3000);
       console.log("Testing: Integration tests passed.");
       return true;
   }

   private simulateDelay(ms: number): void {
       const start = Date.now();
       while (Date.now() - start < ms) {
           // Busy wait
       }
   }
}

// 4. Deployment System
class DeploymentTarget {
   transferArtifact(artifactPath: string, server: string): void {
       console.log("Deployment: Transferring " + artifactPath + " to " + server + "...");
       this.simulateDelay(1000);
       console.log("Deployment: Transfer complete.");
   }

   activateNewVersion(server: string): void {
       console.log("Deployment: Activating new version on " + server + "...");
       this.simulateDelay(500);
       console.log("Deployment: Now live on " + server + "!");
   }

   private simulateDelay(ms: number): void {
       const start = Date.now();
       while (Date.now() - start < ms) {
           // Busy wait
       }
   }
}

// The orchestrator

class DeploymentOrchestrator {
   private vcs = new VersionControlSystem();
   private buildSystem = new BuildSystem();
   private testFramework = new TestingFramework();
   private deployTarget = new DeploymentTarget();

   deployApplication(branch: string, prodServer: string): boolean {
       console.log("\n[Orchestrator] Starting deployment for branch: " + branch);

       this.vcs.pullLatestChanges(branch);

       if (!this.buildSystem.compileProject()) {
           console.error("Build failed. Deployment aborted.");
           return false;
       }

       const artifact = this.buildSystem.getArtifactPath();

       if (!this.testFramework.runUnitTests() || !this.testFramework.runIntegrationTests()) {
           console.error("Tests failed. Deployment aborted.");
           return false;
       }

       this.deployTarget.transferArtifact(artifact, prodServer);
       this.deployTarget.activateNewVersion(prodServer);

       console.log("[Orchestrator] Deployment successful!");
       return true;
   }
}

// Using the orchestrator
class DeploymentAppDirect {
   static main(): void {
       const orchestrator = new DeploymentOrchestrator();
       orchestrator.deployApplication("main", "prod.server.example.com");

       console.log("\n--- Attempting another deployment (e.g., for a feature branch to staging) ---");
       // orchestrator.deployToStaging("feature/new-ux", "staging.server.example.com");
   }
}

//What is wrong with this approach? 
// The client code is still aware of the complex deployment steps and has to manage the sequence of operations.
// This can lead to code duplication, errors in the deployment sequence, and a steep learning curve for new developers.


// The Facade Design Pattern Solution
// The Facade class — in our case, DeploymentFacade — serves as a single, unified interface 
// to a complex set of operations involved in application deployment.

class DeploymentFacade {
   private vcs = new VersionControlSystem();
   private buildSystem = new BuildSystem();
   private testingFramework = new TestingFramework();
   private deploymentTarget = new DeploymentTarget();

   deployApplication(branch: string, serverAddress: string): boolean {
       console.log("\nFACADE: --- Initiating FULL DEPLOYMENT for branch: " + branch + " to " + serverAddress + " ---");
       let success = true;

       try {
           this.vcs.pullLatestChanges(branch);

           if (!this.buildSystem.compileProject()) {
               console.error("FACADE: DEPLOYMENT FAILED - Build compilation failed.");
               return false;
           }

           const artifactPath = this.buildSystem.getArtifactPath();

           if (!this.testingFramework.runUnitTests()) {
               console.error("FACADE: DEPLOYMENT FAILED - Unit tests failed.");
               return false;
           }

           if (!this.testingFramework.runIntegrationTests()) {
               console.error("FACADE: DEPLOYMENT FAILED - Integration tests failed.");
               return false;
           }

           this.deploymentTarget.transferArtifact(artifactPath, serverAddress);
           this.deploymentTarget.activateNewVersion(serverAddress);

           console.log("FACADE: APPLICATION DEPLOYED SUCCESSFULLY to " + serverAddress + "!");
       } catch (e) {
           console.error("FACADE: DEPLOYMENT FAILED - An unexpected error occurred: " + (e as Error).message);
           console.error(e);
           success = false;
       }

       return success;
   }
}

// Client code using the Facade
class DeploymentAppFacade {
   static main(): void {
       const deploymentFacade = new DeploymentFacade();

       // Deploy to production
       deploymentFacade.deployApplication("main", "prod.server.example.com");

       // Deploy a feature branch to staging
       console.log("\n--- Deploying feature branch to staging ---");
       deploymentFacade.deployApplication("feature/new-ui", "staging.server.example.com");
   }
}