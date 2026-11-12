import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import { NextResponse, type NextRequest } from "next/server";
import { guideTag, isGuideSlug, revalidateSecretFor } from "@/sanity/guides";

/*
 * Sanity webhook → refresh one guide's pages right after they publish.
 * One webhook per guide's Sanity project (sanity.io/manage → API → Webhooks):
 *   URL:     https://<your-site>/api/revalidate?guide=<slug>
 *   Trigger: create, update, delete
 *   Secret:  SANITY_REVALIDATE_SECRET_<SLUG> (e.g. SANITY_REVALIDATE_SECRET_NISHAN_SILVA)
 */
export async function POST(req: NextRequest) {
  const guide = req.nextUrl.searchParams.get("guide") ?? "";
  if (!isGuideSlug(guide)) return NextResponse.json({ message: `Unknown guide "${guide}"` }, { status: 404 });

  const secret = revalidateSecretFor(guide);
  if (!secret) return NextResponse.json({ message: `No webhook secret configured for "${guide}"` }, { status: 500 });

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; _id?: string }>(req, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });

    // Expires this guide's pages (and the landing-page card, which reads the same content).
    revalidateTag(guideTag(guide), { expire: 0 });
    return NextResponse.json({ revalidated: true, guide, type: body?._type, id: body?._id, now: Date.now() });
  } catch (err) {
    console.error("[revalidate]", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
