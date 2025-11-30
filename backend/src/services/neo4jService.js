const neo4j = require("neo4j-driver");
const toTitleCase = require("../utils/toTitleCase");

let driver;

function initDriver() {
  driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
  );

  driver.verifyConnectivity()
    .then(() => console.log("✅ Connected to Neo4j AuraDB"))
    .catch(error => console.error("❌ Neo4j connection failed:", error));
  
  return driver;
}

function getDriver() {
  if (!driver) {
    throw new Error('Neo4j driver not initialized.');
  }
  return driver;
}

async function runQuery(query, params) {
  const session = getDriver().session();
  try {
    const result = await session.run(query, params);
    return result.records;
  } finally {
    await session.close();
  }
}

// --- Public Functions ---

async function getIngredients() {
  const records = await runQuery("MATCH (i:Ingredient) RETURN i.name AS name ORDER BY i.name");
  return records.map((record) => record.get("name"));
}

async function searchRecipes(myIngredients) {
  const normalizedIngredients = myIngredients.map(toTitleCase);
  const query = `
    MATCH (r:Recipe)
    CALL {
        WITH r
        MATCH (r)-[:CONTAINS]->(ing:Ingredient)
        RETURN collect(ing.name) as allRequired
    }
    CALL {
        WITH r
        MATCH (r)-[:CONTAINS]->(owned:Ingredient)
        WHERE owned.name IN $list
        RETURN count(owned) as ownedCount
    }
    WITH r, allRequired, ownedCount
    WHERE size(allRequired) > 0 AND ownedCount > 0
    RETURN
      r.name AS recipeName,
      allRequired,
      (size(allRequired) - ownedCount) AS missingCount
    ORDER BY missingCount ASC, r.name ASC
  `;
  const records = await runQuery(query, { list: normalizedIngredients });
  return records.map((record) => ({
    name: record.get("recipeName"),
    ingredients: record.get("allRequired"),
    missingCount: record.get("missingCount").toInt(),
  }));
}

async function addRecipe(name, ingredients) {
  const recipeName = toTitleCase(name);
  const ingredientList = ingredients.map(toTitleCase).filter(Boolean);
  const query = `
    MERGE (r:Recipe {name: $rName})
    WITH r
    UNWIND $ingList AS ingName
    MERGE (i:Ingredient {name: ingName})
    MERGE (r)-[:CONTAINS]->(i)
    RETURN r
  `;
  await runQuery(query, { rName: recipeName, ingList: ingredientList });
}

// --- Admin Functions ---

async function getAdminRecipes() {
    const query = `
      MATCH (r:Recipe)
      OPTIONAL MATCH (r)-[:CONTAINS]->(i:Ingredient)
      RETURN r.name AS name, collect(i.name) AS ingredients
      ORDER BY name
    `;
    const records = await runQuery(query);
    return records.map(record => ({
      name: record.get('name'),
      ingredients: record.get('ingredients')
    }));
}

async function updateRecipe(oldName, newName, ingredients) {
  const session = getDriver().session();
  try {
    await session.writeTransaction(async txc => {
      await txc.run(`MATCH (r:Recipe {name: $oldName}) SET r.name = $newName`, { oldName, newName });
      await txc.run(`MATCH (r:Recipe {name: $newName})-[rel:CONTAINS]->() DELETE rel`, { newName });
      if (ingredients.length > 0) {
        await txc.run(
          `
            MATCH (r:Recipe {name: $newName})
            UNWIND $ingredients AS ingredientName
            MERGE (i:Ingredient {name: ingredientName})
            MERGE (r)-[:CONTAINS]->(i)
          `,
          { newName, ingredients: ingredients.map(toTitleCase).filter(Boolean) }
        );
      }
    });
  } finally {
    await session.close();
  }
}

async function deleteRecipe(name) {
  await runQuery("MATCH (r:Recipe {name: $name}) DETACH DELETE r", { name });
}

async function deleteIngredient(name) {
  const session = getDriver().session();
  try {
    const checkResult = await session.run(
      `MATCH (i:Ingredient {name: $name})<-[r:CONTAINS]-() RETURN count(r) as usageCount`,
      { name }
    );
    const usageCount = checkResult.records[0].get("usageCount").toInt();

    if (usageCount > 0) {
      throw new Error(`Cannot delete ingredient '${name}' because it is used in ${usageCount} recipe(s).`);
    }

    await session.run("MATCH (i:Ingredient {name: $name}) DELETE i", { name });
  } finally {
    await session.close();
  }
}

module.exports = {
  initDriver,
  getDriver,
  getIngredients,
  searchRecipes,
  addRecipe,
  getAdminRecipes,
  updateRecipe,
  deleteRecipe,
  deleteIngredient,
};
