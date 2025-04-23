export interface RecipeData {
    id: number;
    name: string;
    desciption: string;
    category: string;
    ingredients: ingredients[];
}

export interface ingredients {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}