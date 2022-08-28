import { OneRoll } from "../dice/OneRoll.js"; 

// import { OneRollActor } from "../actor/OneRollActor.js";

export class OneRollDialogHelper {

    static countExpertDice(chosenStat, chosenSkill, actorId) {
        let chosenSkillEd = 0;
        let chosenStatEd = 0;
        let chosenPowerEd = 0;
        let displayMode = "";
        if(chosenSkill != "none") {
            let chosenSkillObj = game.actors.get(actorId).items.filter(i => i.name === chosenSkill);
            chosenSkillEd = chosenSkillObj[0].system.dice.expert;
        } else {
            chosenSkillEd = 0;
        }

        if(chosenStat != "none") {
            chosenStatEd = game.actors.get(actorId).system.stats[chosenStat].expert;
        } 

        let totalEd = chosenStatEd + chosenSkillEd;

        if(totalEd > 0) {
            displayMode = "block";
            
        } else {
            displayMode = "none";
        }
        return displayMode;

    }

    static buildPowerRollData(html, actorId, trait) {
        let actor = game.actors.get(actorId);
        let power = actor.items.filter(i => i.name === trait);

        let base = power.system.dice.base;
        let exp = power.system.dice.exp;
        let poolMod = Number(html.find("#poolMod").val());
        let edValues = html.find("#setEd").val();
        let dtype = game.settings.get("ore", "coreDieType");

        let rollData = {
            rollPool: base,
            poolMod: poolMod,
            actor: actorId,
            dieType: dtype,
            displayText: trait,
            expertDice: edValues,
            maxPool: 10 // placeholder for now
        }

        return rollData;

    }

    static buildTraitRollData(html, actorId) {
        // Collect actor and stat information
        let actor = game.actors.get(actorId);
        let chosenStat = html.find("#selStat").val();
        let chosenSkill = html.find("#selSkill").val();
        let poolMod = Number(html.find("#poolMod").val());
        let edValues = html.find("#setEd").val();
        let chosenStatVal = 0;
        let chosenSkillVal = 0;
        let chosenSkillEd = 0;
        let chosenStatEd = 0;
        let chosenSkillObj = {};
        let chosenSkillText = "";

    // get skill data if it's a skill roll
        if(chosenSkill != "none") {
            chosenSkillObj = actor.items.filter(i => i.name === chosenSkill);
            console.warn("skill obj ", chosenSkillObj);
            chosenSkillVal = chosenSkillObj[0].system.dice.base;
            chosenSkillEd = chosenSkillObj[0].system.dice.expert;
            chosenSkillText = " + " + chosenSkill;
        }
        
    // get stat data 
        chosenStatVal = actor.system.stats[chosenStat].base;
        chosenStatEd = actor.system.stats[chosenStat].expert;

    // get number of expert dice to send to Roll object
        let expDiceSum = chosenStatEd + chosenSkillEd;
        if (expDiceSum > 0);

    // set final dice pool; note: needs work for penalties and expert dice stuff
        let finalPool = chosenStatVal + chosenSkillVal + poolMod;
        let maxPoolSize = Number(game.settings.get("ore", "coreDieType").substring(1));
        let pool = Math.min(maxPoolSize, finalPool);
        let dtype = game.settings.get("ore", "coreDieType");
        let statSkillText = game.settings.get("ore", chosenStat) + chosenSkillText;

    // package data for dice roller                                                    
        let rollData = {
            rollPool: pool,
            poolMod: poolMod,
            actor:this._id,
            dieType: dtype,
            displayText: statSkillText,
            expertDice: edValues,
            maxPool: maxPoolSize
        }

        return rollData;
    }

