import { jsonLdString } from "@/lib/seo";

/** Inline schema.org JSON-LD (server-rendered; "<" is escaped so content can't close the tag). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json">{jsonLdString(data)}</script>;
}
