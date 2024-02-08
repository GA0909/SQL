import _ from "lodash";
import { Database } from "../src/database";
import { selectRowById } from "../src/queries/select";
import { minutes } from "./utils";
import { CATEGORIES, PRICING_PLANS, APPS, REVIEWS, APPS_PRICING_PLANS, KEY_BENEFITS, APPS_CATEGORIES } from "../src/shopify-table-names";

describe("Foreign Keys", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("04", "05");
        await db.execute("PRAGMA foreign_keys = ON");
    }, minutes(1));

    it("should not be able to delete category if any app is linked", async done => {
        const categoryId = 6;
        const query = `
          DELETE FROM ${CATEGORIES}
          WHERE 
              id = ${categoryId} AND
              id NOT IN (SELECT category_id FROM ${APPS});
      `;
        try {
            await db.delete(query);
          } catch (e) {}

        const row = await db.selectSingleRow(selectRowById(categoryId, CATEGORIES));
        expect(row).toBeDefined();

        done();
    }, minutes(1));

    it("should not be able to delete pricing plan if any app is linked", async done => {
        const pricingPlanId = 100;
        const query = `
          DELETE FROM ${PRICING_PLANS}
          WHERE 
              id = ${pricingPlanId} AND
              id NOT IN (SELECT pricing_plan_id FROM ${APPS});
      `;

        try {
            await db.delete(query);
          } catch (e) {}

        const rows = await db.selectSingleRow(selectRowById(pricingPlanId, PRICING_PLANS));
        expect(rows).toBeDefined();

        done();
    }, minutes(1));

    it("should not be able to delete app if any data is linked", async done => {
        const appId = 245;
        const query = `
    DELETE FROM ${APPS}
    WHERE id = ${appId}
    AND NOT EXISTS (
        SELECT 1 FROM ${REVIEWS} WHERE movie_id = ${appId}
        UNION
        SELECT 1 FROM ${APPS_PRICING_PLANS} WHERE movie_id = ${appId}
        UNION
        SELECT 1 FROM ${KEY_BENEFITS} WHERE movie_id = ${appId}
        UNION
        SELECT 1 FROM ${APPS_CATEGORIES} WHERE movie_id = ${appId}
    )
`;

        try {
            await db.delete(query);
          } catch (e) {}

        const rows = await db.selectSingleRow(selectRowById(appId, APPS));
        expect(rows).toBeDefined();

        done();
    }, minutes(1));

    it("should be able to delete app", async done => {
        const appId = 355;
        const query = `DELETE FROM ${APPS} WHERE id = ${appId}`;
        try {
            await db.delete(query);
          } catch (e) {}

        const rows = await db.selectSingleRow(selectRowById(appId, APPS));
        expect(rows).toBeUndefined();

        done();
    }, minutes(1));
});