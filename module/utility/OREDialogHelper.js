import { OneRoll } from "../dice/OneRoll.js"; 

// import { OneRollActor } from "../actor/OneRollActor.js";

export class OneRollDialogHelper {

    static generateBasicRollDialog(inPool = 0, inName="Basic", actor="") {

        console.warn("generate dialog called");
        console.warn("inName: ", inName);

        let cont = `<form class="ore roll-dialog"><header class='roll-header'><h1 class='ore roll-name'>${inName} Roll</h1>`
        cont += `<div class='ore roll-dialog'><div class='form-group'><b>Pool</b><input style='color:white;' type='text' value='${inPool}' name='poolVal' id='poolVal'/></div></div>`
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
                        
                        let pool = html.find("#poolVal").val();
                        let dtype = game.settings.get("ore", "coreDieType");
                        let displayText = "";
                       
                        if(inName != "Basic") {
                            displayText = inName;
                        }

                        let rollData = {
                            rollPool: pool,
                            actor:actor,
                            dieType: dtype,
                            displayText: displayText
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

    static generateStatSkillRollDialog(template, dialogData) {

        console.warn("generate dialog called");
        renderTemplate(template, dialogData).then((dlg) => {
            new Dialog({
                title:"Stat / Skill Roll", // figure this out at some point...not localized right
                content: dlg,
                buttons: {
                    roll: {
                     icon: '<i class="fas fa-check"></i>',
                     label: "Continue",
                     callback: (html) => {
                      //  console.log("passed html: ", html); 

                      console.warn("in callback");
                        
                        let pool = html.find("#poolVal").val();
                        let dtype = game.settings.get("ore", "coreDieType");
                        
                        let rollData = {
                            rollPoll: pool,
                            actor:dialogData.actor,
                            dieType: dtype
                        }
                        let oneRoll = new OneRoll(rollData);
                        
                        let msg = "<b>Rolling "+oneRoll.pool+"D</b></br>" +
                                  "<b>Results "+oneRoll.allDice+"<br/>" +
                                  "<b>Sets</b>: "+oneRoll.sets+"<br/>" +
                                  "<b>Loose</b>: "+oneRoll.loose;

                        ChatMessage.create({
                            user: game.user._id,
                           // roll: data.roll,
                           //  type:CONST.CHAT_MESSAGE_TYPES.ROLL,
                            speaker: ChatMessage.getSpeaker(),
                            content: msg
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
            }).render(true);
        
        });
    }
    
}