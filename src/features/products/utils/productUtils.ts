interface CategoryNode {
  id: number;
  name: string;
  children?: CategoryNode[];
}

/**
 * Đệ quy chuyển đổi cấu trúc cây danh mục thành mảng phẳng để dùng trong Select
 */
export const flattenCategories = (
  cats: CategoryNode[],
  prefix = '',
): { id: number; name: string }[] => {
  return cats.reduce(
    (acc, cat) => {
      acc.push({ id: cat.id, name: `${prefix}${cat.name}` });
      if (cat.children && cat.children.length > 0) {
        acc.push(...flattenCategories(cat.children, `${prefix}— `));
      }
      return acc;
    },
    [] as { id: number; name: string }[],
  );
};
