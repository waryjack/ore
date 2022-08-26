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

    rollStatOrSkill(stat,type) { // need to refactor this to DialogHelper I think; it's very ugly here
                                 // maybe a dialogData builder function too?


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
                            let poolMod = Number(html.find("#poolMod").val());
                            let edValues = html.find("#setEd").val();
                            let chosenStatVal = 0;
                            let chosenSkillVal = 0;
                            let chosenSkillEd = 0;
                            let chosenStatEd = 0;
                            let chosenSkillObj = {};
                            let chosenSkillText = "";


                            if(chosenSkill != "none") {
                                chosenSkillObj = this.items.filter(i => i.name === chosenSkill);
                                console.warn("skill obj ", chosenSkillObj);
                                chosenSkillVal = chosenSkillObj[0].system.dice.base;
                                chosenSkillEd = chosenSkillObj[0].system.dice.expert;
                                chosenSkillText = " + " + chosenSkill;
                            }
                            
                            chosenStatVal = this.system.stats[chosenStat].base;
                            chosenStatEd = this.system.stats[chosenStat].expert;

                            let expDiceSum = chosenStatEd + chosenSkillEd;

                            if (expDiceSum > 0)
                       
                            
                            console.warn("chosen stat val: ", chosenStatVal);
                             console.warn("chosen skill val: ", chosenSkillVal);

                            let finalPool = chosenStatVal + chosenSkillVal + poolMod;

                            let maxPoolSize = Number(game.settings.get("ore", "coreDieType").substring(1));
                            
                            let pool = Math.min(maxPoolSize, finalPool);
                            let dtype = game.settings.get("ore", "coreDieType");
                            let statSkillText = game.settings.get("ore", chosenStat) + chosenSkillText;
                            // get dice values
                            /*
                            console.warn("What is this? ", this);
                            console.warn("Roll selStat: ", chosenStat);
                            console.warn("Roll selSkill: ", chosenSkill);
                            console.warn("Chosen Skill Object: ", chosenSkillObj);
                            console.warn("chosen stat val: ", chosenStatVal);
                           
                            */
                                                    
                            let rollData = {
                                rollPool: pool,
                                poolMod: poolMod,
                                actor:this._id,
                                dieType: dtype,
                                displayText: statSkillText,
                                expertDice: edValues,
                                maxPool: maxPoolSize
                            }

                            let roll = new OneRoll(rollData);
                            roll.roll();
                            
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
                     label: "Cancel",
                     callback: () => { console.log("Clicked Cancel"); return; }
                    }
                   },
                render: (html) => {
                    const statSelector = html[0].querySelector("#selStat");
                    const skillSelector = html[0].querySelector("#selSkill");

                    // Get initial state for the expert dice div 

                    let chosenStat = html.find("#selStat").val();
                    let chosenSkill = html.find("#selSkill").val();
                    let chosenSkillEd = 0;
                    
                    if(chosenSkill != "none") {
                        let chosenSkillObj = this.items.filter(i => i.name === chosenSkill);
                        chosenSkillEd = chosenSkillObj[0].system.dice.expert;
                    } else {
                        chosenSkillEd = 0;
                    }

                    let chosenStatEd = this.system.stats[chosenStat].expert;

                    let totalEd = chosenStatEd + chosenSkillEd;

                    if(totalEd > 0) {
                        $("#expertDiceDiv").css({'display':'block'});
                    } else {
                        $("#expertDiceDiv").css({'display':'none'});
                    }

                    // listen for changes to selected stats and such
                    
                    statSelector.addEventListener("change", () => {
                        console.log("Changed Selection Listener");
                        let chosenStat = html.find("#selStat").val();
                    let chosenSkill = html.find("#selSkill").val();
                    let chosenSkillEd = 0;
                    
                    if(chosenSkill != "none") {
                        let chosenSkillObj = this.items.filter(i => i.name === chosenSkill);
                        chosenSkillEd = chosenSkillObj[0].system.dice.expert;
                    } else {
                        chosenSkillEd = 0;
                    }

                    let chosenStatEd = this.system.stats[chosenStat].expert;

                    let totalEd = chosenStatEd + chosenSkillEd;

                    if(totalEd > 0) {
                        $("#expertDiceDiv").css({'display':'block'});
                    } else {
                        $("#expertDiceDiv").css({'display':'none'});
                    }
                    
                        
                        // get ExpertDiceTotal from stat and skill
                        // if expert dice total more than 0
                        // $('#expertDiceDiv').css({'display':'block'});
                        // else
                        // $('#expertDiceDiv').css({'display':'none'});
                    });
                    skillSelector.addEventListener("change", () =>{
                        console.log("Changed Skill Selection Listener");
                        let chosenStat = html.find("#selStat").val();
                    let chosenSkill = html.find("#selSkill").val();
                    let chosenSkillEd = 0;
                    
                    if(chosenSkill != "none") {
                        let chosenSkillObj = this.items.filter(i => i.name === chosenSkill);
                        chosenSkillEd = chosenSkillObj[0].system.dice.expert;
                    } else {
                        chosenSkillEd = 0;
                    }

                    let chosenStatEd = this.system.stats[chosenStat].expert;

                    let totalEd = chosenStatEd + chosenSkillEd;

                    if(totalEd > 0) {
                        $("#expertDiceDiv").css({'display':'block'});
                    } else {
                        $("#expertDiceDiv").css({'display':'none'});
                    }
                    });
                },   
                default: "close"
            },{id:'basic-roll-dialog', classes:['ore','dialog']}).render(true);
        
        });

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