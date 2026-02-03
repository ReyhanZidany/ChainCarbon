
import db from "../config/db.js";

async function resetDb() {
    const tables = [
        "certificate_transactions",
        "certificates",
        "projects",
        "audits",
        // "notification_settings" // Optional, maybe keep settings?
    ];

    console.log("\n⚠️  Starting Database Reset (MySQL -> Blockchain Sync)...");

    // 1. Truncate Tables
    for (const table of tables) {
        await new Promise(resolve => {
            db.query(`TRUNCATE TABLE ${table}`, (err) => {
                // Ignore if table doesn't exist
                if (err && err.code !== 'ER_NO_SUCH_TABLE') {
                    console.error(`❌ Failed to truncate ${table}:`, err.message);
                } else {
                    console.log(`✅ Truncated ${table}`);
                }
                resolve();
            });
        });
    }

    // 2. Reset Users validation status
    // We keep the users but force them to re-validate so they get registered on the new blockchain
    await new Promise(resolve => {
        db.query("UPDATE users SET is_validated = 0, rejected_reason = NULL", (err, result) => {
            if (err) console.error("❌ Failed to reset users:", err.message);
            else console.log(`✅ Reset ${result.affectedRows} users to 'pending' status (is_validated=0)`);
            resolve();
        });
    });

    console.log("\n🎉 Database sync complete. You can now:");
    console.log("   1. Log in as Regulator");
    console.log("   2. Go to 'Pending Users'");
    console.log("   3. Re-approve users to register them on the blockchain.");

    setTimeout(() => process.exit(0), 1000);
}

resetDb();
