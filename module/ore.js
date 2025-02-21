// Imports

import { preloadHandlebarsTemplates } from "./templates.js";
import { ORE } from "./config.js";
import { OneRoll } from "./dice/OneRoll.js";
import OneRollItemSheet from "./sheets/item/OneRollItemSheet.js";
import OneRollActorSheet from "./sheets/actor/OneRollActorSheet.js";
import OneRollActorSheetV2 from "./sheets/actor/OneRollActorSheetV2.js";
import OneRollActor from "./actor/OneRollActor.js";
import OneRollCombat from "./combat/OneRollCombat.js";
import OneRollItem from "./item/OneRollItem.js";
import { registerSettings } from "./settings.js"; 

// Initialize system

Hooks.once("init", () => {
  // console.log("ore | Initializing One Roll Engine");

    CONFIG.ore = ORE; 

    // Add namespace in global 

    game.ore = {
        OneRollActor,
        OneRoll,
        OneRollActorSheet,
        OneRollActorSheetV2,
        OneRollItemSheet,
        OneRollItem,
        OneRollCombat,
        registerSettings,
    }; 

    //CONFIG.debug.hooks = true;
    
    Actors.unregisterSheet("core", ActorSheet);
    Items.unregisterSheet("core", ItemSheet);

    Actors.registerSheet("ore", OneRollActorSheetV2, { label: "V2 Actor Sheet", types:["major", "minor", "squad"], makeDefault:true});
    Items.registerSheet("ore", OneRollItemSheet, { makeDefault: true});
    
    CONFIG.Actor.documentClass = OneRollActor;
    CONFIG.Combat.documentClass = OneRollCombat;
    CONFIG.Item.documentClass = OneRollItem;
    // CONFIG.Dialog.documentClass = OneRollDialog;

    // Register system settings
    registerSettings();

    // Register partials templates
    preloadHandlebarsTemplates();

    // Register handlebar helpers
    Handlebars.registerHelper('ife', function(arg1, arg2, options) {
        return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper("times", function(n, content) {
       let result = "";
       if (n==0 || n == null) return;
       for (let i = 0; i < n; i++) {
           result += content.fn(i)
       }

       return result;

    });

    //uppercases; needs work
    Handlebars.registerHelper("proper", function(content) {
        let result = "";

        result = content[0].toUpperCase() + content.substring(1);

        return result;

    });

    Handlebars.registerHelper("minus", function(arg1, arg2) {
        let result = arg1 - arg2;

        return result;
    });

    Handlebars.registerHelper("render", function(arg1){

        return new Handlebars.SafeString(arg1);
    });

    // Checks whether a game setting is active
    Handlebars.registerHelper("getSetting", function(arg){
        // console.warn("Passed Setting Name: ", arg);
        if (arg == "" || arg == "non" || arg == undefined) { return ; }
        return game.settings.get('ore', arg);
    });

    
    Handlebars.registerHelper("concat", function(...args){
        let result = "";
        for (let a of args) {
            result += a;
        }

        return result;
    });

    Handlebars.registerHelper("getCustomName", function(a) {
        if (a == "none" || a == "None" || a == "") { return; }
        let result = "Name";
        let truncA = a.substring(0,3);
        result = truncA+result;
       // console.warn("Custom Name", result);
        return result;
    });

    Handlebars.registerHelper("and", function(a, b){
        return (a && b);
    });

    Handlebars.registerHelper("or", function(a, b){
        return (a || b);
    });

});

/**
 * Item and Message Hooks
 */

 Hooks.on('renderChatMessage', (app, html) => {

    html.on('click', '.taskroll-msg', event => {
        event.preventDefault();
        // NOTE: This depends on the exact card template HTML structure.
        $(event.currentTarget).siblings('.taskroll-tt').slideToggle("fast");
     });

     html.on('click', '.taskroll-info', event => {
        event.preventDefault();
        // NOTE: This depends on the exact card template HTML structure.
        $(event.currentTarget).siblings('.taskroll-tt').slideToggle("fast");
     });

     html.on('click', '#legendize', event => {
        event.preventDefault();

        let element = event.currentTarget;

        let actorId = element.dataset.actorId;

        let actor = game.actors.get(actorId);


        if(!actor.system.isRival && !actor.system.isRabble && !actor.system.isTough) {
            actor.spendHeroPoint();
        }
     });

});

Hooks.on("renderDialog", (app, html, data) => {
  const hDom = html[0];
  let h = Math.max(hDom.scrollHeight, hDom.offsetHeight);
 
  // app.setPosition({height:h});
});

/**
 * Utility setting getter
 */

function getSetting(setting) {
    if (arg === "" || arg === "non" || arg === undefined) { return ; }
    return game.settings.get("ore", setting);
}