    static generateOneRollDialog(dialogData) {
    console.warn("generateOneRollDialog fired");
        let template = dialogData.template;
        let rollData = {};
        

        renderTemplate(template, dialogData).then((dlg) => {
            new Dialog({
                title: game.i18n.localize("ORE.dialog.traitRollDialogTitle"),
                content: dlg,
                buttons: {
                    roll: {
                     icon: '<i class="fas fa-check"></i>',
                     label: game.i18n.localize("ORE.ui.buttons.continue"),
                     callback: (html) => {
                        
                            console.warn("dialogData.type", dialogData.type);
                            if(dialogData.rollType == 3) {
                                rollData = this.buildPowerRollData(html, dialogData.actor, dialogData.trait);
                            } else {
                                rollData = this.buildTraitRollData(html, dialogData.actor);
                            }
                       
                            let roll = new OneRoll(rollData);
                            roll.roll();
                            
                            // render the chat message and display it
                            let msgTemplate = "systems/ore/templates/message/chatmessage.hbs";
                            console.warn("Roll: ", roll);
                            console.warn("Roll Data: ", rollData);
                            renderTemplate(msgTemplate, roll).then((dlg) => {
                                ChatMessage.create({
                                    user: game.user._id,
                                    // roll: data.roll,
                                    //  type:CONST.CHAT_MESSAGE_TYPES.ROLL,
                                    speaker: ChatMessage.getSpeaker(),
                                    content: dlg
                                });
                            });
                        }

                    },
                    close: {
                     icon: '<i class="fas fa-times"></i>',
                     label: game.i18n.localize("ORE.ui.buttons.cancel"),
                     callback: () => { console.log("Clicked Cancel"); return; }
                    }
                   },

                render: (html) => {
                    // get the key selector objects
                    const statSelector = html[0].querySelector("#selStat");
                    const skillSelector = html[0].querySelector("#selSkill");
                                        
                    // Get initial state for the expert dice div based on default selected expert dice
                    let chosenStat = html.find("#selStat").val();
                    let chosenSkill = html.find("#selSkill").val();
                    let display = OneRollDialogHelper.countExpertDice(chosenStat, chosenSkill, dialogData.actor);
                    $("#expertDiceDiv").css({'display':[display]});

                    // listen for changes to selected stat and update div accordingly
                    
                    statSelector.addEventListener("change", () => {
                        console.log("Changed Selection Listener");
                        let chosenStat = html.find("#selStat").val();
                        let chosenSkill = html.find("#selSkill").val();
                        let display = OneRollDialogHelper.countExpertDice(chosenStat, chosenSkill, dialogData.actor);
                        $("#expertDiceDiv").css({'display':[display]});
                    });

                    // listen for changes to selected skill and update accordingly

                    skillSelector.addEventListener("change", () =>{
                        console.log("Changed Skill Selection Listener");
                        let chosenStat = html.find("#selStat").val();
                        let chosenSkill = html.find("#selSkill").val();
                        let display = OneRollDialogHelper.countExpertDice(chosenStat, chosenSkill, dialogData.actor);
                        $("#expertDiceDiv").css({'display':[display]});
                    });
                },   

                default: "close"
            },
            {id:'basic-roll-dialog', resizeable:true, 'height':'100%', classes:['ore','dialog']},).render(true);
        
        
        });
    }

    static generateBasicRollDialog(inPool = 0, inName="Basic", actor="") {

        console.warn("generate dialog called");
        console.warn("inName: ", inName);

        /**
         * TODO: make this a template for easier
         */

        let cont = `<form class="ore roll-dialog"><header class='roll-header'><h1 class='ore roll-name'>${inName} Roll</h1>`
        cont += `<div class='ore roll-dialog'><div class='form-group'><b>Pool</b><input type='text' value='${inPool}' name='poolVal' id='poolVal'/></div></div>`
        cont += "<h4>Modifiers</h4>";
        cont += "<input type='text' name='poolMod' id='poolMod' value='0' data-dtype='Number'>";
        cont += "<h4>Expert Dice</h4>";
        cont += "<p>If you have expert dice, enter the value(s) they should be set to, separated by commas (e.g. 9,7)</p>";
        cont += "<input type='text' name='setEd' id='setEd' value=''>"
        cont += "</form>";

            new Dialog({
                title: game.i18n.localize("ORE.gen.dialog.diceRoll"), // figure this out at some point...not localized right
                content: cont,
                buttons: {
                    roll: {
                     icon: '<i class="fas fa-check"></i>',
                     label: "Continue",
                     callback: (html) => {
                      //  console.log("passed html: ", html); 

                      console.warn("in callback");
                        
                        let pool = Number(html.find("#poolVal").val());
                        let expertDice = html.find("#setEd").val();
                        let poolMod = Number(html.find("#poolMod").val());

                        let maxPoolSize = Number(game.settings.get("ore", "coreDieType").substring(1));
                        let finalPool = pool + poolMod 
                        pool = Math.min(maxPoolSize, finalPool);

                        let dtype = game.settings.get("ore", "coreDieType");
                        let displayText = "";
                       
                        if(inName != "Basic") {
                            displayText = inName;
                        }

                        let rollData = {
                            rollPool: pool,
                            poolMod: poolMod,
                            actor:actor,
                            dieType: dtype,
                            displayText: displayText,
                            expertDice: expertDice
                        }

                        let roll = new OneRoll(rollData);
                        roll.roll();
                        
                        let msgTemplate = "systems/ore/templates/message/chatmessage.hbs";

                        renderTemplate(msgTemplate, roll).then((dlg)=>{
                            ChatMessage.create({
                                user: game.user._id,
                            // roll: data.roll,
                            //  type:CONST.CHAT_MESSAGE_TYPES.ROLL,
                                speaker: ChatMessage.getSpeaker(),
                                content: dlg
                            });
                        });

                        }
                    },
                    close: {
                     icon: '<i class="fas fa-times"></i>',
                     label: "Cancel",
                     callback: () => { console.log("Clicked Cancel"); return; }
                    }
                   },
                default: "close"

            
        },{id:"basic-roll-dialog", classes: ['ore','dialog']}).render(true);
    }

    

    
    
}