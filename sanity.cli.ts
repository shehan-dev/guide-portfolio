import { defineCliConfig } from "sanity/cli";
import { cliGuide } from "./src/sanity/cliGuide";

// CLI commands (login, hook list, …) act on one guide's project: the one named
// by the GUIDE env var, or the registry's only guide. Commands that don't need
// a project (e.g. `sanity login`) still work when the choice is ambiguous.
let api: { projectId?: string; dataset?: string } = {};
try {
  const { config } = cliGuide();
  api = { projectId: config.projectId, dataset: config.dataset };
} catch (err) {
  if (process.env.GUIDE) throw err;
}

export default defineCliConfig({ api });
