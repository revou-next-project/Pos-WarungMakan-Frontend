"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ChefHat, Plus, Trash2, Edit } from "lucide-react";
import { recipeAPI, inventoryAPI } from "@/lib/api";
import { InventoryItem } from "@/models/InventoryItems";
import { RecipeData, ingredients } from "@/models/RecipeData";
import { ca } from "date-fns/locale";
import Navside from "@/components/navside/navside";
import TableRecipes from "@/components/pos/recipe-components/TableRecipes";
import { useRecipe } from "@/contexts/recipeContext";


export default function RecipesPage() {
  const router = useRouter();

  const { isEditDialogOpen, isDeleteDialogOpen } = useRecipe();
  // const [recipes, setRecipes] = useState(mockRecipes);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  // const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [toDeleteId, setToDeleteId] = useState<number>(0);
  // const [isViewIngredientsDialogOpen, setIsViewIngredientsDialogOpen] = useState(false);
  // const [currentRecipe, setCurrentRecipe] = useState<RecipeData>({
  //   id: 0,
  //   recipe_id: 0,
  //   name: "",
  //   description: "",
  //   category: "",
  //   ingredients: [],
  // });
  const [newIngredient, setNewIngredient] = useState<ingredients>({
    id: 0,
    name: "",
    quantity: 0,
    unit: "",
  });

  const [newRecipe, setNewRecipe] = useState<RecipeData>({
    id: 0,
    recipe_id: 0,
    name: "",
    description: "",
    category: "",
    ingredients: [],
  });

  // Categories for recipes
  const recipeCategories = ["Food", "Drinks", "Snacks", "Packages"];

  // In a real implementation, this would fetch from the API
  useEffect(() => {
    try {
      recipeAPI.getAll().then((data) => {
        setRecipes(data);
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }

    try {
      inventoryAPI.getAll().then((data) => {
        setInventoryItems(data);
      });
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  }, [isAddDialogOpen, isEditDialogOpen, isDeleteDialogOpen]);

  const handleAddRecipe = () => {
    try {
      recipeAPI.createRecipe(newRecipe);
    } catch (error) {
      console.error("Error adding recipe:", error);
    } finally {
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleAddIngredient = () => {
    // Find the selected inventory item to get its unit
    const selectedItem = inventoryItems.find((item) => item.name === newIngredient.name);

    if (selectedItem) {
      const ingredientToAdd = {
        ...newIngredient,
        id: Date.now(), // Generate a temporary ID
        unit: selectedItem.unit,
      };

      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, ingredientToAdd],
      });

      // Reset the new ingredient form
      setNewIngredient({
        id: 0,
        name: "",
        quantity: 0,
        unit: "",
      });
    }
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter((ingredient) => ingredient.id !== ingredientId),
    });
  };

  const resetForm = () => {
    setNewRecipe({
      id: 0,
      recipe_id: 0,
      name: "",
      description: "",
      category: "",
      ingredients: [],
    });
    setNewIngredient({
      id: 0,
      name: "",
      quantity: 0,
      unit: "",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <Navside />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Recipe Management</h1>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Recipe
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe List</CardTitle>
              <CardDescription>Manage your recipes and their ingredients.</CardDescription>
            </CardHeader>
            <CardContent>
              <TableRecipes recipes={recipes} inventoryItems={inventoryItems}/>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add Recipe Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Recipe</DialogTitle>
            <DialogDescription>Create a new recipe with ingredients.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input id="name" className="col-span-3" value={newRecipe.name} onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right">
                Category
              </label>
              <Select value={newRecipe.category} onValueChange={(value) => setNewRecipe({ ...newRecipe, category: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {recipeCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Input
                id="description"
                className="col-span-3"
                value={newRecipe.description}
                onChange={(e) =>
                  setNewRecipe({
                    ...newRecipe,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-2">Ingredients</h4>
              <div className="space-y-4">
                {newRecipe.ingredients.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newRecipe.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>{ingredient.quantity}</TableCell>
                          <TableCell>{ingredient.unit}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(ingredient.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-muted-foreground">No ingredients added yet.</p>
                )}

                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Select value={newIngredient.name} onValueChange={(value) => setNewIngredient({ ...newIngredient, name: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ingredient" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name} ({item.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      // placeholder="Quantity"
                      value={newIngredient.quantity || 0}
                      step="any"
                      inputMode="decimal"
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = parseFloat(value);
                        setNewIngredient({
                          ...newIngredient,
                          quantity: !isNaN(parsedValue) ? parsedValue : 0, // Parse as number and handle invalid input
                        });
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm">{inventoryItems.find((item) => item.name === newIngredient.name)?.unit || ""}</span>
                  </div>
                  <div className="col-span-2">
                    <Button onClick={handleAddIngredient} disabled={!newIngredient.name || !newIngredient.quantity} className="w-full">
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddRecipe} disabled={!newRecipe.name || !newRecipe.category || newRecipe.ingredients.length === 0}>
              Save Recipe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
