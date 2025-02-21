const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;

export default class OreBaseItemData extends foundry.abstract.TypeModel {
    static defineSchema() {
        return {
            description: new HTMLField({initial:""}),
            cost: new StringField({initial:""}),
            dicepool: new SchemaField({
                base: new NumberField({required:true, min:0, initial:0}),
                expert: new NumberField({required:true, min:0, initial:0}),
                master: new NumberField({required:true, min:0, initial:0})
            })
        }
    }

    _damageSchema() {
        return {
            text: new StringField({required:true, initial:""}),
            shock: new NumberField({required:true, initial:0, integer:true, min:0}),
            killing: new NumberField({required:true, initial:0, integer:true, min:0})
        }
    }
}