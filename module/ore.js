// Imports

import { ORE } from "./config.js";
import { OneRoll } from "./roller.js";
import { OREItemSheet } from "./sheets/OREItemSheet.js";

// Initialize system

Hooks.once("init", () => {
    console.log("ore | Initializing One Roll Engine");

    CONFIG.ore = ORE; 

    // Add namespace in global 

    game.ore = {
        roller: OneRoll      
    }; 
    
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("ore", OREItemSheet, { makeDefault: true});
    
});
