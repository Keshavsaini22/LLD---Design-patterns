// The State Design Pattern is a behavioral design pattern that lets an object change its 
// behavior when its internal state changes, as if it were switching to a different class at 
// runtime.

// It’s particularly useful in situations where:
// An object can be in one of many distinct states, each with different behavior.
// The object’s behavior depends on current context, and that context changes over time.
// You want to avoid large, monolithic if-else or switch statements that check for every possible state.

// For example, a Document class might use if-else blocks to determine what to do based on 
// whether it's in "Draft", "Review", or "Published" state.

//Example- Imagine you're building a simple vending machine system. On the surface, it 
// seems like a straightforward task: accept money, dispense products, and go back to idle.
// But behind the scenes, the machine’s behavior needs to vary depending on its current state.

// At any given time, the vending machine can only be in one state, such as:
// IdleState – Waiting for user input (nothing selected, no money inserted).
// ItemSelectedState – An item has been selected, waiting for payment.
// HasMoneyState – Money has been inserted, waiting to dispense the selected item.
// DispensingState – The machine is actively dispensing the item.

// The machine supports a few user-facing operations:
// selectItem(String itemCode) – Select an item to purchase
// insertCoin(double amount) – Insert payment for the selected item
// dispenseItem() – Trigger the item dispensing process

// Naive approach
class VendingMachine {
   private enum State {
       IDLE = "IDLE",
       ITEM_SELECTED = "ITEM_SELECTED", 
       HAS_MONEY = "HAS_MONEY",
       DISPENSING = "DISPENSING"
   }

   private currentState: State = State.IDLE;
   private selectedItem: string = "";
   private insertedAmount: number = 0.0;

   selectItem(itemCode: string): void {
       switch (this.currentState) {
           case State.IDLE:
               this.selectedItem = itemCode;
               this.currentState = State.ITEM_SELECTED;
               break;
           case State.ITEM_SELECTED:
               console.log("Item already selected");
               break;
           case State.HAS_MONEY:
               console.log("Payment already received for item");
               break;
           case State.DISPENSING:
               console.log("Currently dispensing");
               break;
       }
   }

   insertCoin(amount: number): void {
       switch (this.currentState) {
           case State.IDLE:
               console.log("No item selected");
               break;
           case State.ITEM_SELECTED:
               this.insertedAmount = amount;
               console.log("Inserted $" + amount + " for item");
               this.currentState = State.HAS_MONEY;
               break;
           case State.HAS_MONEY:
               console.log("Money already inserted");
               break;
           case State.DISPENSING:
               console.log("Currently dispensing");
               break;
       }
   }

   dispenseItem(): void {
       switch (this.currentState) {
           case State.IDLE:
               console.log("No item selected");
               break;
           case State.ITEM_SELECTED:
               console.log("Please insert coin first");
               break;
           case State.HAS_MONEY:
               console.log("Dispensing item '" + this.selectedItem + "'");
               this.currentState = State.DISPENSING;

               // Simulate delay and completion
               setTimeout(() => {
                   console.log("Item dispensed successfully.");
                   this.resetMachine();
               }, 1000);
               break;
           case State.DISPENSING:
               console.log("Already dispensing. Please wait.");
               break;
       }
   }

   private resetMachine(): void {
       this.selectedItem = "";
       this.insertedAmount = 0.0;
       this.currentState = State.IDLE;
   }
}

//key components of State Pattern implementation would be:
// State Interface: An interface defining the methods that each state must implement.
// Concrete State Classes: Classes that implement the State interface for each specific state.
// Context Class: The main class (VendingMachine) that maintains a reference to the current state 
// and delegates state-specific behavior to the current state object.


//State interface
interface MachineState {
   selectItem(context: VendingMachine, itemCode: string): void;
   insertCoin(context: VendingMachine, amount: number): void;
   dispenseItem(context: VendingMachine): void;
}

// Concrete States
class IdleState implements MachineState {
   selectItem(context: VendingMachine, itemCode: string): void {
       console.log("Item selected: " + itemCode);
       context.setSelectedItem(itemCode);
       context.setState(new ItemSelectedState());
   }

   insertCoin(context: VendingMachine, amount: number): void {
       console.log("Please select an item before inserting coins.");
   }

   dispenseItem(context: VendingMachine): void {
       console.log("No item selected. Nothing to dispense.");
   }
}

class ItemSelectedState implements MachineState {
   selectItem(context: VendingMachine, itemCode: string): void {
       console.log("Item already selected: " + context.getSelectedItem());
   }

   insertCoin(context: VendingMachine, amount: number): void {
       console.log("Inserted $" + amount + " for item: " + context.getSelectedItem());
       context.setInsertedAmount(amount);
       context.setState(new HasMoneyState());
   }

   dispenseItem(context: VendingMachine): void {
       console.log("Insert coin before dispensing.");
   }
}

class HasMoneyState implements MachineState {
   selectItem(context: VendingMachine, itemCode: string): void {
       console.log("Cannot change item after inserting money.");
   }

   insertCoin(context: VendingMachine, amount: number): void {
       console.log("Money already inserted.");
   }

   dispenseItem(context: VendingMachine): void {
       console.log("Dispensing item: " + context.getSelectedItem());
       context.setState(new DispensingState());

       // Simulate dispensing
       setTimeout(() => {
           console.log("Item dispensed successfully.");
           context.reset();
       }, 1000);
   }
}

class DispensingState implements MachineState {
   selectItem(context: VendingMachine, itemCode: string): void {
       console.log("Please wait, dispensing in progress.");
   }

   insertCoin(context: VendingMachine, amount: number): void {
       console.log("Please wait, dispensing in progress.");
   }

   dispenseItem(context: VendingMachine): void {
       console.log("Already dispensing. Please wait.");
   }
}

// Context
class VendingMachine {
   private currentState: MachineState;
   private selectedItem: string;
   private insertedAmount: number;

   constructor() {
       this.currentState = new IdleState(); // Initial state
   }

   setState(newState: MachineState): void {
       this.currentState = newState;
   }

   setSelectedItem(itemCode: string): void {
       this.selectedItem = itemCode;
   }

   setInsertedAmount(amount: number): void {
       this.insertedAmount = amount;
   }

   getSelectedItem(): string {
       return this.selectedItem;
   }

   selectItem(itemCode: string): void {
       this.currentState.selectItem(this, itemCode);
   }

   insertCoin(amount: number): void {
       this.currentState.insertCoin(this, amount);
   }

   dispenseItem(): void {
       this.currentState.dispenseItem(this);
   }

   reset(): void {
       this.selectedItem = "";
       this.insertedAmount = 0.0;
       this.currentState = new IdleState();
   }
}

// Usage Example
class VendingMachineApp {
   static main(): void {
       const vm = new VendingMachine();

       vm.insertCoin(1.0); // Invalid in IdleState
       vm.selectItem("A1");
       vm.insertCoin(1.5);
       vm.dispenseItem();

       console.log("\n--- Second Transaction ---");
       vm.selectItem("B2");
       vm.insertCoin(2.0);
       vm.dispenseItem();
   }
}