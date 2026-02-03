
import db from "../config/db.js";

async function checkStats() {
    const queries = [
        "SELECT COUNT(*) as count FROM users",
        "SELECT COUNT(*) as count FROM projects",
        "SELECT COUNT(*) as count FROM certificates",
        "SELECT COUNT(*) as count FROM certificate_transactions",
        "SELECT COUNT(*) as count FROM users WHERE is_validated = 1"
    ];

    const tables = ["users", "projects", "certificates", "transactions", "validated_users"];

    console.log("\n📊 Database Statistics:");

    for (let i = 0; i < queries.length; i++) {
        await new Promise(resolve => {
            db.query(queries[i], (err, rows) => {
                if (err) console.error(`❌ ${tables[i]}: Error`, err.message);
                else console.log(`   ${tables[i]}: ${rows[0].count}`);
                resolve();
            });
        });
    }

    process.exit(0);
}

checkStats();
