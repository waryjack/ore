// Imports

import { ORE } from "./config.js";
import { OneRoller } from "./dice/OneRoller.js";
import OneRollItemSheet from "./sheets/item/OneRollItemSheet.js";
import OneRollActorSheet from "./sheets/actor/OneRollActorSheet";
import OneRollActor from "./actor/OneRollActor";

// Initialize system

Hooks.once("init", () => {
    console.log("ore | Initializing One Roll Engine");

    CONFIG.ore = ORE; 

    // Add namespace in global 

    game.ore = {
        OneRoller,
        OneRollActorSheet,
        OneRollItemSheet
    }; 
    
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    Actors.registerSheet("ore", OneRollActorSheet, { types:["major", "minor", "squad"], makeDefault:true});
    Items.registerSheet("ore", OneRollItemSheet, { makeDefault: true});
    
    CONFIG.Actor.documentClass = OneRollActor;
    
    // Register system settings
    // registerSettings();

    // Register partials templates
    // preloadHandlebarsTemplates();

});
