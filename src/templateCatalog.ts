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

type PackageBenefit = readonly [id: string, en: string];

const commonBenefits: PackageBenefit[] = [
  ["Live Chat", "Live Chat"],
  ["Panduan penggunaan oleh CS", "Guidance from Customer Support"],
  ["Lagu", "Music"],
  ["Maps", "Maps"],
  ["Gift", "Gifts"],
  ["RSVP", "RSVP"],
  ["Gallery", "Gallery"],
];

const staticDesktop: PackageBenefit = [
  "Tampilan desktop bawaan (statis)",
  "Default desktop layout (static)",
];
const designerBenefits: PackageBenefit[] = [
  ["Pendampingan Web Designer", "Web Designer assistance"],
  ["QR Check-in", "QR check-in"],
  ["Penyesuaian tampilan desktop", "Desktop layout adjustments"],
  ["Bantuan input data dan foto oleh tim", "Data and photo entry by our team"],
];

export function templatePackageBenefits(packageName: string): PackageBenefit[] {
  switch (packageName) {
    case "Basic":
      return [["Koleksi template Basic", "Basic template collection"], ...commonBenefits, staticDesktop];
    case "Advanced":
      return [
        ["Koleksi template Advanced", "Advanced template collection"],
        ...commonBenefits,
        ["Desktop default template", "Default desktop layout"],
        ["Penyesuaian tampilan desktop mandiri", "Self-service desktop layout adjustments"],
      ];
    case "Premium":
      return [
        ["Koleksi template Premium", "Premium template collection"],
        ...commonBenefits,
        ...designerBenefits,
        ["Penyesuaian oleh tim hingga 3 kali", "Up to 3 rounds of adjustments by our team"],
      ];
    case "Custom":
      return [
        ...commonBenefits,
        ...designerBenefits,
        ["Multi-Language", "Multiple languages"],
        ["Desain / UI/UX sendiri", "Custom UI/UX design"],
        ["Penyesuaian oleh tim sesuai lingkup", "Team adjustments within the agreed scope"],
      ];
    default:
      return [...commonBenefits, staticDesktop];
  }
}
