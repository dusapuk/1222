/**
 * Blog content store.
 *
 * The blog targets high-intent commercial Persian queries
 * («خرید اکانت ChatGPT Plus», «خرید Midjourney», ...) and every post links
 * to a real service slug from the marketplace. Each post:
 *   - has its own `<h1>` in DOM order (SEO),
 *   - emits `Article` JSON-LD + `BreadcrumbList`,
 *   - includes 2+ inline CTAs (`AppLink`) and a sticky purchase block
 *     pointing to the primary service / category page.
 *
 * Posts are authored as plain TS data (no MDX) on purpose: the prerender
 * step has to read them from a Node script, and TS-as-data sidesteps the
 * ESM/JSX-loader complexity. If the operator wants to edit copy they
 * just edit this file — no markdown pipeline needed.
 *
 * Keep posts order-stable: the public `/blog` index renders in the order
 * they appear in `BLOG_POSTS` (newest first).
 */

import {
  BLOG_AUTHOR_NAME,
  PRIMARY_AUTHOR_NAME,
  PRIMARY_AUTHOR_URL,
  getPrimaryAuthorSameAs,
} from './seo'

export type BlogParagraph = string

export type BlogSection = {
  /** Persian H2/H3 heading (rendered as h2 by default). */
  heading: string
  /** Optional sub-heading level — defaults to "h2". Use "h3" for nested. */
  level?: 'h2' | 'h3'
  /**
   * Body paragraphs. Each entry is plain Persian text. Paragraphs may
   * contain inline `[anchor](slug)` markup — the renderer turns those
   * into in-app `<AppLink>` anchors so they stay SEO-real (`<a href>`)
   * AND they bypass the SPA reload. Leave the markup off to render
   * a plain paragraph.
   */
  body?: BlogParagraph[]
  /** Optional bullet list rendered after the body. Plain Persian text. */
  bullets?: string[]
  /** Optional inline CTA at the end of the section. */
  cta?: {
    label: string
    /** In-app path like "/s/chatgpt" or "/c/ai-assistants". */
    path: string
  }
}

export type BlogFaq = {
  question: string
  answer: string
}

export type BlogHowToStep = {
  /** Persian heading («ورود به اکانت», «پرداخت تومانی»...). */
  name: string
  /** Step body — plain Persian text. */
  text: string
  /** Optional illustration (site-relative path). */
  image?: string
  /** Optional anchor URL («به این مرحله برو» in HowTo card). */
  url?: string
}

export type BlogPost = {
  slug: string
  /** Persian H1 — also used in `<title>`. */
  titleFa: string
  /** ASCII-friendly subtitle hint (used in alt-text, og:title fallback). */
  titleEnHint?: string
  /** ~150-char Persian description (meta description + RSS). */
  excerpt: string
  /** Cover image path (site-relative). Defaults to category hero. */
  coverImage: string
  /** Persian alt text for the cover image. */
  coverAlt: string
  /** Hashtag-style keywords (used as `keywords` meta + `Article.keywords`). */
  keywords: string[]
  /** Author name. Defaults to the editorial brand. */
  author: string
  /**
   * Optional author landing page (relative path). When set,
   * `Article.author.url` points here — strong E-E-A-T signal.
   */
  authorUrl?: string
  /**
   * Optional list of public author profiles (LinkedIn, Twitter, ...).
   * Becomes `Article.author.sameAs` so Google can confirm the same
   * Person across the web.
   */
  authorSameAs?: string[]
  /** ISO date the post was first published. */
  datePublished: string
  /** ISO date the post was last edited. Falls back to `datePublished`. */
  dateModified?: string
  /**
   * Primary service the post is selling. Sticky CTA at the top + bottom
   * of the article points here. The post's `Article.about` JSON-LD field
   * also references this service so Google sees the entity association.
   */
  primaryServiceSlug: string
  /** Persian-language label for the primary CTA button. */
  primaryCtaLabel: string
  /** Category the primary service belongs to. */
  primaryCategorySlug: string
  /** Other relevant services to surface in the related-products box. */
  relatedServiceSlugs?: string[]
  /** Body sections, rendered in order. */
  sections: BlogSection[]
  /** FAQ Q&A. Emitted both as visible UI and as `FAQPage` JSON-LD. */
  faq?: BlogFaq[]
  /**
   * Optional how-to steps. When set with at least 2 entries, the post
   * emits a `HowTo` rich result alongside `Article` — picks up the
   * step-by-step SERP card on activation / setup posts.
   */
  howToSteps?: BlogHowToStep[]
  /** ISO 8601 duration for the how-to (e.g. `PT5M`). Defaults to PT5M. */
  howToTotalTime?: string
}

const PUBLISHED = '2026-05-01'
const MODIFIED = '2026-05-10'

/**
 * Default author identity attached to every post in this file. We name
 * a real `Person` (`Dusya`) instead of the brand so `Article.author`
 * resolves to a Person node with `url` + `sameAs` — a strong E-E-A-T
 * signal that ties the post to a verifiable identity rather than the
 * generic editorial team. Posts that genuinely have a different author
 * can still override `author`/`authorUrl`/`authorSameAs` per entry.
 */
const DEFAULT_AUTHOR_NAME = PRIMARY_AUTHOR_NAME
const DEFAULT_AUTHOR_URL = PRIMARY_AUTHOR_URL
function defaultAuthorSameAs(): string[] {
  return getPrimaryAuthorSameAs()
}

