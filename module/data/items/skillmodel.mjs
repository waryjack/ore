const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OreSkillData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            mod: new NumberField({required:true, initial:0, integer:true}),
            specialized: new BooleanField({required:true, initial:false}),
            specialty: new StringField({required:true, initial:""}),
            linkstat: new TypeDataField(foundry.abstract.document.BaseItem) // how to place a connected stat in here?
        }
    }
}