export default class OneRollItemSheet extends ItemSheet {
    
    get template() {
        const path = 'systems/ore/templates/item/';
        return `${path}${this.item.type}sheet.hbs`;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['ore', 'sheet', 'item', 'item-sheet'],
            width: 480,
            height: 240,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheetbody", initial: "main"}],
            dragDrop: [{dragSelector: ".dragline", dropSelector: null}]
            });
    }

    getData () {
        const itemData = this.item.system;
        itemData.config = CONFIG.ore; 
        itemData.img = this.item.img;
        itemData.name = this.item.name;
        itemData.type = this.item.type;
        
        console.warn("Item Data for sheet: ", itemData);
        
        return itemData;
    }
}