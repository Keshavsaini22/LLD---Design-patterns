// The Command Design Pattern is a behavioral pattern that turns a request into a standalone 
// object, allowing you to parameterize actions, queue them, log them, or support undoable 
// operations — all while decoupling the sender from the receiver.

// It’s particularly useful in situations where:
// You want to encapsulate operations as objects.
// You need to queue, delay, or log requests.
// You want to support undo/redo functionality.
// You want to decouple the object that invokes an operation from the one that knows how to perform it.

//The problem - tighly coupled smart home controller
//Imagine you building Smart home hub. hub needs to control various devices like lights, fans, and thermostats.
//the hub should be able to send commands like: light.on(), fan.off(), thermostat.setTemperature(22).

//Naive approach
class Light {
    on(): void {
        console.log("Light turned ON");
    }

    off(): void {
        console.log("Light turned OFF");
    }
}

class Thermostat {
    setTemperature(temp: number): void {
        console.log("Thermostat set to " + temp + "°C");
    }
}

class SmartHomeControllerV1 {
    private readonly light: Light;
    private readonly thermostat: Thermostat;

    constructor(light: Light, thermostat: Thermostat) {
        this.light = light;
        this.thermostat = thermostat;
    }

    turnOnLight(): void {
        this.light.on();
    }

    turnOffLight(): void {
        this.light.off();
    }

    setThermostatTemperature(temperature: number): void {
        this.thermostat.setTemperature(temperature);
    }
}

class SmartHomeApp {
    static main(): void {
        const light = new Light();
        const thermostat = new Thermostat();
        const controller = new SmartHomeControllerV1(light, thermostat);

        controller.turnOnLight();
        controller.setThermostatTemperature(22);
        controller.turnOffLight();
    }
}

//why is this approach bad?
//1. Tight Coupling: SmartHomeControllerV1 is tightly coupled to specific device classes (Light, Thermostat).
//2. Limited Extensibility: Adding new devices or commands requires modifying the controller class.
//3. Code Duplication: Command logic is duplicated in the controller methods.
//4. No undo/redo support: There's no way to undo or redo commands.
//5. No scheduling or queuing or logging of commands.

// We need to treat each command (e.g., “turn on light”, “set thermostat to 22°C”) as a 
// standalone object — something that encapsulates:
// What to do
// Which device it affects
// How to execute it
// (Optionally) How to undo it

// Key Components of the Command Pattern:
// Command Interface: Declares a method for executing a command.
// Concrete Command Classes: Implement the Command interface and define the binding between a receiver and an action.
// Receiver: The object that knows how to perform the operations associated with the command.
// Invoker: The object that holds and invokes commands.
// Client: The object that creates concrete command objects and sets their receivers.

// Command Interface
interface Command {
    execute(): void;
    undo(): void;
}
// Receivers
class Light {
   on(): void {
       console.log("Light turned ON");
   }

   off(): void {
       console.log("Light turned OFF");
   }
}

class Thermostat {
   private currentTemperature: number = 20; // default

   setTemperature(temp: number): void {
       console.log("Thermostat set to " + temp + "°C");
       this.currentTemperature = temp;
   }

   getCurrentTemperature(): number {
       return this.currentTemperature;
   }
}

// Concrete Command Classes
class LightOnCommand implements Command {
   private readonly light: Light;

   constructor(light: Light) {
       this.light = light;
   }

   execute(): void {
       this.light.on();
   }

   undo(): void {
       this.light.off();
   }
}

class LightOffCommand implements Command {
   private readonly light: Light;

   constructor(light: Light) {
       this.light = light;
   }

   execute(): void {
       this.light.off();
   }

   undo(): void {
       this.light.on();
   }
}

class SetTemperatureCommand implements Command {
   private readonly thermostat: Thermostat;
   private readonly newTemperature: number;
   private previousTemperature: number;

   constructor(thermostat: Thermostat, temperature: number) {
       this.thermostat = thermostat;
       this.newTemperature = temperature;
   }

   execute(): void {
       this.previousTemperature = this.thermostat.getCurrentTemperature();
       this.thermostat.setTemperature(this.newTemperature);
   }

   undo(): void {
       this.thermostat.setTemperature(this.previousTemperature);
   }
}

// Invoker
class SmartButton {
   private currentCommand: Command | null = null;
   private readonly history: Command[] = [];

   setCommand(command: Command): void {
       this.currentCommand = command;
   }

   press(): void {
       if (this.currentCommand !== null) {
           this.currentCommand.execute();
           this.history.push(this.currentCommand);
       } else {
           console.log("No command assigned.");
       }
   }

   undoLast(): void {
       if (this.history.length > 0) {
           const lastCommand = this.history.pop()!;
           lastCommand.undo();
       } else {
           console.log("Nothing to undo.");
       }
   }
}

class SmartHomeApp {
   static main(): void {
       // Receivers
       const light = new Light();
       const thermostat = new Thermostat();

       // Commands
       const lightOn: Command = new LightOnCommand(light);
       const lightOff: Command = new LightOffCommand(light);
       const setTemp22: Command = new SetTemperatureCommand(thermostat, 22);

       // Invoker
       const button = new SmartButton();

       // Simulate usage
       console.log("→ Pressing Light ON");
       button.setCommand(lightOn);
       button.press();

       console.log("→ Pressing Set Temp to 22°C");
       button.setCommand(setTemp22);
       button.press();

       console.log("→ Pressing Light OFF");
       button.setCommand(lightOff);
       button.press();

       // Undo sequence
       console.log("\n↶ Undo Last Action");
       button.undoLast();  // undo Light OFF

       console.log("↶ Undo Previous Action");
       button.undoLast();  // undo Set Temp

       console.log("↶ Undo Again");
       button.undoLast();  // undo Light ON
   }
}