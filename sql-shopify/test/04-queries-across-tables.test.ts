import { Database } from "../src/database";
import { APPS_CATEGORIES, APPS_PRICING_PLANS, CATEGORIES, PRICING_PLANS } from "../src/shopify-table-names";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("03", "04");
    }, minutes(1));

    it("should select count of apps which have free pricing plan", async done => {
        const query = `
        SELECT COUNT(DISTINCT app_id) AS count
        FROM ${APPS_PRICING_PLANS}
        WHERE pricing_plan_id IN (1, 13);
        `;
        const result = await db.selectSingleRow(query);
        expect(result).toEqual({
            count: 1112
        });
        done();
    }, minutes(1));

    it("should select top 3 most common categories", async done => {
        const query = `
        SELECT c.title AS category, COUNT(ac.app_id) AS count
        FROM ${CATEGORIES} c
        JOIN ${APPS_CATEGORIES} ac ON c.id = ac.category_id
        GROUP BY c.title
        ORDER BY COUNT(ac.app_id) DESC
        LIMIT 3;
        `;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 1193, category: "Store design" },
            { count: 723, category: "Sales and conversion optimization" },
            { count: 629, category: "Marketing" }
        ]);
        done();
    }, minutes(1));

    it("should select top 3 prices by appearance in apps and in price range from $5 to $10 inclusive (not matters monthly or one time payment)", async done => {
        const query = `
        SELECT 
    COUNT(*) AS count,
    CONCAT('$', REPLACE(REPLACE(REPLACE(price, '$', ''), '/month', ''), ' one time charge', ''), '/month') AS price,
    CAST(REPLACE(REPLACE(REPLACE(price, '$', ''), '/month', ''), ' one time charge', '') AS DECIMAL(10, 2)) AS casted_price
FROM 
    pricing_plans pp
JOIN 
    apps_pricing_plans ap ON pp.id = ap.pricing_plan_id
GROUP BY 
    casted_price
HAVING 
    casted_price BETWEEN 5 AND 10
ORDER BY 
    count DESC
LIMIT 3;


        `;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 225, price: "$9.99/month", casted_price: 9.99 },
            { count: 135, price: "$5/month", casted_price: 5 },
            { count: 114, price: "$10/month", casted_price: 10 }
        ]);
        done();
    }, minutes(1));
});