import "../bootstrap-env";
import { seedAdmin } from "./seed-admin";
import { seedRoles } from "./seed-roles";

async function runSeeds() {
    console.log("Starting seed process...");

    await seedRoles();
    await seedAdmin();

    console.log("Seed process completed.");
}

runSeeds()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error("Seed process failed.");
        console.error(error);
        process.exit(1);
    });