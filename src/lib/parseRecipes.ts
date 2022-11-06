export interface RecipeType {
  title: string;
  titleText: string;
  subtitle: string;
  body: string[];
  steps: RecipeStepType[];
}

export interface RecipeStepType {
  title: string;
  ingredients: string[];
  body: string[];
}

const parseRecipes = (str: string): RecipeType[] => {
  let recipes: RecipeType[] = [];

  str.split("\n").forEach((line) => {
    const titleMatch = line.match(/^#{1} (.*)/);
    const stepMatch = line.match(/^#{2} (.*)/);
    const ingredientMatch = line.match(/^[-\*] (.*)/);

    if (titleMatch) {
      const [title, ...subtitle] = titleMatch[1].split("|");
      const titleText = title.match(/\[(.*)\]/)?.[1] || title;

      // push a new recipe onto the array
      recipes.push({
        title,
        titleText,
        subtitle: subtitle.join(" | "),
        body: [],
        steps: [],
      });
    } else if (recipes.length > 0) {
      const recipe = recipes[recipes.length - 1];

      if (stepMatch) {
        // push a step onto the last recipe
        recipe.steps.push({
          title: stepMatch[1],
          ingredients: [],
          body: [],
        });
      } else if (recipe.steps.length == 0) {
        // no steps parsed yet, push onto recipe body
        if (recipe.body.length > 0 || line) {
          recipe.body.push(line);
        }
      } else {
        const step = recipe.steps[recipe.steps.length - 1];

        // push ingredient or body onto the last step
        if (ingredientMatch) {
          step.ingredients.push(line);
        } else {
          if (step.body.length > 0 || line) {
            step.body.push(line);
          }
        }
      }
    }
  });

  return recipes;
};

export default parseRecipes;
