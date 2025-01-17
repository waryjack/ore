export const preloadHandlebarsTemplates = async function() {
    return loadTemplates([
      // Actor Sheet Partials
      "systems/ore/templates/partials/stats.hbs",
      "systems/ore/templates/partials/stats-h.hbs",
      "systems/ore/templates/partials/skills.hbs",
      "systems/ore/templates/partials/armor.hbs",
      "systems/ore/templates/partials/equipment.hbs",
      "systems/ore/templates/partials/hitlocs.hbs",
      "systems/ore/templates/partials/pools.hbs",
      "systems/ore/templates/partials/powers.hbs",
      "systems/ore/templates/partials/qualities.hbs",
      "systems/ore/templates/partials/weapons.hbs",
      "systems/ore/templates/partials/rollresults.hbs"
    ]);
  };
  