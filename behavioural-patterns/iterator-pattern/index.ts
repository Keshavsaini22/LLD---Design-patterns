//The Iterator Design Pattern is a behavioral pattern that provides a standard way to access
//elements of a collection sequentially without exposing its internal structure.

// It's particularly useful when you want to traverse different types of collections
// (like arrays, lists, trees, etc.) in a uniform way.You want to multiple ways to traverse a collection
// (e.g., forward, backward, skipping elements, etc.).You want to decouple the traversal logic from the collection itself.

//When faced with this need, developers often write custom for loops or expose the 
//underlying data structures (like ArrayList or LinkedList) directly. For example, a 
//Playlist class might expose its songs array and let the client iterate however it wants.
//This approach can lead to code duplication, tight coupling between the collection and its clients,
//and difficulty in changing the collection's internal structure without affecting its clients.

// The Iterator Pattern solves this by abstracting the iteration logic into a dedicated 
// object — the iterator. Collections provide an iterator via a method like createIterator(),
//  and the client uses it to access elements one by one.

//The problem : Traversing a Playlist
// Imagine you're building a music streaming app that allows users to create and manage 
// playlists. Each playlist stores a list of songs and provides features like:

// Playing songs one by one
// Skipping to the next or previous song
// Shuffling songs
// Displaying the current song queue

class Playlist {
   private songs: string[] = [];

   addSong(song: string): void {
       this.songs.push(song);
   }

   getSongs(): string[] {
       return this.songs;
   }
}
class MusicPlayer {
   playAll(playlist: Playlist): void {
       for (const song of playlist.getSongs()) {
           console.log("Playing: " + song);
       }
   }
}

//Why is this a problem?
// Tight Coupling: The MusicPlayer class is tightly coupled to the Playlist's internal structure.
// If we change how songs are stored in Playlist, we must also change MusicPlayer.
// Code Duplication: If we have multiple classes that need to traverse the Playlist,
// each would need to implement its own traversal logic, leading to code duplication.
// Limited Flexibility: The current design only allows for one way to traverse the playlist.
// If we want to add features like shuffling or reverse playback, we would need to modify
// the MusicPlayer class directly.

//Component of Iterator Pattern

//1. Iterator Interface: Defines the methods for traversing a collection.
//2. Concrete Iterator: Implements the iterator interface for a specific collection.
//3. IterableCollection Interface: Defines a method to create an iterator.
//4. Concrete Collection: Implements the iterable collection interface and provides the concrete iterator.

//Iterator Interface
interface Iterator<T> {
   hasNext(): boolean;
   next(): T;
}

//IterableCollection Interface
interface IterableCollection<T> {
   createIterator(): Iterator<T>;
}

//Concrete Collection
class Playlist implements IterableCollection<string> {
   private readonly songs: string[] = [];

   addSong(song: string): void {
       this.songs.push(song);
   }

   getSongAt(index: number): string {
       return this.songs[index];
   }

   getSize(): number {
       return this.songs.length;
   }

   createIterator(): Iterator<string> {
       return new PlaylistIterator(this);
   }
}

//Concrete Iterator
class PlaylistIterator implements Iterator<string> {
   private readonly playlist: Playlist;
   private index: number = 0;

   constructor(playlist: Playlist) {
       this.playlist = playlist;
   }

   hasNext(): boolean {
       return this.index < this.playlist.getSize();
   }

   next(): string {
       return this.playlist.getSongAt(this.index++);
   }
}
//Client Code
class MusicPlayer {
   static main(): void {
       const playlist = new Playlist();
       playlist.addSong("Shape of You");
       playlist.addSong("Bohemian Rhapsody");
       playlist.addSong("Blinding Lights");

       const iterator: Iterator<string> = playlist.createIterator();

       console.log("Now Playing:");
       while (iterator.hasNext()) {
           console.log(" 🎵 " + iterator.next());
       }
   }
}