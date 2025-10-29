// The Prototype Design Pattern is a creational design pattern that lets you create 
// new objects by cloning existing ones, instead of instantiating them from scratch.

// he Prototype Pattern allows you to create new instances by cloning a pre-configured prototype 
// object, ensuring consistency while reducing boilerplate and complexity.

// It’s particularly useful in situations where:
// 1.Creating a new object is expensive, time-consuming, or resource-intensive.
// 2.You want to avoid duplicating complex initialization logic.
// 3.You need many similar objects with only slight differences.


// Key Components
// The pattern typically consists of three main elements:​
// Prototype Interface/Abstract Class: Declares the cloning method (usually clone())
// Concrete Prototype: Implements the cloning operation to create a copy of itself
// Client: Creates new objects by requesting prototypes to clone themselves

// A critical decision in implementing the Prototype pattern is choosing between shallow and deep copying


// The Problem: Spawning Enemies in a Game
// Let’s say you’re developing a 2D shooting game where enemies appear frequently throughout the gameplay.

// You have several enemy types with distinct attributes:
// BasicEnemy: Low health, slow speed — used in early levels.
// ArmoredEnemy: High health, medium speed — harder to defeat, appears later.
// FlyingEnemy: Medium health, fast speed — harder to hit, used for surprise attacks.

// Each enemy type comes with predefined properties such as:
// Health (how much damage they can take)
// Speed (how quickly they move across the screen)
// Armor (whether they take reduced damage)
// Weapon type (e.g., laser, cannon, missile)
// Sprite or appearance (the visual representation)
// Now, imagine you need to spawn a FlyingEnemy. You might write code like this:

Enemy flying1 = new Enemy("Flying", 100, 10.5, false, "Laser");
Enemy flying2 = new Enemy("Flying", 100, 10.5, false, "Laser");

// And you’ll do the same for dozens, maybe hundreds, of similar enemies during the game.
// This approach has several drawbacks:
// 1. Code Duplication: You’re repeating the same initialization code for each enemy instance.
// 2. Maintenance Nightmare: If you need to change the properties of a FlyingEnemy, you have to 
//    update every instance creation throughout your codebase.
// 3. Performance Issues: Creating new instances from scratch can be inefficient, especially if 
//    the initialization logic is complex or resource-intensive.

// The Solution: Using the Prototype Pattern

interface EnemyPrototype {
    clone(): EnemyPrototype;
}

// Concrete Prototype
class Enemy implements EnemyPrototype {
    private type: string;
    private health: number;
    private speed: number;
    private hasArmor: boolean;
    private weaponType: string;

    constructor(type: string, health: number, speed: number, hasArmor: boolean, weaponType: string) {
        this.type = type;
        this.health = health;
        this.speed = speed;
        this.hasArmor = hasArmor;
        this.weaponType = weaponType;
    }

    public clone(): EnemyPrototype {
        return new Enemy(this.type, this.health, this.speed, this.hasArmor, this.weaponType);
    }

    setHealth(health: number): void {
        this.health = health;
    }

    printStats(): void {
        console.log(`Type: ${this.type}, Health: ${this.health}, Speed: ${this.speed}, Armor: ${this.hasArmor}, Weapon: ${this.weaponType}`);
    }
}

// Optional: Prototype Registry
class EnemyRegistry {
    private prototypes: Map<string, Enemy> = new Map();
    public register(key: string, prototype: Enemy): void {
        this.prototypes.set(key, prototype);
    }

    public get(key: string): Enemy | undefined {
        return this.prototypes.get(key)?.clone() as Enemy;
    }
}

// Client Code
class Game {
    static main(): void {
        const enemyRegistry = new EnemyRegistry();

        // Register prototypes
        enemyRegistry.register("FlyingEnemy", new Enemy("Flying", 100, 10.5, false, "Laser"));
        enemyRegistry.register("ArmoredEnemy", new Enemy("Armored", 300, 5.0, true, "Cannon"));

        // Clone from registry
        const flyingEnemy1 = enemyRegistry.get("FlyingEnemy");
        const flyingEnemy2 = enemyRegistry.get("FlyingEnemy");
        const armoredEnemy1 = enemyRegistry.get("ArmoredEnemy");

        // Modify cloned instances if needed
        flyingEnemy2?.setHealth(80); // Slightly different health

        // Print stats to verify
        flyingEnemy1?.printStats();
        flyingEnemy2?.printStats();
        armoredEnemy1?.printStats();
    }
}

Game.main();