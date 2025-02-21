const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OreArmorData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            armortype: new StringField({initial:""}),
            protect: new SchemaField({
                shock: new NumberField({integer:true, required:true, initial:0, min:0}),
                killing: new NumberField({integer:true, required:true, initial:0, min:0})
            }),
            linkto: new TypeDataModel(foundry.abstract.document.BaseItem),
        }
    }
}