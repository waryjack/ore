export default class OneRollActorSheet extends ActorSheet {

    get template() {
        const path = 'systems/ore/templates/actor/';
        return `${path}${this.actor.data.type}sheet.hbs`;
    }

    /**
     * @override
     */
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
        const data = deepClone(this.actor.data);

       // console.warn("080 super getdata, data.items: ", data);
        
        data.config = CONFIG.ore; 
        let ownedItems = this.actor.items;
        data.actor = this.actor; 

        // console.warn("Owned Items: ", ownedItems);
        data.abilities = ownedItems.filter(function(item) {return item.type == "ability"});

        data.armors = ownedItems.filter(function(item) {return item.type == "armor"});

        data.weapons = ownedItems.filter(function(item) {return item.type == "weapon"});

        data.equipment = ownedItems.filter(function(item) {return item.type == "equipment"});
        //console.warn("data.weapons: ", data.weapons);
        data.traits = ownedItems.filter(function(item) {return item.type == "trait"});
        //console.warn("data.traits: ", data.traits);
        
        return data;
    }

    /**
     * @override
     */
    activateListeners(html) {
        super.activateListeners(html);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        html.find('.item-create').click(this._addItem.bind(this));

        html.find('.item-edit').click(this._editItem.bind(this));

        html.find('.item-delete').click(this._deleteItem.bind(this));

        html.find('.basic-roll').click(this._rollAbility.bind(this));

        html.find('.equip-item').change(this._equipItem.bind(this));

        let handler = (ev) => this._onDragStart(ev);
        html.find('.item-name').each((i, item) => {
            if (item.dataset && item.dataset.itemId) {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', handler, false);
            }
        });

    }

    // trigger the basic, non-pre-populated roll dialog
    _onAbilityRoll(event) {
        event.preventDefault();
        let element = event.currentTarget;

        return this.actor.basicRoll();
    }

    _addItem(event) {
        event.preventDefault();
        console.warn("_addItem fired: ");
        var subtype = "";
        var locString = "ORE.sheet.new";

        let element = event.currentTarget;
        if(element.dataset.type == "ability"){
            subtype = element.dataset.subType;
            locString += subtype;
        } else {
            locString += element.dataset.type;
        }

        let itemData  = {
            name: game.i18n.localize(locString),
            type: element.dataset.type,
            data: {
                    type: subtype
            }
        }

        return Item.create(itemData, {parent: this.actor, renderSheet:true});

    }

    _onItemEdit(event) {
        event.preventDefault();

        let element = event.currentTarget;

        let itemId = element.closest(".item").dataset.itemId;

        let item = this.actor.items.get(itemId);

        item.sheet.render(true);

    }

    _deleteItem(event) {
          event.preventDefault();
          let element = event.currentTarget;
          let itemId = element.closest(".item").dataset.itemId;

          let d = new Dialog({
            title: "Delete This Item?",
            content: "<p>Are you sure you want to delete this item?</p>",
            buttons: {
             one: {
              icon: '<i class="fas fa-check"></i>',
              label: "Yes",
              callback: () => { this.actor.deleteOwnedItem(itemId) }
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

      _onEquipItem(event) {
          event.preventDefault();

          let element = event.currentTarget;

          let itemId = element.closest(".item").dataset.itemId;

          let item = this.actor.items.get(itemId);
          
          let field = element.dataset.field;

          let val = element.checked;

          return item.update({ [field]: val});

      }



}