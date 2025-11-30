import { Recipe, AdminRecipe, ApiError } from "./types";

const API_URL = "http://localhost:2067/api";

// --- Helper for handling fetch responses ---
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err: ApiError = await response.json();
    throw new Error(err.error || "An API error occurred");
  }
  return response.json();
}

// --- Public API Calls ---

export const fetchIngredients = (): Promise<string[]> => {
  return fetch(`${API_URL}/ingredients`).then(res => handleResponse<string[]>(res));
};

export const searchRecipes = (myIngredients: string[]): Promise<Recipe[]> => {
  return fetch(`${API_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ myIngredients }),
  }).then(res => handleResponse<Recipe[]>(res));
};

export const addRecipe = (password: string, name: string, ingredients: string[]): Promise<{ message: string }> => {
  return adminFetch(`${API_URL}/admin/recipes`, password, {
    method: 'POST',
    body: JSON.stringify({ name, ingredients }),
  });
};

// --- Admin API Calls ---

export const adminLogin = (password: string): Promise<{ success: boolean }> => {
  return fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  }).then(res => handleResponse<{ success: boolean }>(res));
};

// --- Helper for authenticated admin fetch calls ---
async function adminFetch<T>(url: string, password: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    Authorization: password,
  };
  const response = await fetch(url, { ...options, headers });
  return handleResponse<T>(response);
}

export const fetchAdminRecipes = (password: string): Promise<AdminRecipe[]> => {
  return adminFetch(`${API_URL}/admin/recipes`, password);
};

export const updateRecipe = (password: string, oldName: string, newName: string, ingredients: string[]): Promise<{ message: string }> => {
  return adminFetch(`${API_URL}/admin/recipes`, password, {
    method: 'PUT',
    body: JSON.stringify({ oldName, newName, ingredients }),
  });
};

export const deleteRecipe = (password: string, recipeName: string): Promise<{ message: string }> => {
  return adminFetch(`${API_URL}/admin/recipes/${recipeName}`, password, {
    method: 'DELETE',
  });
};

export const deleteIngredient = (password: string, ingredientName: string): Promise<{ message: string }> => {
  return adminFetch(`${API_URL}/admin/ingredients/${ingredientName}`, password, {
    method: 'DELETE',
  });
};
