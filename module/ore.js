// Imports

import { ORE } from "./config.js";
import { OneRoll } from "./roller.js";
// import { ORERoll } from "oreRoll.js";
import { OREItemSheet } from "./sheets/OREItemSheet.js";

// Initialize system

Hooks.once("init", () => {
    console.log("ore | Initializing One Roll Engine");

    CONFIG.ore = ORE; 
    console.log(CONFIG.ore);


    // Add namespace in global 
    
    game.ore = {
        roller: OneRoll      
    }; 

    console.log(game.ore);
    

    
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("ore", OREItemSheet, { makeDefault: true});
    
});

/* Hooks.once("setup", function() {

    let zilch = new OneRoll("8d10").roll();
    const bupkis = new Nothing("hi");
    console.log(bupkis);
    console.log("Zilch: ", zilch, "Zilch sets: ", zilch.sets);
   
}); */