// Suppress unused-import warning when no post explicitly references
// the legacy brand-only author (kept exported for backwards-compat).
void BLOG_AUTHOR_NAME

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'buy-chatgpt-plus-iran',
    titleFa: 'خرید اکانت ChatGPT Plus در ایران: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy ChatGPT Plus subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک ChatGPT Plus از ایران در پی‌کارت — قیمت پلن‌ها، تفاوت با نسخه رایگان، روش پرداخت ریالی، تحویل آنی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-assistants.jpg',
    coverAlt: 'خرید اکانت ChatGPT Plus در پی‌کارت',
    keywords: [
      'خرید چت‌جی‌پی‌تی',
      'خرید ChatGPT Plus',
      'اکانت ChatGPT Plus ایران',
      'اشتراک GPT-4',
      'خرید اکانت Open AI',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'chatgpt',
    primaryCtaLabel: 'خرید اکانت ChatGPT Plus',
    primaryCategorySlug: 'ai-assistants',
    relatedServiceSlugs: ['claude', 'gemini'],
    sections: [
      {
        heading: 'چرا ChatGPT Plus بخریم؟',
        body: [
          'اکانت ChatGPT Plus نسخه پولی پلتفرم OpenAI است که دسترسی به مدل GPT-4o، تولید سریع‌تر متن، تولید تصویر با DALL-E، آپلود فایل و تحلیل داده، حافظه گفتگو، Custom GPT و افزونه‌ها را در اختیار شما قرار می‌دهد. اگر از نسخه رایگان (GPT-3.5) استفاده می‌کنید و با محدودیت پاسخ‌گویی، قطع شدن در ساعات شلوغ یا کیفیت پایین خروجی مواجه شده‌اید، ارتقا به Plus کاملاً محسوس است.',
          'برای کاربران ایرانی، خرید مستقیم از سایت OpenAI به دلیل تحریم‌ها و عدم پذیرش کارت‌های ایرانی عملاً غیرممکن است. پی‌کارت این مشکل را با خرید قانونی اکانت‌ها از منابع بین‌المللی و تحویل آنی به کاربر ایرانی، با پرداخت ریالی از طریق درگاه شاپرک، حل کرده است.',
        ],
      },
      {
        heading: 'قیمت اکانت ChatGPT Plus در پی‌کارت',
        body: [
          'پی‌کارت چند پلن مختلف برای ChatGPT Plus ارائه می‌دهد: اکانت یک‌ماهه، سه‌ماهه و سالانه. قیمت هر پلن در صفحه محصول لحظه‌ای به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست OpenAI گاهی به‌روز می‌شود).',
        ],
        bullets: [
          'پلن اکانت اشتراکی یک‌ماهه — مقرون‌به‌صرفه‌ترین گزینه برای تست و استفاده موقت',
          'پلن اکانت اختصاصی یک‌ماهه — ایمیل و رمز اختصاصی، بدون اشتراک با کاربر دیگر',
          'پلن سه‌ماهه — تخفیف نسبت به خرید سه پلن جداگانه',
          'پلن یک‌ساله — بهترین قیمت برای استفاده‌کنندگان حرفه‌ای',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌ها',
          path: '/s/chatgpt',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت ChatGPT Plus شامل ایمیل، رمز عبور و راهنمای فعال‌سازی به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌های ChatGPT Plus در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس ببینید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
        ],
      },
      {
        heading: 'سایر دستیارهای هوش مصنوعی برای مقایسه',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های دیگر بازار را هم بررسی کنید، بد نیست نگاهی به Claude Pro از Anthropic و Gemini Advanced از Google بیندازید. هر سه در دسته «دستیارهای هوش مصنوعی» در پی‌کارت با قیمت ریالی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه دستیارهای هوش مصنوعی',
          path: '/c/ai-assistants',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت ChatGPT Plus خریداری شده از پی‌کارت با شماره ایرانی فعال می‌شود؟',
        answer:
          'اکانت‌هایی که در پی‌کارت می‌فروشیم از قبل با شماره معتبر بین‌المللی فعال‌سازی شده‌اند و نیازی به افزودن شماره ایرانی ندارید؛ کافی است با ایمیل و رمز ارائه‌شده وارد ChatGPT شوید.',
      },
      {
        question: 'آیا برای استفاده از ChatGPT Plus به VPN نیاز دارم؟',
        answer:
          'بله. به دلیل محدودیت‌های جغرافیایی OpenAI، استفاده از یک VPN معتبر برای ورود به ChatGPT الزامی است. این مورد به اکانت ربطی ندارد و برای هر کاربر ایرانی صدق می‌کند.',
      },
      {
        question: 'تفاوت اکانت اشتراکی با اکانت اختصاصی ChatGPT Plus چیست؟',
        answer:
          'در اکانت اشتراکی چند کاربر روی یک اکانت با مدیریت پی‌کارت استفاده می‌کنند و قیمت پایین‌تر است؛ در اکانت اختصاصی ایمیل و رمز کاملاً متعلق به شما است و امکان شخصی‌سازی Custom GPT و حافظه را به طور کامل دارید.',
      },
      {
        question: 'اگر اشتراک پیش از پایان مدت قطع شود، چه می‌شود؟',
        answer:
          'در چارچوب گارانتی پی‌کارت، اگر اشتراک پیش از پایان مدت اعلام‌شده غیرفعال شود، یا اکانت جایگزین یا اعتبار معادل به‌صورت کیف پول به شما داده می‌شود.',
      },
    ],
  },
  {
    slug: 'buy-midjourney-iran',
    titleFa: 'خرید اشتراک Midjourney از ایران: قیمت پلن‌ها و تحویل آنی',
    titleEnHint: 'Buy Midjourney subscription in Iran',
    excerpt:
      'خرید اکانت Midjourney با تمام پلن‌های Basic، Standard، Pro و Mega در پی‌کارت — پرداخت ریالی، تحویل سریع، گارانتی اصالت و راهنمای فعال‌سازی برای کاربر ایرانی.',
    coverImage: '/images/categories/ai-image.jpg',
    coverAlt: 'خرید اکانت Midjourney از ایران',
    keywords: [
      'خرید Midjourney',
      'خرید اکانت میدجرنی',
      'اشتراک میدجرنی ایران',
      'پلن Midjourney',
      'هوش مصنوعی تولید عکس',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'midjourney',
    primaryCtaLabel: 'خرید اشتراک Midjourney',
    primaryCategorySlug: 'ai-image',
    relatedServiceSlugs: ['playground', 'artbreeder'],
    sections: [
      {
        heading: 'چرا Midjourney بهترین انتخاب برای تولید تصویر هوش مصنوعی است؟',
        body: [
          'Midjourney یکی از قدرتمندترین مدل‌های متن به تصویر در دنیاست که خروجی‌های فوق‌العاده واقع‌گرایانه و هنری تولید می‌کند. کاربران حرفه‌ای دیزاین، تبلیغات، تولید محتوا و حتی کانسپت‌آرتیست‌های صنعت بازی و فیلم از Midjourney برای تولید تصاویر اولیه پروژه‌ها استفاده می‌کنند.',
          'محدودیت اصلی برای کاربر ایرانی این است که Midjourney پرداخت‌های آنلاین خود را از طریق Stripe و کارت‌های اعتباری انجام می‌دهد و کارت‌های ایرانی به‌هیچ‌وجه پذیرفته نمی‌شوند. پی‌کارت با خرید قانونی اشتراک‌ها و فروش آن‌ها به کاربر داخلی، این مانع را با پرداخت ریالی برطرف کرده است.',
        ],
      },
      {
        heading: 'پلن‌های Midjourney و قیمت آن‌ها در پی‌کارت',
        body: [
          'Midjourney چهار پلن استاندارد دارد: Basic، Standard، Pro و Mega. هر پلن از نظر زمان GPU، تعداد ساخت همزمان و دسترسی به Stealth Mode و حالت Relax تفاوت دارد. در صفحه محصول، قیمت لحظه‌ای هر پلن به تومان نمایش داده می‌شود.',
        ],
        bullets: [
          'Basic — مناسب کاربران تازه‌کار و تست محصول؛ ۲۰۰ تصویر در ماه',
          'Standard — انتخاب کاربران عادی؛ ۱۵ ساعت GPU + استفاده نامحدود در حالت Relax',
          'Pro — مناسب فریلنسرها و تیم‌های دیزاین؛ Stealth Mode + ۳۰ ساعت GPU',
          'Mega — برای استودیوها و تولیدکنندگان حجیم؛ ۶۰ ساعت GPU',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های Midjourney',
          path: '/s/midjourney',
        },
      },
      {
        heading: 'روش فعال‌سازی Midjourney در ایران',
        body: [
          'پس از خرید از پی‌کارت، اطلاعات اکانت دیسکورد مرتبط با Midjourney و راهنمای ورود برای شما ارسال می‌شود. کاربر باید با یک VPN معتبر وارد دیسکورد شود، به سرور Midjourney ملحق شود و در کانال‌های Newbie یا DM ربات از دستور `/imagine` استفاده کند.',
          'پلن‌های Pro و Mega امکان فعال‌سازی Stealth Mode را می‌دهند که خروجی‌های شما در گالری عمومی Midjourney نمایش داده نمی‌شود — برای پروژه‌های تجاری ضروری است.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی',
        body: [
          'تمامی اکانت‌های Midjourney فروخته‌شده در پی‌کارت تا پایان دوره اشتراک دارای گارانتی هستند. در صورت بروز هر مشکل از سوی Midjourney یا پی‌کارت، با ثبت تیکت در پنل کاربری، در سریع‌ترین زمان جایگزینی یا بازگشت وجه انجام می‌شود.',
        ],
      },
      {
        heading: 'گزینه‌های جایگزین تولید تصویر',
        body: [
          'اگر بودجه محدودتری دارید یا ابتدا می‌خواهید با ابزارهای رایگان‌تر کار کنید، در دسته «تولید تصویر» در پی‌کارت سرویس‌های دیگری مثل Playground و Artbreeder هم با قیمت‌های متنوع موجود هستند.',
        ],
        cta: {
          label: 'مشاهده دسته تولید تصویر',
          path: '/c/ai-image',
        },
      },
    ],
    faq: [
      {
        question: 'آیا Midjourney خریداری‌شده از پی‌کارت در ایران کار می‌کند؟',
        answer:
          'بله، اشتراک Midjourney روی هر اکانت دیسکوردی فعال است؛ تنها برای ورود به Discord باید از VPN معتبر استفاده کنید. این محدودیت به دیسکورد و Midjourney برمی‌گردد و ربطی به نوع اکانت ندارد.',
      },
      {
        question: 'چه پلنی برای شروع کار با Midjourney مناسب است؟',
        answer:
          'برای کاربران تازه‌وارد، پلن Basic انتخاب اقتصادی است. اگر قصد استفاده روزمره دارید یا کار تجاری می‌کنید، Standard ارزش بهتری دارد چون استفاده نامحدود در حالت Relax را شامل می‌شود.',
      },
      {
        question: 'تفاوت اکانت Midjourney با ChatGPT Plus در پی‌کارت چیست؟',
        answer:
          'ChatGPT Plus برای کارهای متنی، برنامه‌نویسی و چت‌بات تخصصی است؛ Midjourney برای تولید تصویر هنری و فوتورئالیستیک. می‌توانید برای پروژه‌های ترکیبی هر دو را همزمان داشته باشید.',
      },
    ],
  },
  {
    slug: 'buy-claude-pro-iran',
    titleFa: 'خرید اکانت Claude Pro از ایران: قیمت، مقایسه با ChatGPT و فعال‌سازی',
    titleEnHint: 'Buy Claude Pro subscription in Iran',
    excerpt:
      'راهنمای خرید اکانت Claude Pro از پی‌کارت — مقایسه دقیق با ChatGPT Plus، قیمت پلن‌ها به تومان، روش پرداخت ریالی، تحویل آنی و گارانتی اصالت.',
    coverImage: '/images/categories/ai-assistants.jpg',
    coverAlt: 'خرید اکانت Claude Pro در پی‌کارت',
    keywords: [
      'خرید Claude Pro',
      'اکانت Claude AI ایران',
      'مقایسه Claude و ChatGPT',
      'Anthropic Claude خرید',
      'هوش مصنوعی متنی',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'claude',
    primaryCtaLabel: 'خرید اکانت Claude Pro',
    primaryCategorySlug: 'ai-assistants',
    relatedServiceSlugs: ['chatgpt', 'gemini'],
    sections: [
      {
        heading: 'Claude Pro چیست و چرا انتخاب خوبی برای کاربر فارسی‌زبان است؟',
        body: [
          'Claude، محصول شرکت Anthropic، یکی از سه دستیار هوش مصنوعی برتر دنیا در کنار ChatGPT و Gemini است. نسخه Pro آن دسترسی به مدل‌های Claude Opus و Sonnet، پنجره گفتگوی بسیار طولانی (تا ۲۰۰ هزار توکن)، آپلود فایل، تحلیل داده و امکان استفاده در ساعات شلوغ را می‌دهد.',
          'Claude در نوشتار طبیعی فارسی، خلاصه‌سازی متون طولانی و کدنویسی به اندازه ChatGPT (و گاهی بهتر) عمل می‌کند و برای کسانی که با اسناد طولانی، PDFهای علمی یا کدبیس بزرگ کار می‌کنند، گزینه ایده‌آل است.',
        ],
      },
      {
        heading: 'مقایسه Claude Pro و ChatGPT Plus',
        body: [
          'دو سرویس در نگاه اول مشابه‌اند ولی تفاوت‌های مهمی دارند:',
        ],
        bullets: [
          'پنجره زمینه: Claude Opus تا ۲۰۰ هزار توکن، ChatGPT Plus حدود ۱۲۸ هزار توکن',
          'تولید تصویر: ChatGPT Plus شامل DALL-E، Claude Pro فاقد تولید تصویر است',
          'صوت و گفتار: ChatGPT Plus شامل Voice Mode، Claude Pro فقط متنی',
          'افزونه‌ها: ChatGPT دارای فروشگاه GPT و افزونه، Claude بدون اکوسیستم افزونه',
          'کار با اسناد طولانی: Claude Pro تجربه برتری دارد',
        ],
        cta: {
          label: 'مشاهده قیمت Claude Pro',
          path: '/s/claude',
        },
      },
      {
        heading: 'قیمت Claude Pro در پی‌کارت',
        body: [
          'قیمت اشتراک Claude Pro در پی‌کارت به تومان و در صفحه محصول لحظه‌ای نمایش داده می‌شود. به‌طور کلی پلن‌ها شامل اشتراک یک‌ماهه (پرفروش‌ترین)، سه‌ماهه و سالانه است؛ پلن‌های اختصاصی برای کاربرانی که می‌خواهند ایمیل و رمز کاملاً متعلق به خودشان باشد نیز موجود است.',
        ],
      },
      {
        heading: 'روش پرداخت و فعال‌سازی',
        body: [
          'پرداخت در پی‌کارت کاملاً ریالی و با کارت‌های شتابی است. پس از پرداخت، اطلاعات اکانت Claude (ایمیل و رمز عبور) همراه راهنمای ورود در پنل کاربری شما قرار می‌گیرد. ورود به Anthropic.com نیازمند VPN است؛ فعال بودن اشتراک Pro روی اکانت توسط ما تضمین می‌شود.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی پی‌کارت',
        body: [
          'برای تمامی اکانت‌های Claude Pro، گارانتی اصالت تا پایان دوره اشتراک ارائه می‌شود. در صورت قطعی، تغییر سیاست شرکت یا مشکل فنی، اکانت جایگزین داده می‌شود یا وجه به‌صورت اعتبار/کیف پول بازگردانده می‌شود. شرایط دقیق در صفحه «گارانتی بازگشت وجه» قابل مشاهده است.',
        ],
        cta: {
          label: 'مشاهده دستیارهای هوش مصنوعی',
          path: '/c/ai-assistants',
        },
      },
    ],
    faq: [
      {
        question: 'Claude Pro یا ChatGPT Plus، کدام را بخرم؟',
        answer:
          'اگر کارهایی مثل تحلیل اسناد طولانی، خلاصه‌سازی فایل PDF و کدنویسی پیچیده دارید، Claude Pro معمولاً برتر است. اگر تولید تصویر، Voice و افزونه‌های GPT را می‌خواهید، ChatGPT Plus مناسب‌تر است. بسیاری از کاربران حرفه‌ای هر دو را همزمان دارند.',
      },
      {
        question: 'آیا برای استفاده از Claude Pro در ایران به VPN نیاز دارم؟',
        answer:
          'بله، Anthropic سرویس خود را در ایران در دسترس قرار نمی‌دهد و VPN معتبر برای ورود الزامی است. اشتراک Pro روی اکانت ارائه‌شده توسط پی‌کارت فعال است.',
      },
      {
        question: 'آیا اکانت Claude Pro در پی‌کارت اختصاصی است؟',
        answer:
          'پلن‌های متنوعی موجود است: اشتراکی (مدیریت‌شده توسط ما) و اختصاصی (ایمیل و رمز کاملاً برای شما). در صفحه محصول می‌توانید پلن دلخواه را انتخاب کنید.',
      },
    ],
  },
  {
    slug: 'buy-canva-pro-iran',
    titleFa: 'خرید اکانت Canva Pro: قیمت پلن‌ها، تخفیف، تحویل آنی',
    titleEnHint: 'Buy Canva Pro subscription in Iran',
    excerpt:
      'خرید اکانت Canva Pro از پی‌کارت — اکانت اختصاصی، تیمی و شخصی، با قیمت تومان، پرداخت ریالی، گارانتی اصالت و تحویل آنی برای کاربر ایرانی.',
    coverImage: '/images/categories/design-creative.jpg',
    coverAlt: 'خرید اکانت Canva Pro در پی‌کارت',
    keywords: [
      'خرید Canva Pro',
      'اکانت کانوا پرو',
      'Canva Pro ایران',
      'اشتراک طراحی',
      'خرید کانوا قانونی',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'canva',
    primaryCtaLabel: 'خرید اکانت Canva Pro',
    primaryCategorySlug: 'design-creative',
    relatedServiceSlugs: ['adobe-creative', 'adobe-express'],
    sections: [
      {
        heading: 'Canva Pro برای چه کسانی مناسب است؟',
        body: [
          'Canva ابزار طراحی گرافیک تحت وب است که با تمپلت‌های آماده و رابط ساده، طراحی پست شبکه‌های اجتماعی، پرزنتیشن، پوستر، رزومه، استوری اینستاگرام و ویدیوی کوتاه را برای غیر طراحان هم ممکن می‌کند. نسخه Pro آن دسترسی به ۱۰۰+ میلیون عکس، ویدیو و فونت پریمیوم، Brand Kit، Background Remover، Magic Resize و ۱ ترابایت فضای ابری را اضافه می‌کند.',
          'برای ادمین‌های شبکه‌های اجتماعی، فریلنسرها، تولیدکنندگان محتوا و کسب‌وکارهای کوچک ایرانی، Canva Pro یک سرمایه‌گذاری بی‌جایگزین است: با هزینه ماهانه پایین، تمپلت‌های گران دیزاین حرفه‌ای را در اختیار می‌گذارد.',
        ],
      },
      {
        heading: 'پلن‌های Canva Pro در پی‌کارت',
        body: [
          'پی‌کارت چند نوع پلن Canva ارائه می‌دهد: اکانت شخصی Pro یک‌ساله، اکانت تیمی برای استفاده گروهی و دعوت کاربر روی اکانت آماده پی‌کارت. قیمت دقیق هر گزینه در صفحه محصول قابل مشاهده است.',
        ],
        bullets: [
          'اکانت اختصاصی شخصی یک‌ساله — ایمیل و رمز کاملاً متعلق به شما',
          'اکانت اختصاصی تیمی — برای استفاده گروه طراحی یا تیم محتوا',
          'دعوت روی اکانت آماده — مقرون‌به‌صرفه‌ترین گزینه برای استفاده شخصی',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های Canva',
          path: '/s/canva',
        },
      },
      {
        heading: 'مزیت‌های Canva Pro نسبت به نسخه رایگان',
        body: [
          'Canva رایگان محدودیت‌هایی دارد که در کارهای حرفه‌ای آزار می‌دهد:',
        ],
        bullets: [
          'دسترسی به فقط ۲۵۰ هزار تمپلت رایگان (در Pro: بیش از ۶۱۰ هزار)',
          'بدون پاک‌کن خودکار پس‌زمینه (Background Remover)',
          'بدون Magic Resize برای تبدیل سریع طرح بین قالب‌ها',
          'بدون Brand Kit برای ذخیره رنگ، لوگو و فونت برند',
          'فضای ابری ۵ گیگابایت در رایگان، ۱ ترابایت در Pro',
        ],
      },
      {
        heading: 'روش خرید و فعال‌سازی در ایران',
        body: [
          'پرداخت با کارت‌های شتابی و درگاه شاپرک انجام می‌شود. پس از پرداخت، اطلاعات اکانت یا لینک پذیرش دعوت تیمی به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد. برای ورود به Canva.com از ایران، استفاده از VPN معتبر توصیه می‌شود؛ روی اپلیکیشن موبایل اغلب نیازی به VPN نیست.',
        ],
      },
      {
        heading: 'گارانتی پی‌کارت',
        body: [
          'تمامی اشتراک‌های Canva Pro در پی‌کارت تا پایان دوره اعتبار، گارانتی اصالت دارند. در صورت بروز مشکل (از قبیل لغو شدن اشتراک یا قطعی)، اکانت جایگزین یا اعتبار معادل دریافت می‌کنید.',
        ],
        cta: {
          label: 'مشاهده دسته طراحی و گرافیک',
          path: '/c/design-creative',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Canva Pro خریداری‌شده روی موبایل هم کار می‌کند؟',
        answer:
          'بله، Canva Pro همزمان روی وب، iOS و Android فعال است. کافی است با همان ایمیل و رمز در اپ یا سایت وارد شوید تا تمام مزایای Pro فعال باشد.',
      },
      {
        question: 'آیا می‌توانم با اکانت Pro، طراحی برای فروش انجام دهم؟',
        answer:
          'بله. Canva به کاربران Pro اجازه استفاده تجاری از تمپلت‌ها، عناصر و خروجی‌ها را می‌دهد (با رعایت لایسنس‌های Canva Content License). برای فریلنسرها این یعنی می‌توانید برای کلاینت طرح خروجی بگیرید.',
      },
      {
        question: 'تفاوت Canva Pro با Adobe Express چیست؟',
        answer:
          'Canva برای طراحی سریع تمپلت‌محور و انتشار شبکه‌های اجتماعی بهینه است؛ Adobe Express ابزارهای حرفه‌ای‌تر در ادغام با Photoshop و Lightroom دارد. هر دو در پی‌کارت موجودند.',
      },
    ],
  },
  {
    slug: 'buy-adobe-creative-cloud-iran',
    titleFa: 'خرید Adobe Creative Cloud در ایران: قیمت، پلن‌ها و فعال‌سازی',
    titleEnHint: 'Buy Adobe Creative Cloud in Iran',
    excerpt:
      'راهنمای خرید Adobe Creative Cloud از پی‌کارت — پلن All Apps، تک‌اپ Photoshop/Premiere/Illustrator، اکانت Student، با پرداخت ریالی و تحویل آنی.',
    coverImage: '/images/categories/design-creative.jpg',
    coverAlt: 'خرید اکانت Adobe Creative Cloud در پی‌کارت',
    keywords: [
      'خرید Adobe Creative Cloud',
      'اکانت ادوبی پرمیوم',
      'Photoshop خرید',
      'Premiere Pro ایران',
      'Adobe All Apps',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'adobe-creative',
    primaryCtaLabel: 'خرید اکانت Adobe Creative Cloud',
    primaryCategorySlug: 'design-creative',
    relatedServiceSlugs: ['adobe-express', 'canva'],
    sections: [
      {
        heading: 'Adobe Creative Cloud چیست و چرا استاندارد صنعت است؟',
        body: [
          'Adobe Creative Cloud (CC) مجموعه نرم‌افزارهای خلاقانه شامل Photoshop، Illustrator، Premiere Pro، After Effects، Lightroom، InDesign، Audition و ۲۰+ ابزار دیگر است که توسط بیش از ۹۰ درصد طراحان، فیلم‌سازان و ادیتورهای حرفه‌ای دنیا استفاده می‌شود.',
          'برای کاربر ایرانی، پرداخت اشتراک Creative Cloud از داخل ایران غیرممکن است (Adobe کارت‌های ایرانی را نمی‌پذیرد و فعال‌سازی روی IP ایران مسدود است). پی‌کارت با خرید قانونی اشتراک‌های Adobe و تحویل آنی به کاربر داخلی، این مانع را با پرداخت تومانی برطرف کرده است.',
        ],
      },
      {
        heading: 'انواع پلن Creative Cloud در پی‌کارت',
        body: [
          'بسته به نیاز شما، پلن‌های مختلفی در دسترس است:',
        ],
        bullets: [
          'پلن All Apps یک‌ساله — دسترسی به همه ۲۰+ نرم‌افزار + ۱۰۰ گیگابایت فضای ابری',
          'پلن All Apps Student — برای دانشجویان با تخفیف ویژه',
          'پلن تک‌اپ Photoshop — مناسب طراحان UI و عکاسان',
          'پلن تک‌اپ Premiere Pro — برای ویدیوادیتورها و فیلم‌سازان',
          'پلن تک‌اپ Illustrator — برای طراحان لوگو و وکتور',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های Adobe',
          path: '/s/adobe-creative',
        },
      },
      {
        heading: 'فعال‌سازی Adobe Creative Cloud در ایران',
        body: [
          'پس از خرید از پی‌کارت، اطلاعات اکانت Adobe ID به‌صورت آنی در پنل کاربری شما قرار می‌گیرد. برای ورود اولیه و دانلود نرم‌افزارها از Creative Cloud Desktop، استفاده از VPN معتبر ضروری است؛ پس از فعال‌سازی، می‌توانید نرم‌افزارها را به‌صورت آفلاین نیز اجرا کنید.',
          'تمامی نرم‌افزارهای Creative Cloud به‌صورت کامل، با امکان دانلود از سرورهای رسمی Adobe، در دسترس هستند. هیچ نسخه کرکی یا غیراصلی استفاده نمی‌شود.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی',
        body: [
          'تمامی اکانت‌های Adobe Creative Cloud در پی‌کارت گارانتی اصالت تا پایان دوره اشتراک دارند. در صورت بروز مشکل، با ثبت تیکت در پنل کاربری در سریع‌ترین زمان رسیدگی و در صورت لزوم اکانت جایگزین یا اعتبار بازگشتی دریافت می‌کنید.',
        ],
      },
      {
        heading: 'مقایسه Adobe Creative Cloud با Canva و Adobe Express',
        body: [
          'Creative Cloud برای کاربران حرفه‌ای و کارهای پیچیده‌ای مثل ویرایش حرفه‌ای ویدیو، طراحی برند پیچیده و ریتاچ عکاسی است. اگر فقط نیاز به طراحی پست‌های ساده دارید، Canva Pro یا Adobe Express اقتصادی‌تر و سریع‌ترند.',
        ],
        cta: {
          label: 'مشاهده ابزارهای طراحی',
          path: '/c/design-creative',
        },
      },
    ],
    faq: [
      {
        question: 'آیا با اکانت Creative Cloud خریداری‌شده می‌توانم همه نرم‌افزارها را دانلود کنم؟',
        answer:
          'با پلن All Apps بله؛ همه ۲۰+ نرم‌افزار قابل دانلود از Creative Cloud Desktop است. در پلن‌های تک‌اپ، فقط همان نرم‌افزار خریداری‌شده و چند ابزار جانبی فعال می‌شود.',
      },
      {
        question: 'تفاوت اکانت Student و عادی چیست؟',
        answer:
          'پلن Student از نظر امکانات نرم‌افزاری دقیقاً مثل پلن عادی است، اما قیمت پایین‌تری دارد. مدت زمان معمولاً یک‌ساله است و پس از پایان قابل تمدید است.',
      },
      {
        question: 'برای استفاده از نرم‌افزارهای Adobe در ایران، VPN دائمی نیاز است؟',
        answer:
          'فقط برای ورود اولیه به Creative Cloud Desktop و دانلود نرم‌افزارها VPN لازم است. پس از فعال‌سازی، می‌توانید بدون VPN کار کنید (اگرچه آپدیت‌های نرم‌افزار همچنان به VPN نیاز دارند).',
      },
    ],
  },
  {
    slug: 'buy-apple-music-iran',
    titleFa: 'خرید اکانت Apple Music ایران: قیمت پلن‌ها و خرید آنی',
    titleEnHint: 'Buy Apple Music subscription in Iran',
    excerpt:
      'خرید اشتراک Apple Music از پی‌کارت — پلن فردی، خانوادگی، دانشجویی، با پرداخت ریالی، تحویل آنی، گارانتی اصالت برای کاربر ایرانی.',
    coverImage: '/images/categories/music.jpg',
    coverAlt: 'خرید اشتراک Apple Music در پی‌کارت',
    keywords: [
      'خرید اپل موزیک',
      'Apple Music ایران',
      'اکانت اپل موزیک',
      'پلن خانوادگی Apple Music',
      'اشتراک موسیقی',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'apple-music',
    primaryCtaLabel: 'خرید اشتراک Apple Music',
    primaryCategorySlug: 'music',
    relatedServiceSlugs: ['idagio-stream'],
    sections: [
      {
        heading: 'Apple Music بهترین انتخاب موسیقی برای کاربران iPhone',
        body: [
          'Apple Music سرویس استریم موسیقی شرکت اپل با کتابخانه ۱۰۰+ میلیون آهنگ، ادغام عمیق با iOS، iCloud Library، Spatial Audio با Dolby Atmos و کیفیت Lossless است. برای کاربران iPhone و Mac، یکپارچگی با اپ Music، Apple Watch و HomePod مزیت مهمی نسبت به سایر سرویس‌ها محسوب می‌شود.',
          'مشکل اصلی برای کاربر ایرانی: Apple Store ایران را پذیرش نمی‌کند و کارت‌های شتابی روی Apple ID فعال نمی‌شود. پی‌کارت با ارائه اکانت‌های قانونی و فعال در ریجن‌های پشتیبانی‌شده، این محدودیت را حل کرده است.',
        ],
      },
      {
        heading: 'پلن‌های Apple Music در پی‌کارت',
        body: [
          'سه پلن اصلی در دسترس هستند که قیمت دقیق هر یک در صفحه محصول قابل مشاهده است:',
        ],
        bullets: [
          'پلن فردی (Individual) — یک کاربر، روی تمام دستگاه‌های اپل ID',
          'پلن خانوادگی (Family) — تا ۶ کاربر، اقتصادی‌ترین گزینه برای خانواده',
          'پلن دانشجویی (Student) — تخفیف ویژه برای دانشجویان دانشگاه‌های مورد تأیید',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های Apple Music',
          path: '/s/apple-music',
        },
      },
      {
        heading: 'فعال‌سازی روی iPhone و iPad',
        body: [
          'پس از خرید از پی‌کارت، Apple ID آماده‌شده با اشتراک Apple Music در اختیار شما قرار می‌گیرد. کافی است در تنظیمات گوشی، در بخش Media & Purchases با همین Apple ID وارد شوید (لازم نیست Apple ID اصلی گوشی را تغییر دهید).',
          'برای کیفیت Lossless و Spatial Audio، تنظیمات Audio Quality را روی Hi-Res Lossless بگذارید — تمام آهنگ‌های جدید Apple Music این کیفیت را به‌صورت رایگان روی پلن استاندارد ارائه می‌دهند.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی پی‌کارت',
        body: [
          'تمامی اکانت‌های Apple Music در پی‌کارت تا پایان دوره اشتراک گارانتی دارند. در صورت بروز مشکل (از قبیل تغییر منطقه اپل یا قطعی)، اکانت جایگزین یا اعتبار بازگشتی دریافت می‌کنید.',
        ],
      },
      {
        heading: 'مقایسه Apple Music و Spotify',
        body: [
          'Apple Music در یکپارچگی با iOS و کیفیت Lossless در همه پلن‌ها برتر است. Spotify در الگوریتم پیشنهاد، Discover Weekly و Podcastها بهتر عمل می‌کند. اگر کاربر iPhone هستید و کیفیت صدا برایتان مهم است، Apple Music انتخاب بهتری است.',
        ],
        cta: {
          label: 'مشاهده دسته موسیقی',
          path: '/c/music',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Apple Music روی Android هم کار می‌کند؟',
        answer:
          'بله، اپلیکیشن Apple Music در Google Play موجود است. با همان ایمیل و رمز ارائه‌شده وارد می‌شوید و همه امکانات (به‌جز Spatial Audio که نیازمند Apple ecosystem است) فعال می‌شوند.',
      },
      {
        question: 'برای استفاده از Apple Music در ایران به VPN نیاز دارم؟',
        answer:
          'برای ورود اولیه و گاهی برای دانلود آفلاین آهنگ‌ها VPN توصیه می‌شود. در استریم آنلاین معمولاً بدون VPN هم کار می‌کند.',
      },
      {
        question: 'تفاوت پلن خانوادگی و فردی چیست؟',
        answer:
          'پلن خانوادگی تا ۶ کاربر همزمان روی Apple IDهای جداگانه را پوشش می‌دهد و هر کاربر کتابخانه و پیشنهاد مستقل دارد. پلن فردی فقط یک کاربر است.',
      },
    ],
  },
  {
    slug: 'buy-duolingo-super-iran',
    titleFa: 'خرید اشتراک Duolingo Super: قیمت، پلن‌ها و خرید آنی',
    titleEnHint: 'Buy Duolingo Super subscription in Iran',
    excerpt:
      'خرید اشتراک Duolingo Super (سابق Plus) از پی‌کارت — حذف تبلیغات، Hearts نامحدود، Mistakes Review، با قیمت تومانی و تحویل آنی برای کاربر ایرانی.',
    coverImage: '/images/categories/education.jpg',
    coverAlt: 'خرید اشتراک Duolingo Super در پی‌کارت',
    keywords: [
      'خرید Duolingo Super',
      'دولینگو پرمیوم',
      'Duolingo Plus خرید',
      'اشتراک یادگیری زبان',
      'خرید دولینگو ایران',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'duolingo',
    primaryCtaLabel: 'خرید اشتراک Duolingo Super',
    primaryCategorySlug: 'education',
    relatedServiceSlugs: ['airlearn', 'datacamp'],
    sections: [
      {
        heading: 'Duolingo Super و چرا ارزش خرید دارد',
        body: [
          'Duolingo محبوب‌ترین اپلیکیشن یادگیری زبان جهان با بیش از ۵۰۰ میلیون کاربر است. نسخه رایگان آن کاربردی است اما با تبلیغات، محدودیت Hearts (سلامتی) و عدم دسترسی به ابزارهای پیشرفته همراه است. اشتراک Super (نام جدید Plus) همه این محدودیت‌ها را حذف می‌کند:',
        ],
        bullets: [
          'بدون هیچ تبلیغی در سراسر اپ',
          'Hearts نامحدود — هر چقدر اشتباه کنید، درس متوقف نمی‌شود',
          'Mistakes Review برای مرور خطاهای قبلی به‌صورت هدفمند',
          'Practice Hub برای تمرین موضوعی',
          'Family Plan تا ۶ نفر',
        ],
      },
      {
        heading: 'پلن‌ها و قیمت Duolingo Super در پی‌کارت',
        body: [
          'در صفحه محصول می‌توانید پلن‌های زیر را با قیمت لحظه‌ای به تومان مقایسه کنید:',
        ],
        bullets: [
          'پلن یک‌ماهه — مناسب تست محصول و دانش‌آموزانی که هدف کوتاه‌مدت دارند',
          'پلن سالانه — قیمت بسیار اقتصادی‌تر در سال نسبت به ماهانه',
          'پلن خانوادگی Family Plan — تا ۶ کاربر، ایده‌آل برای خانواده‌ها و گروه‌های دوستانه',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های Duolingo',
          path: '/s/duolingo',
        },
      },
      {
        heading: 'روش فعال‌سازی روی موبایل',
        body: [
          'پس از خرید از پی‌کارت، اطلاعات اکانت آماده در پنل کاربری شما قرار می‌گیرد. کافی است در اپلیکیشن Duolingo (روی iOS یا Android) با همین ایمیل و رمز وارد شوید — اشتراک Super بلافاصله فعال است و می‌توانید زبان‌های مورد علاقه خود را شروع کنید.',
          'بیش از ۴۰ زبان، شامل انگلیسی، اسپانیایی، فرانسوی، آلمانی، ژاپنی، چینی و حتی عربی، در دسترس‌اند.',
        ],
      },
      {
        heading: 'گارانتی پی‌کارت',
        body: [
          'تمامی اکانت‌های Duolingo Super در پی‌کارت تا پایان دوره اشتراک گارانتی اصالت دارند. در صورت قطعی یا مشکل، با ثبت تیکت اکانت جایگزین یا بازگشت اعتبار دریافت می‌کنید.',
        ],
        cta: {
          label: 'مشاهده دسته آموزش',
          path: '/c/education',
        },
      },
    ],
    faq: [
      {
        question: 'تفاوت Duolingo Super و Duolingo Max چیست؟',
        answer:
          'Duolingo Max علاوه بر همه امکانات Super، شامل Roleplay (مکالمه با AI) و Explain My Answer (توضیح هوش مصنوعی روی اشتباهات) است. Super برای اکثر کاربران کافی است.',
      },
      {
        question: 'آیا اکانت Family Plan را می‌توانم با دوستان به اشتراک بگذارم؟',
        answer:
          'بله. Family Plan تا ۶ نفر را پشتیبانی می‌کند و هر نفر اکانت مستقل با Streak و دستاوردهای جداگانه خود را دارد. مدیر گروه می‌تواند اعضا را اضافه/حذف کند.',
      },
      {
        question: 'آیا برای استفاده از Duolingo در ایران به VPN نیاز است؟',
        answer:
          'برای استفاده عمومی Duolingo نه — اپ روی شبکه ایران به‌خوبی کار می‌کند. تنها برای ورود اولیه و گاهی پرداخت داخل اپ ممکن است VPN لازم شود که در پلن‌های پی‌کارت این مرحله از قبل انجام شده است.',
      },
    ],
  },
  {
    slug: 'buy-linkedin-premium-iran',
    titleFa: 'خرید اشتراک LinkedIn Premium در ایران: قیمت و پلن‌ها',
    titleEnHint: 'Buy LinkedIn Premium subscription in Iran',
    excerpt:
      'خرید اشتراک LinkedIn Premium از پی‌کارت — پلن Career، Business، Sales و Recruiter با قیمت ریالی، تحویل آنی و گارانتی اصالت برای کاربر ایرانی.',
    coverImage: '/images/categories/business-marketing.jpg',
    coverAlt: 'خرید اشتراک LinkedIn Premium در پی‌کارت',
    keywords: [
      'خرید LinkedIn Premium',
      'لینکدین پرمیوم',
      'LinkedIn Career خرید',
      'اشتراک LinkedIn Sales Navigator',
      'LinkedIn ایران',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'linkedin',
    primaryCtaLabel: 'خرید اشتراک LinkedIn Premium',
    primaryCategorySlug: 'business-marketing',
    relatedServiceSlugs: ['canva', 'adobe-creative'],
    sections: [
      {
        heading: 'LinkedIn Premium چیست و چه تفاوتی با نسخه رایگان دارد؟',
        body: [
          'LinkedIn Premium نسخه پولی شبکه اجتماعی حرفه‌ای LinkedIn است که چهار پلن مختلف برای کاربران مختلف ارائه می‌دهد: Career برای جویندگان کار، Business برای کارآفرینان، Sales Navigator برای فروشندگان B2B و Recruiter برای منابع انسانی. نسخه رایگان LinkedIn محدودیت‌های مهمی دارد:',
        ],
        bullets: [
          'فقط چند جستجو در ماه (Premium نامحدود)',
          'بدون InMail (Premium شامل ۵–۵۰ InMail در ماه)',
          'بدون Who\'s Viewed Your Profile (Premium شامل لیست کامل بازدیدکننده)',
          'بدون LinkedIn Learning (Premium دسترسی به ۲۰,۰۰۰+ دوره آموزشی)',
        ],
      },
      {
        heading: 'پلن‌های LinkedIn در پی‌کارت',
        body: [
          'پلن‌های مختلف با قیمت تومانی در صفحه محصول قابل مشاهده‌اند:',
        ],
        bullets: [
          'Career — برای جویندگان کار، شامل ۵ InMail و دسترسی به Salary Insight',
          'Business — برای فریلنسرها و کارآفرینان، ۱۵ InMail در ماه',
          'Sales Navigator Core — برای فروشندگان، ۵۰ InMail و فیلترهای پیشرفته',
          'Recruiter Lite — برای استخدام‌کنندگان، Search Filtering حرفه‌ای',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های LinkedIn',
          path: '/s/linkedin',
        },
      },
      {
        heading: 'فعال‌سازی LinkedIn Premium در ایران',
        body: [
          'پس از خرید از پی‌کارت، اشتراک Premium روی اکانت LinkedIn شما (یا اکانت آماده‌شده توسط ما) فعال می‌شود. ورود به LinkedIn از ایران در حال حاضر بدون محدودیت اساسی صورت می‌گیرد، اگرچه برای ورود از موبایل گاهی استفاده از VPN توصیه می‌شود.',
          'تمام مزایای Premium، شامل LinkedIn Learning و InMail، از همان لحظه فعال‌سازی در دسترس خواهند بود.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی پی‌کارت',
        body: [
          'تمام اشتراک‌های LinkedIn Premium در پی‌کارت تا پایان دوره گارانتی اصالت دارند. در صورت بروز مشکل، با ثبت تیکت در پنل کاربری در سریع‌ترین زمان رسیدگی می‌شود.',
        ],
        cta: {
          label: 'مشاهده دسته کسب و کار',
          path: '/c/business-marketing',
        },
      },
    ],
    faq: [
      {
        question: 'کدام پلن LinkedIn برای جویندگان کار مناسب است؟',
        answer:
          'پلن Career بهترین گزینه است: شامل ۵ InMail در ماه برای ارسال پیام مستقیم به استخدام‌کنندگان، دسترسی به اطلاعات حقوق در منطقه و کلاس‌های LinkedIn Learning است.',
      },
      {
        question: 'آیا LinkedIn Premium به افزایش جذب جاب کمک می‌کند؟',
        answer:
          'مستقیماً تضمین جاب نمی‌دهد، اما ابزارهایی مثل InMail (پیام به مدیران منابع انسانی)، Featured Applicant و Career Insight می‌تواند نسبت پاسخ‌گویی شما را قابل توجه افزایش دهد.',
      },
      {
        question: 'آیا LinkedIn در ایران مسدود است؟',
        answer:
          'در حال حاضر LinkedIn در ایران معمولاً بدون فیلتر در دسترس است؛ اما در صورت بروز محدودیت موقت یا برای حداکثر پایداری، استفاده از VPN معتبر توصیه می‌شود.',
      },
    ],
  },
  {
    slug: 'buy-dropbox-plus-iran',
    titleFa: 'خرید فضای ابری Dropbox Plus در ایران: قیمت و پلن‌ها',
    titleEnHint: 'Buy Dropbox Plus subscription in Iran',
    excerpt:
      'خرید اشتراک Dropbox Plus از پی‌کارت — ۲ ترابایت فضای ابری، Smart Sync، اشتراک‌گذاری حرفه‌ای، با قیمت تومانی، تحویل آنی و گارانتی اصالت.',
    coverImage: '/images/categories/cloud-storage.jpg',
    coverAlt: 'خرید اشتراک Dropbox Plus در پی‌کارت',
    keywords: [
      'خرید Dropbox Plus',
      'دراپ‌باکس پرمیوم',
      'فضای ابری Dropbox',
      'Dropbox 2TB',
      'خرید استوریج Dropbox',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'dropbox',
    primaryCtaLabel: 'خرید اشتراک Dropbox Plus',
    primaryCategorySlug: 'cloud-storage',
    relatedServiceSlugs: ['icloud'],
    sections: [
      {
        heading: 'چرا Dropbox برای فریلنسرها و تیم‌ها انتخاب اول است؟',
        body: [
          'Dropbox یکی از قدیمی‌ترین و پایدارترین سرویس‌های فضای ابری دنیاست. مزیت اصلی آن نسبت به Google Drive و OneDrive، Smart Sync (دانلود فقط هنگام نیاز)، یکپارچگی با macOS Finder و Windows Explorer، و سرعت همگام‌سازی فوق‌العاده در فایل‌های بزرگ است. برای فریلنسرها، طراحان، فیلم‌برداران و تیم‌های دور این سرویس استاندارد صنعت است.',
          'پلن رایگان Dropbox فقط ۲ گیگابایت فضا می‌دهد و این برای کار حرفه‌ای کافی نیست. Dropbox Plus با ۲ ترابایت فضا و امکانات حرفه‌ای، گزینه مناسبی است.',
        ],
      },
      {
        heading: 'پلن‌های Dropbox در پی‌کارت',
        body: [
          'پلن‌ها با قیمت تومانی در صفحه محصول قابل مشاهده هستند:',
        ],
        bullets: [
          'Plus — ۲ ترابایت برای یک کاربر، Smart Sync، رمزگذاری AES-256',
          'Family — ۲ ترابایت اشتراکی برای ۶ کاربر',
          'Professional — ۳ ترابایت + Watermark، Showcase، Brand Identity',
        ],
        cta: {
          label: 'مشاهده قیمت پلن‌های Dropbox',
          path: '/s/dropbox',
        },
      },
      {
        heading: 'مقایسه Dropbox با Google Drive و iCloud',
        body: [
          'Dropbox برتری در پایداری همگام‌سازی، یکپارچگی فایل‌سیستمی و کار با فایل‌های ویدیویی بزرگ دارد. Google Drive در ادغام با Workspace قوی‌تر و iCloud در ادغام با iOS/macOS بی‌رقیب است. اگر فایل‌های ویدیویی، کلاینت‌های دیزاین و پروژه‌های با حجم بالا دارید، Dropbox انتخاب اول است.',
        ],
      },
      {
        heading: 'فعال‌سازی Dropbox در ایران',
        body: [
          'پس از خرید از پی‌کارت، اطلاعات اکانت Dropbox آماده در اختیار شما قرار می‌گیرد. اپلیکیشن Dropbox روی Windows، macOS، Linux، iOS و Android نصب می‌شود و با ایمیل و رمز ارائه‌شده وارد می‌شوید. ۲ ترابایت فضا بلافاصله در دسترس خواهد بود.',
          'برای مشاهده برخی صفحات سایت Dropbox.com از ایران ممکن است VPN لازم باشد، اما همگام‌سازی فایل از طریق اپلیکیشن دسکتاپ معمولاً بدون مشکل کار می‌کند.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی',
        body: [
          'تمامی اشتراک‌های Dropbox تا پایان دوره گارانتی اصالت دارند. در صورت قطعی یا تغییر شرایط، اکانت جایگزین یا اعتبار بازگشتی دریافت می‌کنید.',
        ],
        cta: {
          label: 'مشاهده دسته فضای ابری',
          path: '/c/cloud-storage',
        },
      },
    ],
    faq: [
      {
        question: 'آیا Dropbox در ایران به‌خوبی کار می‌کند؟',
        answer:
          'بله، اپلیکیشن دسکتاپ Dropbox روی شبکه ایران بدون VPN همگام‌سازی فایل را انجام می‌دهد. تنها برای ورود به وب‌اپ Dropbox.com گاهی VPN لازم است.',
      },
      {
        question: 'تفاوت Dropbox Plus با Family چیست؟',
        answer:
          'Plus فقط برای یک کاربر است و فضای ۲ ترابایت کاملاً متعلق به اوست. Family همان ۲ ترابایت را بین تا ۶ نفر تقسیم می‌کند ولی هر کاربر فضای کاری مستقل خود را دارد. اگر چند نفر از یک خانواده استفاده می‌کنند، Family اقتصادی‌تر است.',
      },
      {
        question: 'آیا فایل‌های من امن هستند؟',
        answer:
          'Dropbox از رمزگذاری AES-256 برای فایل‌های ذخیره‌شده و SSL/TLS برای انتقال استفاده می‌کند. علاوه بر این، Two-Factor Authentication (2FA) برای امنیت اکانت توصیه می‌شود.',
      },
    ],
  },
  {
    slug: 'buy-gemini-advanced-iran',
    titleFa: 'خرید اشتراک Gemini Advanced (Google AI Pro) در ایران',
    titleEnHint: 'Buy Gemini Advanced subscription in Iran',
    excerpt:
      'خرید Gemini Advanced (Google AI Pro) از پی‌کارت — دسترسی به Gemini 1.5 Pro، NotebookLM Plus، ۲ ترابایت فضای Google One، با قیمت تومانی و تحویل آنی.',
    coverImage: '/images/categories/ai-assistants.jpg',
    coverAlt: 'خرید اکانت Gemini Advanced در پی‌کارت',
    keywords: [
      'خرید Gemini Advanced',
      'Google AI Pro',
      'جمنای ادونسد',
      'گوگل بارد پرمیوم',
      'هوش مصنوعی گوگل',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'gemini',
    primaryCtaLabel: 'خرید اشتراک Gemini Advanced',
    primaryCategorySlug: 'ai-assistants',
    relatedServiceSlugs: ['chatgpt', 'claude'],
    sections: [
      {
        heading: 'Gemini Advanced چیست و چه چیزی پیشنهاد می‌دهد؟',
        body: [
          'Gemini Advanced (در حال حاضر با نام Google AI Pro یا One AI Premium شناخته می‌شود) اشتراک پولی Google AI است که دسترسی به مدل‌های پیشرفته Gemini 2.5 Pro، NotebookLM Plus، ادغام با Gmail و Google Docs، و ۲ ترابایت فضای Google One را در یک پکیج می‌دهد.',
          'این سرویس در حوزه‌های زیر برتری دارد:',
        ],
        bullets: [
          'مدل Gemini 2.5 Pro — یکی از قوی‌ترین LLMها در استدلال، ریاضیات و کدنویسی',
          'NotebookLM Plus — تحلیل اسناد طولانی با یادداشت‌برداری هوشمند',
          'ادغام با Gmail و Google Docs — هوش مصنوعی در همان جایی که کار می‌کنید',
          '۲ ترابایت فضای Google One — Drive، Photos و Gmail',
          'Veo برای تولید ویدیو + Imagen برای تولید تصویر',
        ],
      },
      {
        heading: 'پلن‌ها و قیمت در پی‌کارت',
        body: [
          'پی‌کارت پلن‌های Google AI Pro را با قیمت لحظه‌ای به تومان ارائه می‌کند. در صفحه محصول می‌توانید پلن‌ها را با هم مقایسه کرده و سفارش آنی ثبت کنید.',
        ],
        cta: {
          label: 'مشاهده قیمت Gemini Advanced',
          path: '/s/gemini',
        },
      },
      {
        heading: 'مقایسه Gemini با ChatGPT Plus و Claude Pro',
        body: [
          'هر سه دستیار حرفه‌ای، نقاط قوت متفاوتی دارند:',
        ],
        bullets: [
          'Gemini — برتر در ادغام با اکوسیستم گوگل و فضای ابری ۲TB رایگان',
          'ChatGPT Plus — برتر در افزونه‌ها، DALL-E و اکوسیستم Custom GPT',
          'Claude Pro — برتر در پنجره زمینه طولانی و تحلیل اسناد بزرگ',
        ],
      },
      {
        heading: 'فعال‌سازی Gemini Advanced در ایران',
        body: [
          'پس از خرید از پی‌کارت، Google Account آماده با اشتراک Google AI Pro در اختیار شما قرار می‌گیرد. برای ورود به gemini.google.com از VPN معتبر استفاده کنید. تمامی امکانات Pro، شامل Gemini 2.5 Pro و ۲ ترابایت Drive، فعال خواهند بود.',
        ],
      },
      {
        heading: 'گارانتی و پشتیبانی',
        body: [
          'اشتراک Gemini Advanced تا پایان دوره گارانتی اصالت دارد. در صورت بروز مشکل، اکانت جایگزین یا اعتبار بازگشتی در چارچوب گارانتی پی‌کارت دریافت می‌کنید.',
        ],
        cta: {
          label: 'مشاهده دستیارهای هوش مصنوعی',
          path: '/c/ai-assistants',
        },
      },
    ],
    faq: [
      {
        question: 'تفاوت Gemini Advanced و Gemini رایگان چیست؟',
        answer:
          'نسخه رایگان فقط Gemini 1.5 Flash را می‌دهد و محدودیت تعداد پیام در روز دارد. Advanced دسترسی به Gemini 2.5 Pro (قوی‌ترین مدل گوگل)، NotebookLM Plus، Veo، Imagen و ۲ ترابایت فضای ابری را اضافه می‌کند.',
      },
      {
        question: 'برای استفاده از Gemini Advanced باید اکانت Gmail جدید بسازم؟',
        answer:
          'پی‌کارت اکانت‌هایی با اشتراک از قبل فعال‌شده در اختیار می‌گذارد. می‌توانید با همین اکانت Gmail استفاده کنید یا فایل‌ها را به Drive خود کپی کنید.',
      },
      {
        question: 'آیا ۲ ترابایت Google One واقعاً همراه پلن است؟',
        answer:
          'بله. اشتراک Google AI Pro شامل ۲ ترابایت فضای Google One است که بین Gmail، Drive و Photos تقسیم می‌شود.',
      },
    ],
  },
]

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug)

export function findBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

/** Sort newest first by `datePublished` for the index. */
export function getBlogPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.datePublished.localeCompare(a.datePublished))
}

/**
 * Find blog posts that mention the given service slug — either as the
 * primary subject (`primaryServiceSlug`) or as a related entry. Used
 * by `ServiceDetailPage` to surface a «مقالات مرتبط» section on every
 * service page that has matching coverage in the blog. Posts are
 * deduplicated and returned sorted newest-first; pass `limit` to cap
 * the result count.
 */
export function getRelatedBlogPostsForService(
  slug: string,
  limit?: number,
): BlogPost[] {
  if (!slug) return []
  const seen = new Set<string>()
  const results: BlogPost[] = []
  // Pass 1: posts where this slug is the primary subject — strongest
  // semantic match, surface them first.
  for (const post of getBlogPostsSorted()) {
    if (post.primaryServiceSlug === slug && !seen.has(post.slug)) {
      seen.add(post.slug)
      results.push(post)
    }
  }
  // Pass 2: posts where this slug appears in `relatedServiceSlugs`.
  for (const post of getBlogPostsSorted()) {
    if (
      post.relatedServiceSlugs &&
      post.relatedServiceSlugs.includes(slug) &&
      !seen.has(post.slug)
    ) {
      seen.add(post.slug)
      results.push(post)
    }
  }
  if (limit != null && limit >= 0) return results.slice(0, limit)
  return results
}
