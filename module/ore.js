// Imports

import { ORE } from "./config.js";
import { OneRoller } from "./dice/OneRoller.js";
import OneRollItemSheet from "./sheets/item/OneRollItemSheet.js";
import OneRollActorSheet from "./sheets/actor/OneRollActorSheet.js";
import OneRollActor from "./actor/OneRollActor.js";
import OneRollCombat from "./combat/OneRollCombat.js";
import { registerSettings } from "./settings.js"; 

// Initialize system

Hooks.once("init", () => {
    console.log("ore | Initializing One Roll Engine");

    CONFIG.ore = ORE; 

    // Add namespace in global 

    game.ore = {
        OneRollActor,
        OneRoller,
        OneRollActorSheet,
        OneRollItemSheet,
        OneRollCombat,
        registerSettings,
    }; 
    
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    Actors.registerSheet("ore", OneRollActorSheet, { types:["major", "minor", "squad"], makeDefault:true});
    Items.registerSheet("ore", OneRollItemSheet, { makeDefault: true});
    
    CONFIG.Actor.documentClass = OneRollActor;
    CONFIG.Combat.documentClass = OneRollCombat;

    // Register system settings
    registerSettings();

    // Register partials templates
    // preloadHandlebarsTemplates();

});
