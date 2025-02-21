const { StringField, HTMLField, NumberField, SchemaField, ArrayField, BooleanField } = foundry.data.fields;
import OreBaseItemData from "./baseitemmodel.mjs";

export default class OreQualityData extends OreBaseItemData {
    static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
            ...baseSchema,
            bon_to: new StringField({initial:""}),
            pen_to: new StringField({initial:""}),
            grants: new StringField({initial:""}),
            restrictions: new StringField({initial:""}),
            prereqs: new StringField({initial:""})
        }
    }
}