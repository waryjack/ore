export default class OneRollItemSheet extends ItemSheet {
    
    get template() {
        const path = 'systems/ore/templates/item/';
        return `${path}${this.item.type}sheet.hbs`;
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