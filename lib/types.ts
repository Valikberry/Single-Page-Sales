export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  image: string
  category: string
  protein: number
  calories: number
  carbs: number
  fat: number
  ingredients: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Category {
  id: string
  name: string
}

export interface CategoryWithDescription {
  id: string
  name: string
  description: string
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  image: string
}

export interface Recipe {
  id: string
  title: string
  time: string
  calories: number
  protein: number
  image: string
  difficulty: string
  servings: number
  ingredients: string[]
  instructions: string[]
  nutritionFacts: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
    sugar: number
  }
  tips: string[]
}
