import type { Template } from "./App";

export const ALL_TEMPLATE_CATEGORIES = "Semua";
export const FREE_TEMPLATE_CATEGORY = "Free";

export function templateCategories(templates: Template[]) {
  const styles = new Set(templates.map((template) => template.category));
  styles.delete(FREE_TEMPLATE_CATEGORY);
  styles.delete(ALL_TEMPLATE_CATEGORIES);
  return [ALL_TEMPLATE_CATEGORIES, FREE_TEMPLATE_CATEGORY, ...styles];
}

export function matchesTemplateCategory(template: Template, category: string) {
  if (category === ALL_TEMPLATE_CATEGORIES) return true;
  if (category === FREE_TEMPLATE_CATEGORY) return Boolean(template.isFree);
  return template.category === category;
}
