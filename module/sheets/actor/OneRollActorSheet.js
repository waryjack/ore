export default class OneRollActorSheet extends ActorSheet {

    get template() {
        const path = 'systems/ore/templates/actor/';
        return `${path}${this.actor.type}sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['ore', 'sheet', 'actor', 'actor-sheet'],
            width: 775,
            height: 685,
            left:120,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheetbody", initial: "main"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
            });
    }

    /**
     * @override
     */

    getData() {
        const charData = deepClone(this.actor.system);

        charData.config = CONFIG.ORE;
        charData.actor = this.actor;
        charData.type = this.actor.type;

        // Assemble item variables
       
        let ownedItems = this.actor.items;

        if(charData.type != "squad") {
            // charData.stats = ownedItems.filter(item => item.type === "stat");
            charData.skills = ownedItems.filter(item => item.type === "skill");
            // build list of skill names
            let skillNameList = [];
                charData.skills.forEach(element => skillNameList.push(element.name));
            charData.skillNameList = skillNameList;   
            charData.powers = ownedItems.filter(item => item.type === "power");
            charData.weapons = ownedItems.filter(item => item.type === "weapon");
            charData.equipment = ownedItems.filter(item => item.type === "equipment");
            charData.qualities = ownedItems.filter(item => item.type === "quality");
            charData.armor = ownedItems.filter(item => item.type === "armor");
            charData.pools = ownedItems.filter(item => item.type === "point_pool");
            charData.stats = this.actor.system.stats;
         
            
        } else {
            charData.weapons = ownedItems.filter(item => item.type === "weapon");
            charData.powers = ownedItems.filter(item => item.type === "power");
            charData.weapons = ownedItems.filter(item => item.type === "weapon");
            charData.equipment = ownedItems.filter(item => item.type === "equipment");
            charData.qualities = ownedItems.filter(item => item.type === "quality");
        }

      // console.warn("Actor: ", this.actor);
      // console.warn("Main CharData: ", charData);
      // console.warn("charData.type", charData.type);
      // console.warn("Chardata stats: ", charData.stats);
      // console.warn("Skill Name List: ", charData.skillNameList);


       
        return charData;

    }

    /**
     * @override
     */
     activateListeners(html) {
        super.activateListeners(html);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Popout editing of items (remember, all stats / traits are Items)
        html.find('.item-create').click(this._onAddItem.bind(this));
        html.find('.item-edit').click(this._onEditItem.bind(this));
        html.find('.item-delete').click(this._onDeleteItem.bind(this));

        // On-sheet editing of stats and skill values
        html.find('.inline-edit').blur(this._onSheetEditItem.bind(this));
        html.find('.addHitBox').click(this._addHitBox.bind(this));
        html.find('.delHitBox').click(this._delHitBox.bind(this));
        html.find('.cycle-hit').click(this._onCycleHitBox.bind(this));
        html.find('.edit-stat').click(this._onEditStat.bind(this));
        html.find('.adjust-pool').click(this._onAdjustPool.bind(this));

        // Rolls
        html.find('.stat-roll').click(this._onRollStat.bind(this));
        html.find('.skill-roll').click(this._onRollSkill.bind(this));
        html.find('.basic-roll').click(this._onRollBasic.bind(this));
        html.find('.power-roll').click(this._onRollPower.bind(this));
        html.find('.one-roll').click(this._onOneRoll.bind(this));

        // Roll outcomes
        html.find('.send-results').click(this._onSendResults.bind(this));
        html.find('.set-master').click(this._onSetMaster.bind(this));

        let handler = (ev) => this._onDragStart(ev);
        html.find('.item-name').each((i, item) => {
            if (item.dataset && item.dataset.itemId) {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', handler, false);
            }
        });

    }

    _onSendResults(e) {
        e.preventDefault();
        let s = this.actor.system.roll.pSets;
        let l = this.actor.system.roll.pLoose;
        let msgData = {sets:s,loose:l}
        let msgTemplate = "systems/ore/templates/message/chatmessage.hbs";

        renderTemplate(msgTemplate, msgData).then((dlg)=>{
            ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: dlg
            });
        });
        // console.log("Send results stub");
    }

    _onSetMaster(e) {
        e.preventDefault();
        let elem = e.currentTarget;
        let masterVal = 0;
        const diceMaxes = {
            "d4": 4,
            "d6": 6,
            "d8": 8,
            "d10": 10,
            "d12": 12,
            "d20": 20
        }
        let dieType = game.settings.get("ore", "coreDieType");
        let dieMax = diceMaxes[dieType];


    }

    _onAddItem(e) {
        e.preventDefault();
        
        let elem = e.currentTarget;
        let itemType = elem.dataset.type;
        var localizer = "ORE.gen.new."+itemType;

        let newItemData = {
            name: game.i18n.localize(localizer),
            type: itemType,
        }

        return Item.create(newItemData, {parent:this.actor, renderSheet:true});
        
    }

    _onDeleteItem(e) {
        e.preventDefault();
        let elem = e.currentTarget;
        let itemId = elem.closest(".item").dataset.itemId;

        let d = new Dialog({
          title: "Delete This Item?",
          content: "<p>Are you sure you want to delete this item?</p>",
          buttons: {
           one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Yes",
            callback: () => { 
                let itemToDelete = this.actor.items.get(itemId);
                itemToDelete.delete();
              }
           },
           two: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel",
            callback: () => { return; }
           }
          },
          default: "two",
          render: html => console.log("Register interactivity in the rendered dialog"),
          close: html => console.log("This always is logged no matter which option is chosen")
         });
         d.render(true);

    }

    _onEditItem(e) {
        e.preventDefault();

        let elem = e.currentTarget;

        let itemId = elem.closest(".item").dataset.itemId;

        let item = this.actor.items.get(itemId);

        item.sheet.render(true);

    }

    _onSheetEditItem(e) {
        e.preventDefault();
        let elem = e.currentTarget;
        let itemId = elem.closest(".item").dataset.itemId;
        let item = this.actor.items.get(itemId);
        let field = elem.dataset.field;

      // console.warn("Updated Item info: ", itemId, item.name, field, elem.value);
        return item.update({[field]:elem.value});
    }

    // Roll Methods
    _onOneRoll(e) {
      // console.warn("onOneRoll fired");
        e.preventDefault();
        let elem = e.currentTarget;
        let type = elem.dataset.rollType;
        let trait = elem.dataset.rollTrait;
      // console.warn(elem, type, trait);
        return this.actor.oneRoll(type,trait);
    }

    // trigger the basic, non-pre-populated roll dialog
    _onRollBasic(e) {
        e.preventDefault();
        let element = e.currentTarget;
        return this.actor.RollBasicPool();
    }

    _onRollStat(e) {
        e.preventDefault();
      // console.warn("onRollStat fired");
        let elem = e.currentTarget;
        let statToRoll = elem.dataset.statToRoll;
        return this.actor.rollStatOrSkill(statToRoll, "stat");
    }

    _onRollSkill(e) {
        e.preventDefault();
      // console.warn("onRollSkill fired");
        let elem = e.currentTarget;
        let skillToRoll = elem.dataset.skillToRoll;
        return this.actor.rollStatOrSkill(skillToRoll, "skill");
        
    }

    _onRollPower(e) {
        e.preventDefault();
      // console.warn("onRollPower fired");
        let elem = e.currentTarget;
        let powerToRoll = elem.dataset.powerToRoll;
        return this.actor.rollPower(powerToRoll);
    }

    _addHitBox(e) {
        e.preventDefault();
      // console.warn("adding hit box");
        let elem = e.currentTarget;
        let max = elem.dataset.max; // system.hitlocs.head.box_max
        let currboxmax = getProperty(this.actor, max);
        let states = elem.dataset.states; // system.hitlocs.head.boxstates
        let stateArray = getProperty(this.actor, states);

     // console.warn("Max Boxes string: ", max);
     // console.warn("States string: ", states);
     // console.warn("State array before: ", stateArray);
       stateArray.push("h");
     // console.warn("State Array after: ", stateArray);
     // console.warn("Curr Box Before: ", currboxmax);
       currboxmax++;
     // console.warn("Curr Box After: ", currboxmax);
       this.actor.update({[max]:currboxmax});
       this.actor.update({[states]:stateArray});
    }

    _delHitBox(e) {
        e.preventDefault();
      // console.warn("adding hit box");
        let elem = e.currentTarget;
        let max = elem.dataset.max; // system.hitlocs.head.box_max
        let currboxmax = getProperty(this.actor, max);
        let states = elem.dataset.states; // system.hitlocs.head.boxstates
        let stateArray = getProperty(this.actor, states);

     // console.warn("Max Boxes string: ", max);
     // console.warn("States string: ", states);
     // console.warn("State array before: ", stateArray);
       let removed = stateArray.pop();
     // console.warn("State Array after: ", stateArray);
     // console.warn("Curr Box Before: ", currboxmax);
     // console.warn("REmoved: ", removed);
       currboxmax--;
       currboxmax = Math.max(1, currboxmax);
     // console.warn("Curr Box After: ", currboxmax);
       this.actor.update({[max]:currboxmax});
       this.actor.update({[states]:stateArray});

    }

    _onCycleHitBox(e) {
        e.preventDefault();
      // console.warn("cycling hit box");
        let elem = e.currentTarget;
        let hitLocation = elem.dataset.loc;
        let position = elem.dataset.pos;

      // console.warn("clicked location: ", hitLocation, "box position: ", position);
        
        let currBoxArray = this.actor.system.hitlocs[hitLocation].boxstates;
        let currBoxState = currBoxArray[position];
        let newBoxState = "";

        if (currBoxState === "h") {
            newBoxState = "s";
        } else if (currBoxState === "s") {
            newBoxState = "k";
        } else if (currBoxState === "k") {
            newBoxState = "h";
        }

        currBoxArray[position] = newBoxState;
        return this.actor.update({[`system.hitlocs.${hitLocation}.boxstates`]:currBoxArray});
    }

    _onRollBasic(e) {
        e.preventDefault();
        return this.actor.basicRoll();
    }

    _onEditStat(e){
      // console.warn("editStat fired");
        e.preventDefault();
        let elem = e.currentTarget;
        let statClicked = elem.dataset.stat;
        return this.actor.editStat(statClicked);
    }

    _onAdjustPool(e) {
      // console.warn("adjustPool fired");
        e.preventDefault();
        let elem = e.currentTarget;
        let dir = elem.dataset.dir;
        let poolId = elem.dataset.poolId;
        let poolObj = this.actor.items.get(poolId);
      // console.warn("Pool selected: ", poolObj);
        return poolObj.adjustPool(dir);
    }
}