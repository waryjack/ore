import { OneRollDialogHelper } from "../utility/OREDialogHelper.js";
import { ORERoll } from "../dice/OreRoll.js";

export default class OneRollActor extends Actor {
 
    /**
     * @override
     * stub at the moment
     */

    prepareBaseData(){
        super.prepareBaseData();

        const charStats = this.system; // actorData is "actor.data.data"

        // console.warn("prepareBaseData object: ", actorData);
    
        if(this.type === "major" || this.type === "minor") {
            this._prepareCharacterData(charStats);
        } else {
            this._prepareSquadData(charStats);
        }
        
    }

    /**
    * @param actorData {EWActor} - this EWActor object's system-specific data
    * stub at the moment
    */
    _prepareCharacterData(charStats) {
        super.prepareDerivedData();
        
        let hitlocArray = ["head","torso","vitals","larm","rarm","lleg","rleg"];
        let finalStateArray = [];
        hitlocArray.forEach(function(element) {
            let stateArray = charStats.hitlocs[element].boxstates;
            let stateCount = charStats.hitlocs[element].box_max;
            if(stateArray.length == 0) {
                for(let i = 0; i < stateCount; i++) {
                    stateArray.push("h");
                }
                finalStateArray = stateArray;
            } else {
                finalStateArray = stateArray;
            }
            // console.warn("Location: ", element, "State Array: ", finalStateArray);
            setProperty(charStats, `hitlocs.${element}.boxstates`, finalStateArray);
        });



    }

    basicRoll() {
        // console.warn("Basic Roll entered");
        OneRollDialogHelper.generateBasicRollDialog();
    }

    editStat(stat) {
        // console.warn("actor editstat fired");
        let currBaseDice = this.system.stats[stat].base;
        let currExpDice = this.system.stats[stat].expert;
        let currMasDice = this.system.stats[stat].master;
        let statNameDefault = this.system.stats[stat].defname;

        let dialogContent = `<h2>Editing ${statNameDefault}</h2>`;
        dialogContent += `<b>Change Display Name</b>: <input type='text' value='${statNameDefault}' data-dtype='String' name='newDefName' id='newDefName'/>`;
        dialogContent += `<b>Base Dice</b>: <input type='text' value='${currBaseDice}' data-dtype='Number' name='newBaseDice' id='newBaseDice'/>`;
        dialogContent += `<b>Expert Dice</b>: <input type='text' value='${currExpDice}' data-dtype='Number' name='newExpDice' id='newExpDice'/>`;
        dialogContent += `<b>Master Dice</b>: <input type='text' value='${currMasDice}' data-dtype='Number' name='newMasDice' id='newMasDice'/>`;
        dialogContent += `<input name='statNameHidden' id='statNameHidden' type='hidden' value='${stat}'/>`;

        new Dialog({
            title:`Edit/Update ${stat}`, // figure this out at some point...not localized right
            content: dialogContent,
            buttons: {
                roll: {
                 icon: '<i class="fas fa-check"></i>',
                 label: "Continue",
                 callback: (html) => {
                  //  console.log("passed html: ", html); 

                    console.warn("in callback");
                    
                    let statName = html.find("#statNameHidden").val();
                    let newBase = Number(html.find("#newBaseDice").val());
                    let newExpert = Number(html.find("#newExpDice").val());
                    let newMaster = Number(html.find("#newMasDice").val());
                    let newDefName = html.find('#newDefName').val();
                   
                    let msg = "<b>"+newDefName+"</b> updated to "+newBase+"d + "+newExpert+"ed + " + newMaster + "md";

                    let baseProp = `system.stats.${statName}.base`;
                    let expProp = `system.stats.${statName}.expert`;
                    let masProp = `system.stats.${statName}.master`;
                    let defProp = `system.stats.${statName}.defname`;

                    console.warn("props: ", baseProp, expProp, masProp);

                    this.update({[baseProp]:newBase});
                    this.update({[expProp]:newExpert});
                    this.update({[masProp]:newMaster});
                    this.update({[defProp]:newDefName});

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

    rollStatOrSkill(stat,type) {


        let selectStat = "None";
        let selectSkill = "None";
        let selectSkillLinkedStat = "None";
        let allSkills = this.items.filter(i => i.type === "skill");
        let allStats = this.system.stats;

        if(type === "stat") {
            selectStat = stat;
        } else if (type === "skill") {
            let selectSkillId = stat;
            let selectSkillObject = this.items.get(selectSkillId);
            selectSkillLinkedStat = selectSkillObject.system.linked_stat;    
            selectSkill = selectSkillObject.name;
        }

        let template = "systems/ore/templates/roll/rolltemplate.hbs";
        let dialogData = {
            selectStat: stat,
            allStats: allStats,
            selectSkill: selectSkill,
            allSkills: allSkills,
            linkedStat: selectSkillLinkedStat
        }

        
        console.warn("Dialog Data: ", dialogData);


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

                      // console.warn("in stat roll callback");
                      
                      let chosenStat = html.find("#selStat").val();
                      let chosenSkill = html.find("#selSkill").val();
                      let chosenStatVal = 0;
                      let chosenSkillVal = 0;
                      let chosenSkillObj = {};

                      if(selSkill != "none") {
                        chosenSkillObj = this.items.filter(i => i.name === chosenSkill);
                        console.warn("skill obj ", chosenSkillObj);
                        chosenSkillVal = chosenSkillObj[0].system.dice.base;
                      }
                      
                      chosenStatVal = this.system.stats[chosenStat].base;
                       
                      let pool = Math.min(10, chosenStatVal + chosenSkillVal);


                      // get dice values
                      /*
                      console.warn("What is this? ", this);
                      console.warn("Roll selStat: ", chosenStat);
                      console.warn("Roll selSkill: ", chosenSkill);
                      console.warn("Chosen Skill Object: ", chosenSkillObj);
                      console.warn("chosen stat val: ", chosenStatVal);
                      console.warn("chosen skill val: ", chosenSkillVal);
                      */
                      
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

    rollPower(power) {
        let thisPower = this.items.get(power);
        let thisPowerPool = thisPower.system.dice.base; // expert and master dice later
        OneRollDialogHelper.generateBasicRollDialog(thisPowerPool);
    }

}