import { OneRoll } from "../dice/OneRoll.js"; 

// import { OneRollActor } from "../actor/OneRollActor.js";

export class OneRollDialogHelper {

    /**
     * Get the expert dice available to the roll, based on 
     * selected stat and or skill.
     * 
     * @param chosenStat {String} - the unique name of the selected Stat (e.g., "bod" or "crd")
     * @param chosenSkill {String} - the unique ID of the selected Skill
     * @param actorId {String} - the unique ID of the selected actor
     * @param trait {String} - not used at this time
     */
    static countExpertDice(chosenStat, chosenSkill, actorId, trait) {
        console.warn("incoming countExpert data: ", chosenStat, chosenSkill, actorId, trait);
        let chosenSkillEd = 0;
        let chosenStatEd = 0;
        let displayMode = "";
        if(chosenSkill != "none") {
            let chosenSkillObj = game.actors.get(actorId).items.get(chosenSkill);
            console.warn("countexpertdice chosenskill: ", chosenSkillObj);
            chosenSkillEd = chosenSkillObj.system.dice.expert;
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

    /**
     * Assemble the rollData object for use of a Power that is used to populate the chat message
     * 
     * @param html {String} - the html of the roll dialog
     * @param actorId {String} - the unique ID of the actor
     * @param trait {String} - the unique ID of the Power being rolled
     */

    static buildPowerRollData(html, actorId, trait) {
        let actor = game.actors.get(actorId);
        let power = actor.items.get(trait);
        let powerName = power.name;
        console.warn("Power data: ", power);
        let base = power.system.dice.base;
        let poolMod = Number(html.find("#poolMod").val());
        let edValues = html.find("#setEd").val();
        let dtype = game.settings.get("ore", "coreDieType");

        let rollData = {
            rollPool: base,
            poolMod: poolMod,
            actor: actorId,
            dieType: dtype,
            displayText: powerName,
            expertDice: edValues,
            maxPool: 10 // placeholder for now
        }

        return rollData;

    }

     /**
     * Assemble the rollData object for use of a Power that is used to populate the chat message
     * 
     * @param html {String} - the html of the roll dialog
     * @param actorId {String} - the unique ID of the actor
     * @param trait {String} - not used
     */

    static buildTraitRollData(html, actorId, trait) {
        // Collect actor and stat information
        let actor = game.actors.get(actorId);
        let chosenStat = html.find("#selStat").val();
        let chosenSkill = html.find("#selSkill").val();
        let poolMod = Number(html.find("#poolMod").val());
        let edValues = html.find("#setEd").val();
        let chosenStatVal = 0;
        let chosenSkillVal = 0;
        let chosenSkillEd = 0;
        let chosenSkillMaster = 0;
        let chosenStatEd = 0;
        let chosenStatMaster = 0;
        let chosenSkillObj = {};
        let chosenSkillText = "";
        let masterFlag = false;

    // get skill data if it's a skill roll
        if(chosenSkill != "none") {
            chosenSkillObj = actor.items.get(chosenSkill);
            console.warn("skill obj ", chosenSkillObj);
            chosenSkillVal = chosenSkillObj.system.dice.base;
            chosenSkillEd = chosenSkillObj.system.dice.expert;
            chosenSkillMaster = chosenSkillObj.system.dice.master;
            chosenSkillText = " + " + chosenSkillObj.name;
        }
        
    // get stat data 
        chosenStatVal = actor.system.stats[chosenStat].base;
        chosenStatEd = actor.system.stats[chosenStat].expert;
        chosenStatMaster = actor.system.stats[chosenStat].master;
        console.log("actor: ", actor);
        console.log("chosen master dice: ", chosenStat, chosenStatMaster, actor.system.stats[chosenStat]);

    // get number of expert dice to send to Roll object
        let expDiceSum = chosenStatEd + chosenSkillEd;
        if (expDiceSum > 0);

    // set final dice pool; note: needs work for penalties and expert dice stuff
        let finalPool = chosenStatVal + chosenSkillVal + poolMod;
        let maxPoolSize = Number(game.settings.get("ore", "coreDieType").substring(1));
        let pool = Math.min(maxPoolSize, finalPool);
        let dtype = game.settings.get("ore", "coreDieType");
        let statSkillText = game.settings.get("ore", chosenStat) + chosenSkillText;

    // figure out if there are master dice involved and flag
    if (chosenSkillMaster != 0 || chosenStatMaster != 0) {
        masterFlag = true;
    } else {
        masterFlag = false;
    }

    console.log("masterFlag: ", masterFlag);

    // package data for dice roller                                                    
        let rollData = {
            rollPool: pool,
            poolMod: poolMod,
            actor:this._id,
            dieType: dtype,
            displayText: statSkillText,
            expertDice: edValues,
            maxPool: maxPoolSize,
            hasMaster: masterFlag
        }

        return rollData;
    }

    /**
     * Renders and displays the chat message with roll details
     * 
     * @param roll {OneRoll} - the object containing all roll information
     * @param template {String} - the Handlebars template to be rendered
     */

    static generateChatMessage(roll, template) {
        
        console.warn("Roll: ", roll);
        
        renderTemplate(template, roll).then((dlg) => {
            ChatMessage.create({
                user: game.user._id,
             // roll: data.roll,
            //  type:CONST.CHAT_MESSAGE_TYPES.ROLL,
                speaker: ChatMessage.getSpeaker(),
                content: dlg
            });
        });
    }

    /**
     * Watch for changes in the dialog selectors and update the dialog to show or hide the Expert dice div
     * as needed
     * 
     * @param html {String} the html of the dialog
     * @param actor {String} the unique ID of the actor
     * @param trait {String} the ID or name of the selected trait (ID if Skill or Power)
     */
    
    static onSelectorChange(html, actor, trait) {
        let chosenStat = html.find("#selStat").val();
        let chosenSkill = html.find("#selSkill").val();
        let display = "none";
        let skillEd = 0;
        let statEd = 0;

        let a = game.actors.get(actor);
        let s = a.items.get(chosenSkill);
        if (chosenStat != "none") { statEd = a.system.stats[chosenStat].expert; }
        if (chosenSkill != "none") { skillEd = s.system.dice.expert;}

        if (statEd > 0 || skillEd > 0) {
            display = "block";
        } else {
            display = "none";
        }
        return display;
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
                     callback: async (html) => {
                        
                            let pe = 0;
                           // console.warn("dialogData.type", dialogData.type);
                            if(dialogData.rollType == 3) {
                                rollData = this.buildPowerRollData(html, dialogData.actor, dialogData.trait);
                                pe = dialogData.powerExpert;
                            } else {
                                rollData = this.buildTraitRollData(html, dialogData.actor, dialogData.trait);
                            }
                            console.log("Rolldata: ", rollData);
                            let theRoll = new OneRoll(rollData);
                            await theRoll.roll();
                            console.log("Roll prior to interruption: ", theRoll);
                            let currentActor = game.actors.get(dialogData.actor);
                            let safeDiceImg = await new Handlebars.SafeString(theRoll.diceImgs);
                            let safeLooseImg = await new Handlebars.SafeString(theRoll.looseImgs);
                            foundry.utils.setProperty(currentActor, "system.roll.pSets", safeDiceImg);
                            foundry.utils.setProperty(currentActor, "system.roll.pLoose", safeLooseImg);
                            console.log(currentActor);

                            //todo - build and render a template and pass in data including the "hasMaster" value, for reparsing the roll
                            if(theRoll.hasMaster) {
                                let dhtml = "You have a master die. Select the desired value!<br/>";
                                dhtml += safeDiceImg + " | ";
                                dhtml += safeLooseImg + " | ";
                                dhtml += "<select name='masterval' id='masterval'>"
                                let selOpts = "";
                                const diceMaxes = {
                                    "d4": 4,
                                    "d6": 6,
                                    "d8": 8,
                                    "d10": 10,
                                    "d12": 12,
                                    "d20": 20
                                }
                                let coreDieType = game.settings.get("ore", "coreDieType");
                                let maxFace = diceMaxes[coreDieType];
                                for(let i = 1; i <= maxFace; i++) {
                                    selOpts += `<option value='${i}'>${i}</option>`;
                                }
                                dhtml += selOpts;
                                dhtml += "</select>";
                            
                                //get master value in a dialog
                                new Dialog({
                                    title: "Select Value of Master Die",
                                    content: dhtml,
                                    buttons: {
                                        roll: {
                                            icon: '<i class="fas fa-check"></i>',
                                            label: game.i18n.localize("ORE.ui.buttons.continue"),
                                            callback: (masterHtml) => { 
                                                console.log("in callback: ", theRoll);
                                                let masterval = Number(masterHtml.find("#masterval").val());
                                                theRoll.rawRoll.push(masterval);
                                                let newSets = theRoll.countSets(theRoll.rawRoll);
                                                theRoll.parseRoll(newSets)
                                                OneRollDialogHelper.generateChatMessage(theRoll, "systems/ore/templates/message/chatmessage.hbs"); 
                                            }
                                        },
                                        close: {
                                            icon: '<i class="fas fa-times"></i>',
                                            label: game.i18n.localize("ORE.ui.buttons.cancel"),
                                            callback: () => { return; }
                                        }
                                    },
                                    default:"close",
                                }).render(true);
                                /* let selectedMasterVal = 0;
                                roll.rawRoll.push = selectedMasterVal;
                                roll.parseRoll();*/
                            } else {

                            // currentActor.sheet.render(false);
                            OneRollDialogHelper.generateChatMessage(theRoll, "systems/ore/templates/message/chatmessage.hbs");

                            }
                            // render the chat message and display it
                            
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
                    console.warn("DialogData in Render key: ", dialogData);
                                        
                    // Get initial state for the expert dice div based on default selected expert dice
                    let display = OneRollDialogHelper.onSelectorChange(html, dialogData.actor, dialogData.trait);
                    console.warn("display: ", display);
                    if(dialogData.rollType == 3 && dialogData.powerExpert > 0) {
                        display = 'block'
                    }
                    $("#expertDiceDiv").css({'display':[display]});

                    // listen for changes to selected stat and update div accordingly
                    statSelector.addEventListener("change", () => {
                        let display = OneRollDialogHelper.onSelectorChange(html, dialogData.actor, dialogData.trait);
                        $("#expertDiceDiv").css({'display':[display]});
                    });

                    // listen for changes to selected skill and update accordingly

                    skillSelector.addEventListener("change", () =>{
                        let display = OneRollDialogHelper.onSelectorChange(html, dialogData.actor, dialogData.trait);
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