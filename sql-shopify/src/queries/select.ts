import { APPS_CATEGORIES, CATEGORIES, REVIEWS } from "../shopify-table-names";

export const selectCount = (table: string): string => {
  return `
      SELECT COUNT(*) AS count FROM ${table};
  `;
};

export const selectRowById = (id: number, table: string): string => {
  return `
      SELECT * FROM ${table} WHERE id = ${id};
  `;
};


export const selectCategoryByTitle = (title: string): string => {
  return `
      SELECT * FROM ${CATEGORIES} WHERE title = '${title}';
  `;
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `
  SELECT 
  a.title AS app_title,
  ac.category_id,
  c.title AS category_title
FROM 
  apps AS a
JOIN 
  apps_categories AS ac ON a.id = ac.app_id
JOIN 
  categories AS c ON ac.category_id = c.id
WHERE 
  a.id = ${appId};

  `;
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return `
    SELECT COUNT(DISTINCT ${columnName}) AS count FROM ${tableName};
  `;
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return `
    SELECT * FROM ${REVIEWS} WHERE app_id = ${appId} AND author = '${author}';
  `;
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return `
    SELECT ${columnName} FROM ${tableName};
  `;
};
