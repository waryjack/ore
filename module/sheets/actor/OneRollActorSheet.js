export default class OneRollActorSheet extends ActorSheet {

    get template() {
        const path = 'systems/ore/templates/actor/';
        return `${path}${this.actor.type}sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['ewhen', 'sheet', 'actor', 'actor-sheet'],
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

        if(charType === "major" || charType === "minor") {
            charData.stats = ownedItems.filter(item => item.type === "stat");
            charData.skills = ownedItems.filter(item => item.type === "skill");
            charData.powers = owendItems.filter(item => item.type === "power");
            charData.weapons = ownedItems.filter(item => item.type === "weapon");
            charData.equipment = ownedItems.filter(item => item.type === "equipment");
            charData.qualities = ownedItems.filter(item => item.type === "quality");
            charData.armor = ownedItems.filter(item => item.type === "armor");
            charData.pools = ownedItems.filter(item => item.type === "point_pool");
            
        } else if (charType === "squad") {
            charData.weapons = ownedItems.filter(item => item.type === "weapon");
            charData.powers = owendItems.filter(item => item.type === "power");
            charData.weapons = ownedItems.filter(item => item.type === "weapon");
            charData.equipment = ownedItems.filter(item => item.type === "equipment");
            charData.qualities = ownedItems.filter(item => item.type === "quality");
        }

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
        html.find('.inline-edit').click(this._onSheetEditItem.bind(this));

        // Rolls
        html.find('.stat-roll').click(this._onRollStat.bind(this));
        html.find('.skill-roll').click(this._onRollSkill.bind(this));
        html.find('.basic-roll').click(this._onRollBasic.bind(this));

        let handler = (ev) => this._onDragStart(ev);
        html.find('.item-name').each((i, item) => {
            if (item.dataset && item.dataset.itemId) {
                item.setAttribute('draggable', true);
                item.addEventListener('dragstart', handler, false);
            }
        });

    }

    _onAddItem(e) {
        e.preventDefault();
        var localizeString = "ORE.sheet.new";

        let elem = e.currentTarget;
        localizeString += elem.dataset.type;

        let newItemData = {
            name: game.il8n.localize(localizeString),
            type: elem.dataset.type,
        }

        return Item.create(itemData, {parent:this.actor, renderSheet:true});

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
        return item.update({[field]:elem.value});
    }

    // Roll Methods

    // trigger the basic, non-pre-populated roll dialog
    _onRollBasic(e) {
        e.preventDefault();
        let element = e.currentTarget;
        return this.actor.RollBasicPool();
    }

    _onRollStat(e) {
        e.preventDefault();
    }

    _onRollSkill(e) {
        e.preventDefault();
    }



}