import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { guides, hasSanity } from "../../../sanity/guides";

export const dynamic = "force-static";

export default function StudioPage() {
  // Server-side check (the config module itself is a client reference here).
  const hasWorkspace = Object.values(guides).some(hasSanity);
  if (!hasWorkspace) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "80px auto", padding: "0 20px", lineHeight: 1.6 }}>
        <h1>No Sanity projects configured</h1>
        <p>
          Add your guides to <code>NEXT_PUBLIC_GUIDES</code> in <code>.env</code>, e.g.{" "}
          <code>{`{"nishan-silva":{"projectId":"abc12345","dataset":"production"}}`}</code>, then restart the dev server.
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
