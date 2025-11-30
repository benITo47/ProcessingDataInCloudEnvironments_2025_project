// --- TYPE DEFINITIONS ---

// For the main recipe search results
export interface Recipe {
  name: string;
  ingredients: string[];
  missingCount: number;
}

// For the admin panel recipe list
export interface AdminRecipe {
  name: string;
  ingredients: string[];
}

// For API error responses
export interface ApiError {
  error: string;
}

// For the main navigation tabs
export type ActiveTab = "search" | "add" | "admin";
