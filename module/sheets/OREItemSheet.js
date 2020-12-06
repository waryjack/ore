export class OREItemSheet extends ItemSheet {
    get template() {
        return "systems/ore/templates/sheets/weapon-sheet.hbs";
    }

    getData () {
        const data = super.getData();

        data.config = CONFIG.ore; 
      
        return data;
    }
}