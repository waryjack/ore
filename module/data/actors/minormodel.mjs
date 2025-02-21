const {
    HTMLField, SchemaField, NumberField, StringField, BooleanField, FilePathField, ObjectField
  } = foundry.data.fields;

  export default class OreMinorActorData extends OreBaseModel {
      static defineSchema() {
        const baseSchema = super.defineSchema();
        return {
          ...baseSchema,
          hitlocs: new SchemaField(this._hitLocSchema(6))
        }
      }
    
      prepareDerivedData() {
  
      }
  }
  
  