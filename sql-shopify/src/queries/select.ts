import { APPS_CATEGORIES, CATEGORIES } from "../shopify-table-names";

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
      SELECT * FROM ${CATEGORIES} WHERE title = ${title};
  `;
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `
      SELECT * FROM ${APPS_CATEGORIES} WHERE app_id = ${appId};
  `;
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  throw new Error(`todo`);
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  throw new Error(`todo`);
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  throw new Error(`todo`);
};

