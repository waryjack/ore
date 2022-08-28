import { OneRollDialogHelper } from "../utility/OREDialogHelper.js";
import { OneRoll } from "../dice/OneRoll.js";

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

        // Check for extra stats being active
        setProperty(charStats, "stats.ext1.active", game.settings.get("ore", "ext1Enable"));
        setProperty(charStats, "stats.ext2.active", game.settings.get("ore", "ext2Enable"));

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
        let statNameDefault = game.settings.get("ore", stat);

        //TODO: make into a template, move to dialog helper
        let dialogContent = `<h2>Editing ${statNameDefault}</h2>`;
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
                   
                    let msg = "<b>"+statNameDefault+"</b> updated to "+newBase+"d + "+newExpert+"ed + " + newMaster + "md";

                    let baseProp = `system.stats.${statName}.base`;
                    let expProp = `system.stats.${statName}.expert`;
                    let masProp = `system.stats.${statName}.master`;
                    let defProp = `system.stats.${statName}.defname`;

                    console.warn("props: ", baseProp, expProp, masProp);

                    this.update({[baseProp]:newBase});
                    this.update({[expProp]:newExpert});
                    this.update({[masProp]:newMaster});
                    

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
        
        },{id:"basic-roll-dialog",classes:['ore','dialog']}).render(true);

    }

    oneRoll(type, trait) {
        console.warn("actor oneRoll fired");
        let template = "";

        let dialogData = {
            actor: this._id,
            template: template,
            allSkills: this.items.filter(i => i.type === "skill"),
            allStats: this.system.stats,
            selectStat: "None",
            selectSkill: "None",
            selectedPower: "None",
            powerBase:0,
            powerExpert:0,
            powerMaster:0,
            linkedStat: "None",
            rollType:0,
            trait:""
        }


        switch(type){
            case "basic" : {
                dialogData.template = "systems/ore/templates/roll/basicroll.hbs";
                dialogData.rollType = 0;
                dialogData.trait = trait;
            }
            case "stat":{
                dialogData.template = "systems/ore/templates/roll/statskill.hbs"
                dialogData.selectStat = trait;
                dialogData.rollType = 1;
            } 
            break;
            case "skill": {
                dialogData.template = "systems/ore/templates/roll/statskill.hbs"
                let selectSkillObject = this.items.get(trait);
                dialogData.linkedStat = selectSkillObject.system.linked_stat;  
                dialogData.selectSkill = selectSkillObject.name;  
                dialogData.rollType = 2;
                dialogData.trait = trait;
            }
            break;
            case "power": {
                dialogData.template = "systems/ore/templates/roll/powerroll.hbs";
                
                let powerData = this.items.get(trait);
                dialogData.selectedPower = powerData.name;
                dialogData.powerBase = powerData.system.dice.base;
                dialogData.powerExpert = powerData.system.dice.expert;
                dialogData.powerMaster = powerData.system.dice.master;
                dialogData.rollType = 3;
                dialogData.trait = trait;

            }
            break;
            default:{
                console.error("Unknown roll type");
            }
        }
        console.warn("generated dialogData", dialogData);
        OneRollDialogHelper.generateOneRollDialog(dialogData);
    }

    rollStatOrSkill(stat,type) { // need to refactor this to DialogHelper I think; it's very ugly here
                                 // maybe a dialogData builder function too?

        let actor = this._id;
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
            linkedStat: selectSkillLinkedStat,
            actor: this._id
        }

        console.warn("Dialog Data: ", dialogData);
        OREDialogHelper.generateAbilityRollDialog(template, dialogData, actor);

    }

    rollPower(power) {
        let thisPower = this.items.get(power);
        let thisPowerName = thisPower.name;
        let thisPowerPool = thisPower.system.dice.base; // expert and master dice later
        OneRollDialogHelper.generateBasicRollDialog(thisPowerPool, thisPowerName, this._id);
    }

    adjustPool(pool, dir) {
        console.warn("adjustPool actor method");
        let item = this.items.get(pool);
        let thisPool = item.system;
        let poolMax = thisPool.max_points;
        let poolMin = thisPool.min_points;
        let poolCurr = thisPool.curr_points;

        if(dir === "inc") {
            thisPool.curr_points = Math.min(poolMax, poolCurr++);
        } else if (dir === "dec") {
            thisPool.curr_points = Math.max(poolMin, poolCurr--);
        } else {
            return;
        }
        return item.update({"system":thisPool});

    }

}