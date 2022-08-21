import { OneRoller } from "../dice/OneRoller.js";
import { ORERoll } from "../dice/OreRoll.js"; 

// import { OneRollActor } from "../actor/OneRollActor.js";

export class OneRollDialogHelper {

    static generateBasicRollDialog() {

        console.warn("generate dialog called");
            new Dialog({
                title:"Basic ORE Roll", // figure this out at some point...not localized right
                content: "<b>POOL</b>: <input type='text' name='poolVal' id='poolVal'/>",
                buttons: {
                    roll: {
                     icon: '<i class="fas fa-check"></i>',
                     label: "Continue",
                     callback: (html) => {
                      //  console.log("passed html: ", html); 

                      console.warn("in callback");
                        
                        let pool = html.find("#poolVal").val();
                        let dtype = game.settings.get("ore", "coreDieType");
                        let expr = pool+""+dtype;
                        let roll = new ORERoll();
                        roll.roll(pool);
                        let sets = roll.sets;
                        let loose = roll.loose;
                        let all = roll.allDice;
                        let msg = "<b>Rolling "+pool+"D</b></br>" +
                                  "<b>Results "+all+"<br/>" +
                                  "<b>Sets</b>: "+sets+"<br/>" +
                                  "<b>Loose</b>: "+loose;

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
                        let expr = pool+""+dtype;
                        let roll = new ORERoll();
                        roll.roll(pool);
                        let sets = roll.sets;
                        let loose = roll.loose;
                        let all = roll.allDice;
                        let msg = "<b>Rolling "+pool+"D</b></br>" +
                                  "<b>Results "+all+"<br/>" +
                                  "<b>Sets</b>: "+sets+"<br/>" +
                                  "<b>Loose</b>: "+loose;

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