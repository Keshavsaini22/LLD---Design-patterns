// The Observer Design Pattern is a behavioral pattern that defines a one-to-many dependency 
// between objects so that when one object (the subject) changes its state, all its 
// dependents (observers) are automatically notified and updated.

// It’s particularly useful in situations where:
// You have multiple parts of the system that need to react to a change in one central component.
// You want to decouple the publisher of data from the subscribers who react to it.
// You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

// A straightforward approach is to directly call update methods on other objects whenever 
// something changes. For example, a NewsPublisher might call update() on a MobileApp, 
// EmailService, and WebsiteFeed every time a new article is published.

// But as the number of subscribers grows, this approach becomes rigid, hard to scale, and 
// violates the Open/Closed Principle — adding or removing subscribers requires modifying
// the publisher class. It also tightly couples the publisher to all its subscribers.

// The Observer Pattern solves this by decoupling the subject and its observers, allowing 
// them to interact through a common interface. Observers can be added or removed at runtime,
//  and the subject doesn’t need to know who they are — just that they implement a specific 
//  interface.

//THE PROBLEM : BROADCASTING FITNESS DATA

// Imagine you're developing a Fitness Tracker App that connects to a wearable device and 
// receives real-time fitness data. The data includes metrics like steps taken, active minutes, calories burned.
// Whenever new data is received from the device, it gets pushed into a central object
//  — let’s call it FitnessData.

// Now, multiple modules within your app need to react to these updates:

//Display real-time stats on the user interface.
interface FitnessDataObserver {
    update(data: FitnessData): void;
}
//Periodically logs fitness data to a database or file for historical trend analysis.
class ProgressLoggerNaive {
    logDataPoint(steps: number, activeMinutes: number, calories: number): void {
        console.log("NAIVE Logger: Saving data - Steps: " + steps +
            ", Active Mins: " + activeMinutes +
            ", Calories: " + calories);
        // ... actual database/file logging logic ...
    }
}
//Notification service
// Sends alerts to the user, such as:
// "🎉 Goal achieved!" when they reach 10,000 steps.
// "⏳ Time to move!" if they’ve been inactive for too long.
class NotificationServiceNaive {
    private stepGoal: number = 10000;
    private dailyStepGoalNotified: boolean = false;

    checkAndNotify(currentSteps: number): void {
        if (currentSteps >= this.stepGoal && !this.dailyStepGoalNotified) {
            console.log("NAIVE Notifier: ALERT! You've reached your " + this.stepGoal + " step goal!");
            this.dailyStepGoalNotified = true;
        }
        // ... other notification logic, e.g., inactivity alerts ...
    }

    resetDailyNotifications(): void {
        this.dailyStepGoalNotified = false;
    }
}
class FitnessDataNaive {
    private steps: number;
    private activeMinutes: number;
    private calories: number;

    // Direct, hardcoded references to all dependent modules
    private liveDisplay = new LiveActivityDisplayNaive();
    private progressLogger = new ProgressLoggerNaive();
    private notificationService = new NotificationServiceNaive();

    newFitnessDataPushed(newSteps: number, newActiveMinutes: number, newCalories: number): void {
        this.steps = newSteps;
        this.activeMinutes = newActiveMinutes;
        this.calories = newCalories;

        console.log("\nFitnessDataNaive: New data received - Steps: " + this.steps +
            ", ActiveMins: " + this.activeMinutes + ", Calories: " + this.calories);

        // Manually notify each dependent module
        this.liveDisplay.showStats(this.steps, this.activeMinutes, this.calories);
        this.progressLogger.logDataPoint(this.steps, this.activeMinutes, this.calories);
        this.notificationService.checkAndNotify(this.steps);
    }

    dailyReset(): void {
        // Reset logic...
        if (this.notificationService) {
            this.notificationService.resetDailyNotifications();
        }
        console.log("FitnessDataNaive: Daily data reset.");
        this.newFitnessDataPushed(0, 0, 0); // Notify with reset state
    }
}

//problem with this approach is that FitnessDataNaive is tightly coupled to all the modules that depend on its data.
// Adding or removing a module requires modifying FitnessDataNaive, which violates the Open/Closed Principle.
// As the number of dependent modules grows, FitnessDataNaive becomes bloated and hard to maintain.

//Key Components of the Observer Pattern

//Subject Interface: Defines methods for attaching, detaching, and notifying observers.
//Concrete Subject: Implements the subject interface and maintains a list of observers.
//Observer Interface: Defines an update method that observers must implement to receive updates from the subject.
//Concrete Observers: Implement the observer interface and define how they react to updates from the subject.

interface FitnessDataObserver {
    update(data: FitnessData): void;
}

interface FitnessDataSubject {
    registerObserver(observer: FitnessDataObserver): void;
    removeObserver(observer: FitnessDataObserver): void;
    notifyObservers(): void;
}

class FitnessData implements FitnessDataSubject {
    private steps: number;
    private activeMinutes: number;
    private calories: number;

    private readonly observers: FitnessDataObserver[] = [];

    registerObserver(observer: FitnessDataObserver): void {
        this.observers.push(observer);
    }

    removeObserver(observer: FitnessDataObserver): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    newFitnessDataPushed(steps: number, activeMinutes: number, calories: number): void {
        this.steps = steps;
        this.activeMinutes = activeMinutes;
        this.calories = calories;

        console.log("\nFitnessData: New data received – Steps: " + steps +
            ", Active Minutes: " + activeMinutes + ", Calories: " + calories);

        this.notifyObservers();
    }

    dailyReset(): void {
        this.steps = 0;
        this.activeMinutes = 0;
        this.calories = 0;

        console.log("\nFitnessData: Daily reset performed.");
        this.notifyObservers();
    }

    // Getters
    getSteps(): number { return this.steps; }
    getActiveMinutes(): number { return this.activeMinutes; }
    getCalories(): number { return this.calories; }
}

class LiveActivityDisplay implements FitnessDataObserver {
    update(data: FitnessData): void {
        console.log("Live Display → Steps: " + data.getSteps() +
            " | Active Minutes: " + data.getActiveMinutes() +
            " | Calories: " + data.getCalories());
    }
}

class ProgressLogger implements FitnessDataObserver {
    update(data: FitnessData): void {
        console.log("Logger → Saving to DB: Steps=" + data.getSteps() +
            ", ActiveMinutes=" + data.getActiveMinutes() +
            ", Calories=" + data.getCalories());
        // Simulated DB/file write...
    }
}

class GoalNotifier implements FitnessDataObserver {
    private readonly stepGoal: number = 10000;
    private goalReached: boolean = false;

    update(data: FitnessData): void {
        if (data.getSteps() >= this.stepGoal && !this.goalReached) {
            console.log("Notifier → 🎉 Goal Reached! You've hit " + this.stepGoal + " steps!");
            this.goalReached = true;
        }
    }

    reset(): void {
        this.goalReached = false;
    }
}

class FitnessAppObserverDemo {
    static main(): void {
        const fitnessData = new FitnessData();

        const display = new LiveActivityDisplay();
        const logger = new ProgressLogger();
        const notifier = new GoalNotifier();

        // Register observers
        fitnessData.registerObserver(display);
        fitnessData.registerObserver(logger);
        fitnessData.registerObserver(notifier);

        // Simulate updates
        fitnessData.newFitnessDataPushed(500, 5, 20);
        fitnessData.newFitnessDataPushed(9800, 85, 350);
        fitnessData.newFitnessDataPushed(10100, 90, 380); // Goal should trigger

        // Daily reset
        notifier.reset();
        fitnessData.dailyReset();
    }
}