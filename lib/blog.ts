// Blog content is served from Supabase (`posts` + `categories` tables).
// Uses the public anon key over PostgREST; row-level security limits it to published posts.

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

// Re-fetch from Supabase at most once a minute (ISR).
const REVALIDATE_SECONDS = 60

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  image: string | null
  imageAlt: string
  category: string
  date: string
  readTime: string
  author: string
  tags: string[]
  seoTitle: string | null
  seoDescription: string | null
  ogImage: string | null
}

type PostRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  read_time: number | null
  author: string | null
  tags: string[] | null
  featured_image_url: string | null
  featured_image_alt: string | null
  published_at: string | null
  created_at: string
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  category: { name: string } | null
}

const LIST_FIELDS =
  'id,slug,title,excerpt,read_time,author,tags,featured_image_url,featured_image_alt,published_at,created_at,seo_title,seo_description,og_image_url,category:categories(name)'

async function query(params: string): Promise<PostRow[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[blog] SUPABASE_URL / SUPABASE_ANON_KEY are not set')
    return []
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?${params}`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['posts'] },
    })
    if (!res.ok) {
      console.error(`[blog] Supabase request failed: ${res.status} ${await res.text()}`)
      return []
    }
    return res.json()
  } catch (err) {
    console.error('[blog] Supabase request error', err)
    return []
  }
}

function toPost(row: PostRow): BlogPost {
  const published = row.published_at ?? row.created_at
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content ?? '',
    image: row.featured_image_url,
    imageAlt: row.featured_image_alt || row.title,
    category: row.category?.name ?? 'Writing',
    date: new Date(published).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: row.read_time ? `${row.read_time} min read` : '',
    author: row.author ?? '',
    tags: row.tags ?? [],
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    ogImage: row.og_image_url || row.featured_image_url,
  }
}

/** All published posts, newest first (no body content). */
export async function getPosts(): Promise<BlogPost[]> {
  const rows = await query(`select=${LIST_FIELDS}&status=eq.published&order=published_at.desc.nullslast`)
  return rows.map(toPost)
}

/** A single published post including its HTML content. */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await query(
    `select=${LIST_FIELDS},content&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  )
  return rows[0] ? toPost(rows[0]) : null
}
