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
    howToSteps: [
      {
        name: 'باز کردن صفحه اکانت ChatGPT Plus در پی‌کارت',
        text: 'به آدرس صفحه اکانت ChatGPT Plus در پی‌کارت بروید و از بین پلن‌های اکانت اشتراکی، اختصاصی، سه‌ماهه و سالانه گزینه دلخواه خود را در نظر بگیرید.',
        url: '/s/chatgpt',
      },
      {
        name: 'انتخاب پلن متناسب با نیاز شما',
        text: 'اگر برای اولین بار اشتراک ChatGPT Plus را تهیه می‌کنید، پلن یک‌ماهه را به‌عنوان شروع انتخاب کنید. برای استفاده حرفه‌ای و بلندمدت، پلن سه‌ماهه یا سالانه به‌صرفه‌تر است.',
        url: '/s/chatgpt',
      },
      {
        name: 'پرداخت ریالی از طریق درگاه شتاب',
        text: 'سفارش خود را با کارت‌های شتاب پرداخت کنید. تمام پرداخت‌ها از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و کاملاً ریالی است؛ نیازی به کارت دلاری یا حساب خارجی ندارید.',
      },
      {
        name: 'دریافت اطلاعات اکانت',
        text: 'اطلاعات اکانت ChatGPT Plus شامل ایمیل، رمز عبور و راهنمای فعال‌سازی به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
      },
      {
        name: 'ورود به اکانت با تحریم‌شکن مناسب',
        text: 'برای ورود به ChatGPT از یک تحریم‌شکن با خروجی ثابت استفاده کنید. وارد سایت chat.openai.com شوید، با ایمیل و رمز ارائه‌شده وارد شوید و از مدل GPT-4o استفاده کنید.',
      },
    ],
    howToTotalTime: 'PT5M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Midjourney',
        text: 'صفحه اکانت Midjourney را در پی‌کارت باز کنید و از بین پلن‌های Basic، Standard، Pro و Mega گزینه متناسب با نیاز خود (تعداد ساعت GPU ماهانه) را انتخاب کنید.',
        url: '/s/midjourney',
      },
      {
        name: 'ثبت سفارش و پرداخت تومانی',
        text: 'سفارش را به سبد خرید اضافه کنید و با کارت‌های شتاب به‌صورت ریالی پرداخت کنید. فاکتور تومانی به‌صورت اتوماتیک در پنل کاربری شما ثبت می‌شود.',
      },
      {
        name: 'دریافت لینک دعوت Discord',
        text: 'پس از پرداخت، لینک دعوت سرور رسمی Midjourney و اطلاعات اکانت Discord از طریق پنل کاربری و ایمیل برای شما ارسال می‌شود.',
      },
      {
        name: 'پیوستن به سرور Midjourney',
        text: 'با کلیک روی لینک دعوت، اکانت Discord خود را به سرور Midjourney متصل کنید. در یکی از کانال‌های newbies دستور /imagine را اجرا کنید تا تولید تصویر شروع شود.',
      },
      {
        name: 'فعال‌سازی پلن روی اکانت Discord',
        text: 'با دستور /subscribe در کانال Midjourney اشتراک را روی اکانت Discord خود فعال کنید و از کریدیت GPU پلن خریداری‌شده استفاده کنید.',
      },
    ],
    howToTotalTime: 'PT8M',
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
    howToSteps: [
      {
        name: 'باز کردن صفحه Claude Pro در پی‌کارت',
        text: 'صفحه اکانت Claude Pro را در پی‌کارت باز کنید. پلن‌های اشتراکی و اختصاصی با مدل Claude 3.5 Sonnet و Claude 3 Opus در دسترس‌اند.',
        url: '/s/claude',
      },
      {
        name: 'انتخاب پلن مناسب',
        text: 'اگر تازه‌کار هستید پلن یک‌ماهه را تست کنید؛ برای کاربری حرفه‌ای روی متن‌های بلند و پروژه‌های آکادمیک پلن سالانه به‌صرفه‌تر است.',
        url: '/s/claude',
      },
      {
        name: 'پرداخت ریالی',
        text: 'سفارش را از طریق درگاه شاپرک با کارت‌های شتابی به‌صورت ریالی پرداخت کنید.',
      },
      {
        name: 'دریافت اطلاعات اکانت',
        text: 'اطلاعات اکانت Claude Pro در پنل کاربری و ایمیل شما در کمتر از ۱۰ دقیقه ارسال می‌شود.',
      },
      {
        name: 'ورود به claude.ai',
        text: 'با تحریم‌شکن ثابت وارد claude.ai شوید، با ایمیل و رمز ارائه‌شده وارد شوید و از مدل Claude 3.5 Sonnet/Opus استفاده کنید.',
      },
    ],
    howToTotalTime: 'PT5M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Canva Pro',
        text: 'صفحه اکانت Canva Pro در پی‌کارت را باز کنید. پلن‌های یک‌ماهه و یک‌ساله با دسترسی به همه قالب‌های پولی Canva موجود هستند.',
        url: '/s/canva',
      },
      {
        name: 'پرداخت تومانی',
        text: 'سفارش را با کارت‌های شتاب به‌صورت ریالی پرداخت کنید. هیچ کارت دلاری یا حساب خارجی نیاز نیست.',
      },
      {
        name: 'دریافت ایمیل دعوت Canva',
        text: 'پس از پرداخت موفق، یک ایمیل دعوت رسمی از طرف Canva برای شما ارسال می‌شود تا به تیم Canva Pro اضافه شوید.',
      },
      {
        name: 'پذیرش دعوت',
        text: 'روی دعوت کلیک کنید، با ایمیل خودتان وارد Canva شوید و دعوت تیم Pro را بپذیرید. اشتراک به‌صورت اتوماتیک روی اکانت شخصی شما فعال می‌شود.',
      },
      {
        name: 'استفاده از قالب‌های Pro',
        text: 'اکنون می‌توانید از تمام قالب‌ها، استوک عکس، فونت‌های پولی، Background Remover و Brand Kit Canva Pro استفاده کنید.',
      },
    ],
    howToTotalTime: 'PT4M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Adobe Creative Cloud',
        text: 'صفحه اکانت Adobe Creative Cloud در پی‌کارت را باز کنید. پلن‌های All Apps، Single App و دانشجویی با دسترسی به Photoshop، Premiere، Illustrator و سایر اپ‌ها موجود است.',
        url: '/s/adobe-creative',
      },
      {
        name: 'پرداخت ریالی',
        text: 'سفارش را از طریق درگاه شتاب به‌صورت تومانی پرداخت کنید. فاکتور رسمی در پنل کاربری ثبت می‌شود.',
      },
      {
        name: 'دریافت اطلاعات اکانت Adobe',
        text: 'اطلاعات اکانت Adobe ID شامل ایمیل و رمز در پنل کاربری و ایمیل شما در کمتر از یک ساعت ارسال می‌شود.',
      },
      {
        name: 'دانلود Creative Cloud Desktop',
        text: 'اپلیکیشن Creative Cloud Desktop را از سایت رسمی Adobe دانلود و نصب کنید. با اطلاعات اکانت ارائه‌شده وارد شوید.',
      },
      {
        name: 'نصب اپ‌های Adobe',
        text: 'از پنل Creative Cloud Desktop نرم‌افزارهای موردنیاز (Photoshop، Premiere Pro، Illustrator، …) را نصب کنید. تمام اپ‌ها لایسنس فعال خواهند بود.',
      },
    ],
    howToTotalTime: 'PT8M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Apple Music',
        text: 'صفحه اکانت Apple Music در پی‌کارت را باز کنید. پلن‌های Individual و Family در ریجن‌های ترکیه و آمریکا موجود است.',
        url: '/s/apple-music',
      },
      {
        name: 'پرداخت تومانی',
        text: 'سفارش را از طریق کارت‌های شتاب به‌صورت ریالی پرداخت کنید.',
      },
      {
        name: 'دریافت کد گیفت‌کارت Apple Music',
        text: 'پس از پرداخت، کد رسمی گیفت‌کارت Apple Music در پنل کاربری شما نمایش داده می‌شود.',
      },
      {
        name: 'فعال‌سازی روی Apple ID خودتان',
        text: 'وارد App Store روی آیفون یا Mac خود شوید، گزینه Redeem را بزنید و کد را وارد کنید تا اشتراک Apple Music روی Apple ID شخصی شما فعال شود.',
      },
      {
        name: 'شروع به گوش دادن',
        text: 'اپ Apple Music را باز کنید. کاتالوگ کامل با کیفیت Lossless و Dolby Atmos برای شما در دسترس خواهد بود.',
      },
    ],
    howToTotalTime: 'PT5M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Duolingo Super',
        text: 'صفحه اکانت Duolingo Super در پی‌کارت را باز کنید. پلن‌های Individual یک‌ماهه، شش‌ماهه و یک‌ساله موجود است.',
        url: '/s/duolingo',
      },
      {
        name: 'پرداخت ریالی',
        text: 'سفارش را با کارت‌های شتاب به‌صورت ریالی پرداخت کنید.',
      },
      {
        name: 'دریافت ایمیل دعوت Duolingo',
        text: 'پس از پرداخت موفق، ایمیل دعوت Duolingo برای پیوستن به پلن Super برای شما ارسال می‌شود.',
      },
      {
        name: 'پذیرش دعوت',
        text: 'روی دعوت کلیک کنید، با اکانت خودتان وارد Duolingo شوید و عضویت Super را تأیید کنید.',
      },
      {
        name: 'استفاده از قابلیت‌های Super',
        text: 'اکنون می‌توانید بدون تبلیغ، با قلب نامحدود و دسترسی به همه ویژگی‌های Super مانند Mistakes Review و Personalized Practice یاد بگیرید.',
      },
    ],
    howToTotalTime: 'PT4M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن LinkedIn Premium',
        text: 'صفحه اکانت LinkedIn Premium در پی‌کارت را باز کنید. پلن‌های Career، Business، Sales Navigator و Recruiter موجود است.',
        url: '/s/linkedin',
      },
      {
        name: 'پرداخت تومانی',
        text: 'سفارش را از طریق درگاه شتاب با کارت‌های شتابی به‌صورت ریالی پرداخت کنید.',
      },
      {
        name: 'ارائه ایمیل اکانت LinkedIn',
        text: 'در پنل کاربری ایمیل اکانت لینکدین خودتان را وارد کنید تا اشتراک Premium روی همان اکانت فعال شود.',
      },
      {
        name: 'فعال‌سازی Premium روی اکانت شما',
        text: 'تیم پشتیبانی پی‌کارت اشتراک Premium را روی اکانت شخصی شما فعال می‌کند. تأیید فعال‌سازی از طریق پنل و ایمیل به شما اطلاع داده می‌شود.',
      },
      {
        name: 'استفاده از قابلیت‌های Premium',
        text: 'اکنون می‌توانید از InMail نامحدود، LinkedIn Learning، Who Viewed Your Profile و سایر قابلیت‌های Premium روی اکانت شخصی خود استفاده کنید.',
      },
    ],
    howToTotalTime: 'PT5M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Dropbox Plus',
        text: 'صفحه اکانت Dropbox Plus در پی‌کارت را باز کنید. پلن‌های Plus (۲ ترابایت)، Family و Professional (۳ ترابایت) موجود است.',
        url: '/s/dropbox',
      },
      {
        name: 'پرداخت ریالی',
        text: 'سفارش را از طریق درگاه شاپرک با کارت‌های شتاب به‌صورت ریالی پرداخت کنید.',
      },
      {
        name: 'دریافت اطلاعات اکانت',
        text: 'اطلاعات اکانت Dropbox شامل ایمیل و رمز در پنل کاربری و ایمیل شما در کمتر از یک ساعت ارسال می‌شود.',
      },
      {
        name: 'ورود به dropbox.com',
        text: 'با اطلاعات ارائه‌شده وارد dropbox.com شوید. فضای ۲ ترابایتی به‌صورت اتوماتیک روی اکانت شما در دسترس است.',
      },
      {
        name: 'نصب اپ Dropbox Desktop',
        text: 'اپ Dropbox Desktop را روی ویندوز/مک خود نصب کنید و فولدر Dropbox شما به‌صورت اتوماتیک با ابر همگام می‌شود.',
      },
    ],
    howToTotalTime: 'PT5M',
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
    howToSteps: [
      {
        name: 'انتخاب پلن Gemini Advanced',
        text: 'صفحه اکانت Gemini Advanced در پی‌کارت را باز کنید. پلن‌های Google One AI Premium با ۲ ترابایت فضای ابری به همراه دسترسی Gemini Advanced موجود است.',
        url: '/s/gemini',
      },
      {
        name: 'پرداخت تومانی',
        text: 'سفارش را از طریق کارت‌های شتاب به‌صورت ریالی پرداخت کنید.',
      },
      {
        name: 'دریافت اطلاعات اکانت Google',
        text: 'اطلاعات اکانت Google با اشتراک Google One AI Premium در پنل کاربری شما ارائه می‌شود.',
      },
      {
        name: 'ورود به gemini.google.com',
        text: 'با تحریم‌شکن ثابت وارد gemini.google.com شوید و با اطلاعات ارائه‌شده لاگین کنید.',
      },
      {
        name: 'استفاده از مدل Gemini Advanced',
        text: 'مدل Gemini 1.5 Pro/2.0 Pro در دسترس شماست. می‌توانید فایل‌های PDF تا ۲ میلیون توکن آپلود کنید و با Gemini در Gmail، Docs و Sheets ادغام شده استفاده کنید.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-dr-fone-iran',
    titleFa: 'خرید اکانت Dr Fone در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Dr Fone subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Dr Fone از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Dr Fone در پی‌کارت',
    keywords: [
      'خرید Dr Fone',
      'خرید اکانت Dr Fone',
      'اشتراک Dr Fone ایران',
      'اکانت Dr Fone ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'dr-fone',
    primaryCtaLabel: 'خرید اکانت Dr Fone',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'icloud',
      'hitpaw',
    ],
    sections: [
      {
        heading: 'چرا Dr Fone برای بهره‌وری و کار؟',
        body: [
          'Dr Fone از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Dr Fone',
        body: [
          'پی‌کارت چندین پلن مختلف از Dr Fone عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Dr Fone',
          path: '/s/dr-fone',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Dr Fone با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Dr Fone در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Dr Fone',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Dr Fone خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Dr Fone در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Dr Fone چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Dr Fone به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Dr Fone نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Dr Fone برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Dr Fone چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Dr Fone وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Dr Fone در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Dr Fone بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/dr-fone',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Dr Fone (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Dr Fone',
        text: 'به وب‌سایت یا اپلیکیشن Dr Fone مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Dr Fone استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-jetbrains-iran',
    titleFa: 'خرید اکانت JetBrains در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy JetBrains subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک JetBrains از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/developer-tools.jpg',
    coverAlt: 'خرید JetBrains در پی‌کارت',
    keywords: [
      'خرید JetBrains',
      'خرید اکانت JetBrains',
      'اشتراک JetBrains ایران',
      'اکانت JetBrains ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'jetbrains',
    primaryCtaLabel: 'خرید اکانت JetBrains',
    primaryCategorySlug: 'developer-tools',
    relatedServiceSlugs: [
      'copilot',
      'proton',
    ],
    sections: [
      {
        heading: 'چرا لایسنس JetBrains از پی‌کارت؟',
        body: [
          'برنامه‌نویسان و توسعه‌دهندگان نیاز به ابزارهای حرفه‌ای دارند که از فارسی پشتیبانی نمی‌کنند ولی استاندارد صنعت محسوب می‌شوند. JetBrains یکی از این ابزارهاست که با لایسنس رسمی، آپدیت دائمی و دسترسی به افزونه‌ها همراه است. تحریم‌های آمریکا و اروپا خرید مستقیم از ایران را ناممکن کرده — راه‌حل قانونی پی‌کارت تحویل لایسنس رسمی به همراه فاکتور است.',
          'بدون پی‌کارت باید با کارت بین‌المللی پرداخت کرده و امیدوار باشید لایسنس به IP ایرانی نشت نکند. در عمل، اکانت‌های زیادی به‌دلیل تخلف از Terms مسدود می‌شوند. پی‌کارت این فرآیند را روی زیرساخت قانونی انجام می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های JetBrains',
        body: [
          'پی‌کارت چندین پلن مختلف از JetBrains عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن سه و شش‌ماهه با تخفیف',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای کارهای حرفه‌ای',
          'پلن تیمی برای استودیو و شرکت‌ها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های JetBrains',
          path: '/s/jetbrains',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش JetBrains با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های JetBrains در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای فعال‌سازی، یک IDE یا اپلیکیشن دسکتاپ نیاز به ورود با ایمیل و کلید لایسنس دارد؛ راهنمای کامل در صفحه محصول قرار داده شده است.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با JetBrains',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «برنامه نویسی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های برنامه نویسی',
          path: '/c/developer-tools',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت JetBrains خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های JetBrains در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت JetBrains چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های JetBrains به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از JetBrains نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. JetBrains برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی JetBrains چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت JetBrains وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت JetBrains در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت JetBrains بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/jetbrains',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت JetBrains (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت JetBrains',
        text: 'به وب‌سایت یا اپلیکیشن JetBrains مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های JetBrains استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-pluralsight-iran',
    titleFa: 'خرید اکانت Pluralsight در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Pluralsight subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Pluralsight از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Pluralsight در پی‌کارت',
    keywords: [
      'خرید Pluralsight',
      'خرید اکانت Pluralsight',
      'اشتراک Pluralsight ایران',
      'اکانت Pluralsight ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'pluralsight',
    primaryCtaLabel: 'خرید اکانت Pluralsight',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'magoosh',
      'lingq',
    ],
    sections: [
      {
        heading: 'چرا Pluralsight برای بهره‌وری و کار؟',
        body: [
          'Pluralsight از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Pluralsight',
        body: [
          'پی‌کارت چندین پلن مختلف از Pluralsight عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Pluralsight',
          path: '/s/pluralsight',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Pluralsight با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Pluralsight در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Pluralsight',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Pluralsight خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Pluralsight در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Pluralsight چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Pluralsight به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Pluralsight نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Pluralsight برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Pluralsight چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Pluralsight وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Pluralsight در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Pluralsight بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/pluralsight',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Pluralsight (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Pluralsight',
        text: 'به وب‌سایت یا اپلیکیشن Pluralsight مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Pluralsight استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-nightcafe-iran',
    titleFa: 'خرید اکانت Nightcafe در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Nightcafe subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Nightcafe از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-image.jpg',
    coverAlt: 'خرید Nightcafe در پی‌کارت',
    keywords: [
      'خرید Nightcafe',
      'خرید اکانت Nightcafe',
      'اشتراک Nightcafe ایران',
      'اکانت Nightcafe ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'nightcafe',
    primaryCtaLabel: 'خرید اکانت Nightcafe',
    primaryCategorySlug: 'ai-image',
    relatedServiceSlugs: [
      'ideogram',
      'leonardo',
    ],
    sections: [
      {
        heading: 'چرا Nightcafe برای تولید تصویر هوش مصنوعی؟',
        body: [
          'سرویس‌های هوش مصنوعی تولید تصویر در سال‌های اخیر کیفیت و دقتی فراتر از انتظار پیدا کرده‌اند. Nightcafe یکی از پلتفرم‌های شناخته‌شده در این حوزه است که قابلیت‌هایی مانند تولید تصویر از متن، ویرایش تصویر، طراحی پوستر و کاراکتر، آپ‌اسکیل و رفع نویز را با مدل‌های قدرتمند ارائه می‌کند. برای کاربران ایرانی که نیاز به ابزار حرفه‌ای دیزاین، تبلیغات یا تولید محتوای بصری دارند، Nightcafe یک گزینه مقرون‌به‌صرفه و قانونی محسوب می‌شود.',
          'به دلیل تحریم‌ها، اکثر این سرویس‌ها کارت بانکی ایرانی را نمی‌پذیرند و نیاز به شماره بین‌المللی، روش پرداخت ارزی و پروکسی دارند. پی‌کارت همه این فرآیند را به‌صورت رسمی انجام می‌دهد و اکانت آماده‌به‌کار را با تحویل آنی و قیمت تومانی به شما تحویل می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های Nightcafe و قیمت‌گذاری در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Nightcafe عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و کارهای تک‌پروژه‌ای',
          'پلن سه‌ماهه با تخفیف نسبت به خرید جداگانه',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای دیزاینرها و تیم‌های محتوا',
          'پلن اختصاصی و اشتراکی — مناسب کسب‌وکارها و فریلنسرها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Nightcafe',
          path: '/s/nightcafe',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Nightcafe با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Nightcafe در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'مدل‌های فعلی Nightcafe از فرمان فارسی هم پشتیبانی می‌کنند، اما برای دقت بهتر توصیه می‌شود فرمان‌ها (prompt) را به انگلیسی یا فارسی‌انگلیسی همراه با کلیدواژه‌های فنی بنویسید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Nightcafe',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید تصویر» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید تصویر',
          path: '/c/ai-image',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Nightcafe خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Nightcafe در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Nightcafe چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Nightcafe به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Nightcafe نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Nightcafe برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Nightcafe چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Nightcafe وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Nightcafe در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Nightcafe بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/nightcafe',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Nightcafe (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Nightcafe',
        text: 'به وب‌سایت یا اپلیکیشن Nightcafe مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Nightcafe استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-perplexity-iran',
    titleFa: 'خرید اکانت Perplexity در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Perplexity subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Perplexity از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/streaming.jpg',
    coverAlt: 'خرید Perplexity در پی‌کارت',
    keywords: [
      'خرید Perplexity',
      'خرید اکانت Perplexity',
      'اشتراک Perplexity ایران',
      'اکانت Perplexity ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'perplexity',
    primaryCtaLabel: 'خرید اکانت Perplexity',
    primaryCategorySlug: 'streaming',
    relatedServiceSlugs: [
      'copilot',
    ],
    sections: [
      {
        heading: 'چرا اشتراک Perplexity از پی‌کارت؟',
        body: [
          'Perplexity یکی از سرویس‌های پخش آنلاین مطرح است که برای کاربران ایرانی به دلیل محدودیت‌های منطقه‌ای و عدم پذیرش کارت بانکی، خرید مستقیم آن دشوار است. پی‌کارت این فرآیند را با خرید قانونی و تحویل آنی آسان کرده — اکانت با IP پایدار و گارانتی اصالت تحویل می‌گردد.',
          'بدون پی‌کارت، باید با کارت بین‌المللی، VPN دائمی و آدرس خارج از ایران ثبت‌نام می‌کردید — فرایندی پرخطر که اکانت را در ریسک بسته‌شدن قرار می‌دهد. خرید از پی‌کارت این ریسک را حذف می‌کند.',
        ],
      },
      {
        heading: 'پلن‌های Perplexity در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Perplexity عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و استفاده موقت',
          'پلن سه‌ماهه و شش‌ماهه با تخفیف نسبت به ماهانه',
          'پلن سالانه — بهترین قیمت',
          'پلن اشتراکی و اختصاصی برای انتخاب بر اساس بودجه',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Perplexity',
          path: '/s/perplexity',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Perplexity با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Perplexity در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای تماشای محتوای دوبله یا زیرنویس فارسی، فهرست‌های کاربری اختصاصی پیشنهاد می‌شود.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Perplexity',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «فیلم و سرگرمی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های فیلم و سرگرمی',
          path: '/c/streaming',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Perplexity خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Perplexity در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Perplexity چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Perplexity به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Perplexity نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Perplexity برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Perplexity چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Perplexity وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Perplexity در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Perplexity بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/perplexity',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Perplexity (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Perplexity',
        text: 'به وب‌سایت یا اپلیکیشن Perplexity مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Perplexity استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-quillbot-iran',
    titleFa: 'خرید اکانت Quillbot در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Quillbot subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Quillbot از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-writing-seo.jpg',
    coverAlt: 'خرید Quillbot در پی‌کارت',
    keywords: [
      'خرید Quillbot',
      'خرید اکانت Quillbot',
      'اشتراک Quillbot ایران',
      'اکانت Quillbot ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'quillbot',
    primaryCtaLabel: 'خرید اکانت Quillbot',
    primaryCategorySlug: 'ai-writing-seo',
    relatedServiceSlugs: [
      'deepl',
      'prowritingaid',
    ],
    sections: [
      {
        heading: 'چرا Quillbot برای محتوا و SEO؟',
        body: [
          'Quillbot ابزاری حرفه‌ای است که فرآیند تولید محتوا، بازنویسی متن، بررسی گرامر، تشخیص متن AI و بهینه‌سازی برای موتورهای جستجو را تسریع می‌کند. کارمندان دیجیتال‌مارکتینگ، نویسندگان وبلاگ و دانشجویان از این ابزار استفاده می‌کنند تا کیفیت متن انگلیسی را بدون نیاز به ویراستار حرفه‌ای بالا ببرند.',
          'دسترسی مستقیم به نسخه Premium از ایران به دلیل تحریم و محدودیت‌های پرداخت ممکن نیست. اکانت‌های پی‌کارت با پلن کامل و بدون محدودیت IP، با تحویل آنی و گارانتی به شما داده می‌شود.',
        ],
      },
      {
        heading: 'پلن‌های Quillbot و قیمت تومانی',
        body: [
          'پی‌کارت چندین پلن مختلف از Quillbot عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Premium ماهانه با تمام قابلیت‌های پیشرفته',
          'پلن سه‌ماهه و سالانه با تخفیف بیشتر',
          'پلن اختصاصی برای کاربرانی که نمی‌خواهند اکانت اشتراکی استفاده کنند',
          'پلن تیمی برای آژانس‌ها و تیم‌های محتوا',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Quillbot',
          path: '/s/quillbot',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Quillbot با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Quillbot در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'اگر زبان مادری شما فارسی است، Quillbot را با مترجم‌های هوش مصنوعی مثل DeepL ترکیب کنید تا کیفیت خروجی نهایی صیقلی شود.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Quillbot',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «نوشتار و سئو» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های نوشتار و سئو',
          path: '/c/ai-writing-seo',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Quillbot خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Quillbot در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Quillbot چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Quillbot به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Quillbot نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Quillbot برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Quillbot چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Quillbot وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Quillbot در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Quillbot بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/quillbot',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Quillbot (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Quillbot',
        text: 'به وب‌سایت یا اپلیکیشن Quillbot مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Quillbot استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-surfer-seo-iran',
    titleFa: 'خرید اکانت Surfer Seo در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Surfer Seo subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Surfer Seo از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/business-marketing.jpg',
    coverAlt: 'خرید Surfer Seo در پی‌کارت',
    keywords: [
      'خرید Surfer Seo',
      'خرید اکانت Surfer Seo',
      'اشتراک Surfer Seo ایران',
      'اکانت Surfer Seo ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'surfer-seo',
    primaryCtaLabel: 'خرید اکانت Surfer Seo',
    primaryCategorySlug: 'business-marketing',
    relatedServiceSlugs: [
      'rephrasy',
      'flexclip',
    ],
    sections: [
      {
        heading: 'چرا Surfer Seo برای کسب‌وکار و بازاریابی؟',
        body: [
          'Surfer Seo ابزار حرفه‌ای حوزه بازاریابی، تبلیغات و رشد کسب‌وکار است. تیم‌های فروش، آژانس‌های دیجیتال مارکتینگ و کسب‌وکارهای ایرانی برای دسترسی به ابزارهای روز و رقابت با بازار جهانی، نیازمند این پلتفرم‌اند. پی‌کارت پلن‌ها را با پرداخت تومانی و تحویل آنی ارائه می‌دهد.',
          'بدون پی‌کارت، خرید نسخه Premium از ایران تقریباً غیرممکن است: نه پرداخت ریالی پذیرفته می‌شود، نه IP ایرانی. خرید پی‌کارت یعنی اکانت روی زیرساخت قانونی و گارانتی اصالت.',
        ],
      },
      {
        heading: 'پلن‌های Surfer Seo',
        body: [
          'پی‌کارت چندین پلن مختلف از Surfer Seo عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن استاندارد یک‌ماهه و سه‌ماهه',
          'پلن Pro / Business با ابزارهای پیشرفته‌تر',
          'پلن سالانه با تخفیف نسبت به ماهانه',
          'پلن Agency / Enterprise برای آژانس‌ها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Surfer Seo',
          path: '/s/surfer-seo',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Surfer Seo با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Surfer Seo در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'بسیاری از این پلتفرم‌ها API هم دارند — اگر تیم توسعه‌دهنده دارید، می‌توانید با اتوماسیون داده‌ها سود بیشتری ببرید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Surfer Seo',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کسب و کار و بازاریابی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کسب و کار و بازاریابی',
          path: '/c/business-marketing',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Surfer Seo خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Surfer Seo در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Surfer Seo چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Surfer Seo به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Surfer Seo نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Surfer Seo برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Surfer Seo چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Surfer Seo وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Surfer Seo در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Surfer Seo بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/surfer-seo',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Surfer Seo (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Surfer Seo',
        text: 'به وب‌سایت یا اپلیکیشن Surfer Seo مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Surfer Seo استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-ideogram-iran',
    titleFa: 'خرید اکانت Ideogram در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Ideogram subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Ideogram از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-image.jpg',
    coverAlt: 'خرید Ideogram در پی‌کارت',
    keywords: [
      'خرید Ideogram',
      'خرید اکانت Ideogram',
      'اشتراک Ideogram ایران',
      'اکانت Ideogram ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'ideogram',
    primaryCtaLabel: 'خرید اکانت Ideogram',
    primaryCategorySlug: 'ai-image',
    relatedServiceSlugs: [
      'nightcafe',
      'leonardo',
    ],
    sections: [
      {
        heading: 'چرا Ideogram برای تولید تصویر هوش مصنوعی؟',
        body: [
          'سرویس‌های هوش مصنوعی تولید تصویر در سال‌های اخیر کیفیت و دقتی فراتر از انتظار پیدا کرده‌اند. Ideogram یکی از پلتفرم‌های شناخته‌شده در این حوزه است که قابلیت‌هایی مانند تولید تصویر از متن، ویرایش تصویر، طراحی پوستر و کاراکتر، آپ‌اسکیل و رفع نویز را با مدل‌های قدرتمند ارائه می‌کند. برای کاربران ایرانی که نیاز به ابزار حرفه‌ای دیزاین، تبلیغات یا تولید محتوای بصری دارند، Ideogram یک گزینه مقرون‌به‌صرفه و قانونی محسوب می‌شود.',
          'به دلیل تحریم‌ها، اکثر این سرویس‌ها کارت بانکی ایرانی را نمی‌پذیرند و نیاز به شماره بین‌المللی، روش پرداخت ارزی و پروکسی دارند. پی‌کارت همه این فرآیند را به‌صورت رسمی انجام می‌دهد و اکانت آماده‌به‌کار را با تحویل آنی و قیمت تومانی به شما تحویل می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های Ideogram و قیمت‌گذاری در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Ideogram عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و کارهای تک‌پروژه‌ای',
          'پلن سه‌ماهه با تخفیف نسبت به خرید جداگانه',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای دیزاینرها و تیم‌های محتوا',
          'پلن اختصاصی و اشتراکی — مناسب کسب‌وکارها و فریلنسرها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Ideogram',
          path: '/s/ideogram',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Ideogram با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Ideogram در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'مدل‌های فعلی Ideogram از فرمان فارسی هم پشتیبانی می‌کنند، اما برای دقت بهتر توصیه می‌شود فرمان‌ها (prompt) را به انگلیسی یا فارسی‌انگلیسی همراه با کلیدواژه‌های فنی بنویسید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Ideogram',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید تصویر» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید تصویر',
          path: '/c/ai-image',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Ideogram خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Ideogram در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Ideogram چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Ideogram به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Ideogram نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Ideogram برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Ideogram چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Ideogram وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Ideogram در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Ideogram بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/ideogram',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Ideogram (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Ideogram',
        text: 'به وب‌سایت یا اپلیکیشن Ideogram مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Ideogram استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-leonardo-iran',
    titleFa: 'خرید اکانت Leonardo در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Leonardo subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Leonardo از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-image.jpg',
    coverAlt: 'خرید Leonardo در پی‌کارت',
    keywords: [
      'خرید Leonardo',
      'خرید اکانت Leonardo',
      'اشتراک Leonardo ایران',
      'اکانت Leonardo ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'leonardo',
    primaryCtaLabel: 'خرید اکانت Leonardo',
    primaryCategorySlug: 'ai-image',
    relatedServiceSlugs: [
      'ideogram',
      'nightcafe',
    ],
    sections: [
      {
        heading: 'چرا Leonardo برای تولید تصویر هوش مصنوعی؟',
        body: [
          'سرویس‌های هوش مصنوعی تولید تصویر در سال‌های اخیر کیفیت و دقتی فراتر از انتظار پیدا کرده‌اند. Leonardo یکی از پلتفرم‌های شناخته‌شده در این حوزه است که قابلیت‌هایی مانند تولید تصویر از متن، ویرایش تصویر، طراحی پوستر و کاراکتر، آپ‌اسکیل و رفع نویز را با مدل‌های قدرتمند ارائه می‌کند. برای کاربران ایرانی که نیاز به ابزار حرفه‌ای دیزاین، تبلیغات یا تولید محتوای بصری دارند، Leonardo یک گزینه مقرون‌به‌صرفه و قانونی محسوب می‌شود.',
          'به دلیل تحریم‌ها، اکثر این سرویس‌ها کارت بانکی ایرانی را نمی‌پذیرند و نیاز به شماره بین‌المللی، روش پرداخت ارزی و پروکسی دارند. پی‌کارت همه این فرآیند را به‌صورت رسمی انجام می‌دهد و اکانت آماده‌به‌کار را با تحویل آنی و قیمت تومانی به شما تحویل می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های Leonardo و قیمت‌گذاری در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Leonardo عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و کارهای تک‌پروژه‌ای',
          'پلن سه‌ماهه با تخفیف نسبت به خرید جداگانه',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای دیزاینرها و تیم‌های محتوا',
          'پلن اختصاصی و اشتراکی — مناسب کسب‌وکارها و فریلنسرها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Leonardo',
          path: '/s/leonardo',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Leonardo با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Leonardo در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'مدل‌های فعلی Leonardo از فرمان فارسی هم پشتیبانی می‌کنند، اما برای دقت بهتر توصیه می‌شود فرمان‌ها (prompt) را به انگلیسی یا فارسی‌انگلیسی همراه با کلیدواژه‌های فنی بنویسید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Leonardo',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید تصویر» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید تصویر',
          path: '/c/ai-image',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Leonardo خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Leonardo در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Leonardo چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Leonardo به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Leonardo نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Leonardo برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Leonardo چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Leonardo وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Leonardo در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Leonardo بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/leonardo',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Leonardo (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Leonardo',
        text: 'به وب‌سایت یا اپلیکیشن Leonardo مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Leonardo استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-suno-iran',
    titleFa: 'خرید اکانت Suno در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Suno subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Suno از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-voice-music.jpg',
    coverAlt: 'خرید Suno در پی‌کارت',
    keywords: [
      'خرید Suno',
      'خرید اکانت Suno',
      'اشتراک Suno ایران',
      'اکانت Suno ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'suno',
    primaryCtaLabel: 'خرید اکانت Suno',
    primaryCategorySlug: 'ai-voice-music',
    relatedServiceSlugs: [
      'elevenlabs',
      'ilovesong',
    ],
    sections: [
      {
        heading: 'چرا Suno برای صدا و موسیقی هوش مصنوعی؟',
        body: [
          'Suno از قدرتمندترین ابزارهای صوتی هوش مصنوعی است که تبدیل متن به گفتار با صدای طبیعی، ساخت موسیقی، کلون صدا، حذف نویز و ترانه‌سرایی هوش مصنوعی را پوشش می‌دهد. مناسب پادکستر، خواننده، تولیدکننده محتوای ویدیویی و هر کسی که به خروجی صوتی استاندارد نیاز دارد.',
          'پرداخت به این سرویس از ایران مستلزم کارت بین‌المللی است و در صورت تشخیص IP غیرمجاز، اکانت بسته می‌شود. خرید از پی‌کارت این ریسک را حذف می‌کند: اکانت با IP ثابت، ایمیل تأییدشده و کردیت کامل تحویل می‌گردد.',
        ],
      },
      {
        heading: 'پلن‌های Suno در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Suno عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Starter / Free Trial برای تست محدود',
          'پلن Creator با کردیت بالاتر و کیفیت Premium',
          'پلن Pro / Business — مناسب استودیو و تولیدکنندگان حرفه‌ای',
          'پلن سالانه با تخفیف نسبت به ماهانه',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Suno',
          path: '/s/suno',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Suno با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Suno در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای فارسی، می‌توانید از مدل‌های Multilingual Suno استفاده کنید — کیفیت تلفظ فارسی به‌مراتب بهتر از سال گذشته شده.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Suno',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «صدا و موسیقی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های صدا و موسیقی',
          path: '/c/ai-voice-music',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Suno خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Suno در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Suno چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Suno به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Suno نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Suno برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Suno چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Suno وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Suno در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Suno بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/suno',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Suno (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Suno',
        text: 'به وب‌سایت یا اپلیکیشن Suno مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Suno استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-elevenlabs-iran',
    titleFa: 'خرید اکانت Elevenlabs در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Elevenlabs subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Elevenlabs از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-voice-music.jpg',
    coverAlt: 'خرید Elevenlabs در پی‌کارت',
    keywords: [
      'خرید Elevenlabs',
      'خرید اکانت Elevenlabs',
      'اشتراک Elevenlabs ایران',
      'اکانت Elevenlabs ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'elevenlabs',
    primaryCtaLabel: 'خرید اکانت Elevenlabs',
    primaryCategorySlug: 'ai-voice-music',
    relatedServiceSlugs: [
      'suno',
      'easymusic',
    ],
    sections: [
      {
        heading: 'چرا Elevenlabs برای صدا و موسیقی هوش مصنوعی؟',
        body: [
          'Elevenlabs از قدرتمندترین ابزارهای صوتی هوش مصنوعی است که تبدیل متن به گفتار با صدای طبیعی، ساخت موسیقی، کلون صدا، حذف نویز و ترانه‌سرایی هوش مصنوعی را پوشش می‌دهد. مناسب پادکستر، خواننده، تولیدکننده محتوای ویدیویی و هر کسی که به خروجی صوتی استاندارد نیاز دارد.',
          'پرداخت به این سرویس از ایران مستلزم کارت بین‌المللی است و در صورت تشخیص IP غیرمجاز، اکانت بسته می‌شود. خرید از پی‌کارت این ریسک را حذف می‌کند: اکانت با IP ثابت، ایمیل تأییدشده و کردیت کامل تحویل می‌گردد.',
        ],
      },
      {
        heading: 'پلن‌های Elevenlabs در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Elevenlabs عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Starter / Free Trial برای تست محدود',
          'پلن Creator با کردیت بالاتر و کیفیت Premium',
          'پلن Pro / Business — مناسب استودیو و تولیدکنندگان حرفه‌ای',
          'پلن سالانه با تخفیف نسبت به ماهانه',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Elevenlabs',
          path: '/s/elevenlabs',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Elevenlabs با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Elevenlabs در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای فارسی، می‌توانید از مدل‌های Multilingual Elevenlabs استفاده کنید — کیفیت تلفظ فارسی به‌مراتب بهتر از سال گذشته شده.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Elevenlabs',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «صدا و موسیقی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های صدا و موسیقی',
          path: '/c/ai-voice-music',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Elevenlabs خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Elevenlabs در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Elevenlabs چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Elevenlabs به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Elevenlabs نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Elevenlabs برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Elevenlabs چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Elevenlabs وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Elevenlabs در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Elevenlabs بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/elevenlabs',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Elevenlabs (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Elevenlabs',
        text: 'به وب‌سایت یا اپلیکیشن Elevenlabs مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Elevenlabs استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-hbo-iran',
    titleFa: 'خرید اکانت Hbo در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Hbo subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Hbo از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/streaming.jpg',
    coverAlt: 'خرید Hbo در پی‌کارت',
    keywords: [
      'خرید Hbo',
      'خرید اکانت Hbo',
      'اشتراک Hbo ایران',
      'اکانت Hbo ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'hbo',
    primaryCtaLabel: 'خرید اکانت Hbo',
    primaryCategorySlug: 'streaming',
    relatedServiceSlugs: [
      'perplexity',
    ],
    sections: [
      {
        heading: 'چرا اشتراک Hbo از پی‌کارت؟',
        body: [
          'Hbo یکی از سرویس‌های پخش آنلاین مطرح است که برای کاربران ایرانی به دلیل محدودیت‌های منطقه‌ای و عدم پذیرش کارت بانکی، خرید مستقیم آن دشوار است. پی‌کارت این فرآیند را با خرید قانونی و تحویل آنی آسان کرده — اکانت با IP پایدار و گارانتی اصالت تحویل می‌گردد.',
          'بدون پی‌کارت، باید با کارت بین‌المللی، VPN دائمی و آدرس خارج از ایران ثبت‌نام می‌کردید — فرایندی پرخطر که اکانت را در ریسک بسته‌شدن قرار می‌دهد. خرید از پی‌کارت این ریسک را حذف می‌کند.',
        ],
      },
      {
        heading: 'پلن‌های Hbo در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Hbo عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و استفاده موقت',
          'پلن سه‌ماهه و شش‌ماهه با تخفیف نسبت به ماهانه',
          'پلن سالانه — بهترین قیمت',
          'پلن اشتراکی و اختصاصی برای انتخاب بر اساس بودجه',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Hbo',
          path: '/s/hbo',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Hbo با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Hbo در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای تماشای محتوای دوبله یا زیرنویس فارسی، فهرست‌های کاربری اختصاصی پیشنهاد می‌شود.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Hbo',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «فیلم و سرگرمی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های فیلم و سرگرمی',
          path: '/c/streaming',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Hbo خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Hbo در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Hbo چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Hbo به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Hbo نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Hbo برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Hbo چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Hbo وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Hbo در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Hbo بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/hbo',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Hbo (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Hbo',
        text: 'به وب‌سایت یا اپلیکیشن Hbo مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Hbo استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-magoosh-iran',
    titleFa: 'خرید اکانت Magoosh در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Magoosh subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Magoosh از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/education.jpg',
    coverAlt: 'خرید Magoosh در پی‌کارت',
    keywords: [
      'خرید Magoosh',
      'خرید اکانت Magoosh',
      'اشتراک Magoosh ایران',
      'اکانت Magoosh ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'magoosh',
    primaryCtaLabel: 'خرید اکانت Magoosh',
    primaryCategorySlug: 'education',
    relatedServiceSlugs: [
      'lingq',
      'pluralsight',
    ],
    sections: [
      {
        heading: 'چرا اشتراک Magoosh برای یادگیری؟',
        body: [
          'Magoosh از پلتفرم‌های آموزشی پرکاربرد است که زبان‌آموزی، آموزش مهارت‌های شغلی، آماده‌سازی آزمون‌های بین‌المللی و دروس آکادمیک را پوشش می‌دهد. کاربران ایرانی به دلیل عدم پذیرش پرداخت ریالی نمی‌توانند مستقیماً از سایت اصلی خرید کنند؛ پی‌کارت اکانت رسمی را با تحویل آنی به شما تحویل می‌دهد.',
          'تجربه کاربران نشان داده در صورت پرداخت با کارت غیرمجاز یا IP ایرانی، Magoosh اکانت را بسته و بازگشت وجه ندارد. خرید از پی‌کارت این ریسک را حذف می‌کند: اکانت‌ها روی پرداخت قانونی و آدرس بین‌المللی فعال شده‌اند.',
        ],
      },
      {
        heading: 'پلن‌های Magoosh در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Magoosh عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Premium ماهانه برای دسترسی کامل به محتوا',
          'پلن سه/شش‌ماهه با تخفیف',
          'پلن سالانه — مقرون‌به‌صرفه برای دانشجو و یادگیرنده مداوم',
          'پلن گواهی‌نامه — مخصوص دوره‌های دارای Certificate رسمی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Magoosh',
          path: '/s/magoosh',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Magoosh با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Magoosh در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کاربران ایرانی، گواهینامه‌های دیجیتال صادره از این پلتفرم‌ها در LinkedIn و Resume قابل استفاده‌اند و توسط کارفرمایان بین‌المللی به‌رسمیت شناخته می‌شوند.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Magoosh',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «آموزش» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های آموزش',
          path: '/c/education',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Magoosh خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Magoosh در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Magoosh چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Magoosh به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Magoosh نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Magoosh برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Magoosh چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Magoosh وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Magoosh در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Magoosh بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/magoosh',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Magoosh (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Magoosh',
        text: 'به وب‌سایت یا اپلیکیشن Magoosh مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Magoosh استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-lingq-iran',
    titleFa: 'خرید اکانت Lingq در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Lingq subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Lingq از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/education.jpg',
    coverAlt: 'خرید Lingq در پی‌کارت',
    keywords: [
      'خرید Lingq',
      'خرید اکانت Lingq',
      'اشتراک Lingq ایران',
      'اکانت Lingq ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'lingq',
    primaryCtaLabel: 'خرید اکانت Lingq',
    primaryCategorySlug: 'education',
    relatedServiceSlugs: [
      'magoosh',
      'babbel',
    ],
    sections: [
      {
        heading: 'چرا اشتراک Lingq برای یادگیری؟',
        body: [
          'Lingq از پلتفرم‌های آموزشی پرکاربرد است که زبان‌آموزی، آموزش مهارت‌های شغلی، آماده‌سازی آزمون‌های بین‌المللی و دروس آکادمیک را پوشش می‌دهد. کاربران ایرانی به دلیل عدم پذیرش پرداخت ریالی نمی‌توانند مستقیماً از سایت اصلی خرید کنند؛ پی‌کارت اکانت رسمی را با تحویل آنی به شما تحویل می‌دهد.',
          'تجربه کاربران نشان داده در صورت پرداخت با کارت غیرمجاز یا IP ایرانی، Lingq اکانت را بسته و بازگشت وجه ندارد. خرید از پی‌کارت این ریسک را حذف می‌کند: اکانت‌ها روی پرداخت قانونی و آدرس بین‌المللی فعال شده‌اند.',
        ],
      },
      {
        heading: 'پلن‌های Lingq در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Lingq عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Premium ماهانه برای دسترسی کامل به محتوا',
          'پلن سه/شش‌ماهه با تخفیف',
          'پلن سالانه — مقرون‌به‌صرفه برای دانشجو و یادگیرنده مداوم',
          'پلن گواهی‌نامه — مخصوص دوره‌های دارای Certificate رسمی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Lingq',
          path: '/s/lingq',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Lingq با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Lingq در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کاربران ایرانی، گواهینامه‌های دیجیتال صادره از این پلتفرم‌ها در LinkedIn و Resume قابل استفاده‌اند و توسط کارفرمایان بین‌المللی به‌رسمیت شناخته می‌شوند.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Lingq',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «آموزش» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های آموزش',
          path: '/c/education',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Lingq خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Lingq در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Lingq چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Lingq به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Lingq نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Lingq برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Lingq چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Lingq وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Lingq در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Lingq بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/lingq',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Lingq (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Lingq',
        text: 'به وب‌سایت یا اپلیکیشن Lingq مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Lingq استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-icloud-iran',
    titleFa: 'خرید اکانت Icloud در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Icloud subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Icloud از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/cloud-storage.jpg',
    coverAlt: 'خرید Icloud در پی‌کارت',
    keywords: [
      'خرید Icloud',
      'خرید اکانت Icloud',
      'اشتراک Icloud ایران',
      'اکانت Icloud ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'icloud',
    primaryCtaLabel: 'خرید اکانت Icloud',
    primaryCategorySlug: 'cloud-storage',
    relatedServiceSlugs: [
      'adobe-firefly',
    ],
    sections: [
      {
        heading: 'چرا فضای ابری Icloud؟',
        body: [
          'Icloud یکی از سرویس‌های فضای ذخیره‌سازی ابری مطرح است. سرعت همگام‌سازی، امنیت داده، اشتراک‌گذاری حرفه‌ای و رمزنگاری end-to-end از مزایای استفاده از این پلتفرم‌هاست. پی‌کارت اکانت ارتقایافته را با تحویل آنی و پلن‌های متنوع ارائه می‌کند.',
          'پرداخت مستقیم به این سرویس‌ها از ایران ممکن نیست و در صورت تشخیص IP غیرمجاز، اکانت محدود می‌شود. خرید از پی‌کارت این مشکل را برطرف می‌کند.',
        ],
      },
      {
        heading: 'پلن‌های فضای ابری Icloud',
        body: [
          'پی‌کارت چندین پلن مختلف از Icloud عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن ۵۰GB / 200GB / 1TB / 2TB بسته به نیاز',
          'پلن سالانه با تخفیف نسبت به ماهانه',
          'پلن خانوادگی برای اشتراک با اعضای خانواده',
          'پلن کسب‌وکار با مدیریت کاربران',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Icloud',
          path: '/s/icloud',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Icloud با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Icloud در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای آپلود فایل‌های حجیم با اینترنت داخلی، توصیه می‌شود از زمان‌های کم‌ترافیک شب استفاده کنید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Icloud',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «فضای ابری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های فضای ابری',
          path: '/c/cloud-storage',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Icloud خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Icloud در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Icloud چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Icloud به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Icloud نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Icloud برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Icloud چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Icloud وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Icloud در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Icloud بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/icloud',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Icloud (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Icloud',
        text: 'به وب‌سایت یا اپلیکیشن Icloud مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Icloud استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-proton-iran',
    titleFa: 'خرید اکانت Proton در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Proton subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Proton از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/developer-tools.jpg',
    coverAlt: 'خرید Proton در پی‌کارت',
    keywords: [
      'خرید Proton',
      'خرید اکانت Proton',
      'اشتراک Proton ایران',
      'اکانت Proton ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'proton',
    primaryCtaLabel: 'خرید اکانت Proton',
    primaryCategorySlug: 'developer-tools',
    relatedServiceSlugs: [
      'jetbrains',
    ],
    sections: [
      {
        heading: 'چرا لایسنس Proton از پی‌کارت؟',
        body: [
          'برنامه‌نویسان و توسعه‌دهندگان نیاز به ابزارهای حرفه‌ای دارند که از فارسی پشتیبانی نمی‌کنند ولی استاندارد صنعت محسوب می‌شوند. Proton یکی از این ابزارهاست که با لایسنس رسمی، آپدیت دائمی و دسترسی به افزونه‌ها همراه است. تحریم‌های آمریکا و اروپا خرید مستقیم از ایران را ناممکن کرده — راه‌حل قانونی پی‌کارت تحویل لایسنس رسمی به همراه فاکتور است.',
          'بدون پی‌کارت باید با کارت بین‌المللی پرداخت کرده و امیدوار باشید لایسنس به IP ایرانی نشت نکند. در عمل، اکانت‌های زیادی به‌دلیل تخلف از Terms مسدود می‌شوند. پی‌کارت این فرآیند را روی زیرساخت قانونی انجام می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های Proton',
        body: [
          'پی‌کارت چندین پلن مختلف از Proton عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن سه و شش‌ماهه با تخفیف',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای کارهای حرفه‌ای',
          'پلن تیمی برای استودیو و شرکت‌ها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Proton',
          path: '/s/proton',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Proton با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Proton در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای فعال‌سازی، یک IDE یا اپلیکیشن دسکتاپ نیاز به ورود با ایمیل و کلید لایسنس دارد؛ راهنمای کامل در صفحه محصول قرار داده شده است.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Proton',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «برنامه نویسی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های برنامه نویسی',
          path: '/c/developer-tools',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Proton خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Proton در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Proton چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Proton به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Proton نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Proton برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Proton چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Proton وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Proton در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Proton بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/proton',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Proton (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Proton',
        text: 'به وب‌سایت یا اپلیکیشن Proton مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Proton استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-adobe-firefly-iran',
    titleFa: 'خرید اکانت Adobe Firefly در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Adobe Firefly subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Adobe Firefly از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/cloud-storage.jpg',
    coverAlt: 'خرید Adobe Firefly در پی‌کارت',
    keywords: [
      'خرید Adobe Firefly',
      'خرید اکانت Adobe Firefly',
      'اشتراک Adobe Firefly ایران',
      'اکانت Adobe Firefly ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'adobe-firefly',
    primaryCtaLabel: 'خرید اکانت Adobe Firefly',
    primaryCategorySlug: 'cloud-storage',
    relatedServiceSlugs: [
      'ideogram',
      'leonardo',
    ],
    sections: [
      {
        heading: 'چرا فضای ابری Adobe Firefly؟',
        body: [
          'Adobe Firefly یکی از سرویس‌های فضای ذخیره‌سازی ابری مطرح است. سرعت همگام‌سازی، امنیت داده، اشتراک‌گذاری حرفه‌ای و رمزنگاری end-to-end از مزایای استفاده از این پلتفرم‌هاست. پی‌کارت اکانت ارتقایافته را با تحویل آنی و پلن‌های متنوع ارائه می‌کند.',
          'پرداخت مستقیم به این سرویس‌ها از ایران ممکن نیست و در صورت تشخیص IP غیرمجاز، اکانت محدود می‌شود. خرید از پی‌کارت این مشکل را برطرف می‌کند.',
        ],
      },
      {
        heading: 'پلن‌های فضای ابری Adobe Firefly',
        body: [
          'پی‌کارت چندین پلن مختلف از Adobe Firefly عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن ۵۰GB / 200GB / 1TB / 2TB بسته به نیاز',
          'پلن سالانه با تخفیف نسبت به ماهانه',
          'پلن خانوادگی برای اشتراک با اعضای خانواده',
          'پلن کسب‌وکار با مدیریت کاربران',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Adobe Firefly',
          path: '/s/adobe-firefly',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Adobe Firefly با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Adobe Firefly در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای آپلود فایل‌های حجیم با اینترنت داخلی، توصیه می‌شود از زمان‌های کم‌ترافیک شب استفاده کنید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Adobe Firefly',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «فضای ابری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های فضای ابری',
          path: '/c/cloud-storage',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Adobe Firefly خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Adobe Firefly در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Adobe Firefly چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Adobe Firefly به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Adobe Firefly نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Adobe Firefly برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Adobe Firefly چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Adobe Firefly وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Adobe Firefly در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Adobe Firefly بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/adobe-firefly',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Adobe Firefly (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Adobe Firefly',
        text: 'به وب‌سایت یا اپلیکیشن Adobe Firefly مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Adobe Firefly استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-babbel-iran',
    titleFa: 'خرید اکانت Babbel در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Babbel subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Babbel از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Babbel در پی‌کارت',
    keywords: [
      'خرید Babbel',
      'خرید اکانت Babbel',
      'اشتراک Babbel ایران',
      'اکانت Babbel ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'babbel',
    primaryCtaLabel: 'خرید اکانت Babbel',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'lingq',
      'rosetta-stone',
    ],
    sections: [
      {
        heading: 'چرا Babbel برای بهره‌وری و کار؟',
        body: [
          'Babbel از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Babbel',
        body: [
          'پی‌کارت چندین پلن مختلف از Babbel عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Babbel',
          path: '/s/babbel',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Babbel با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Babbel در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Babbel',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Babbel خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Babbel در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Babbel چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Babbel به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Babbel نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Babbel برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Babbel چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Babbel وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Babbel در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Babbel بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/babbel',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Babbel (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Babbel',
        text: 'به وب‌سایت یا اپلیکیشن Babbel مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Babbel استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-shutterstock-iran',
    titleFa: 'خرید اکانت Shutterstock در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Shutterstock subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Shutterstock از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Shutterstock در پی‌کارت',
    keywords: [
      'خرید Shutterstock',
      'خرید اکانت Shutterstock',
      'اشتراک Shutterstock ایران',
      'اکانت Shutterstock ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'shutterstock',
    primaryCtaLabel: 'خرید اکانت Shutterstock',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'adobe-firefly',
    ],
    sections: [
      {
        heading: 'چرا Shutterstock برای بهره‌وری و کار؟',
        body: [
          'Shutterstock از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Shutterstock',
        body: [
          'پی‌کارت چندین پلن مختلف از Shutterstock عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Shutterstock',
          path: '/s/shutterstock',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Shutterstock با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Shutterstock در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Shutterstock',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Shutterstock خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Shutterstock در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Shutterstock چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Shutterstock به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Shutterstock نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Shutterstock برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Shutterstock چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Shutterstock وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Shutterstock در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Shutterstock بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/shutterstock',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Shutterstock (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Shutterstock',
        text: 'به وب‌سایت یا اپلیکیشن Shutterstock مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Shutterstock استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-flexclip-iran',
    titleFa: 'خرید اکانت Flexclip در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Flexclip subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Flexclip از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/business-marketing.jpg',
    coverAlt: 'خرید Flexclip در پی‌کارت',
    keywords: [
      'خرید Flexclip',
      'خرید اکانت Flexclip',
      'اشتراک Flexclip ایران',
      'اکانت Flexclip ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'flexclip',
    primaryCtaLabel: 'خرید اکانت Flexclip',
    primaryCategorySlug: 'business-marketing',
    relatedServiceSlugs: [
      'hitpaw',
      'pika',
    ],
    sections: [
      {
        heading: 'چرا Flexclip برای کسب‌وکار و بازاریابی؟',
        body: [
          'Flexclip ابزار حرفه‌ای حوزه بازاریابی، تبلیغات و رشد کسب‌وکار است. تیم‌های فروش، آژانس‌های دیجیتال مارکتینگ و کسب‌وکارهای ایرانی برای دسترسی به ابزارهای روز و رقابت با بازار جهانی، نیازمند این پلتفرم‌اند. پی‌کارت پلن‌ها را با پرداخت تومانی و تحویل آنی ارائه می‌دهد.',
          'بدون پی‌کارت، خرید نسخه Premium از ایران تقریباً غیرممکن است: نه پرداخت ریالی پذیرفته می‌شود، نه IP ایرانی. خرید پی‌کارت یعنی اکانت روی زیرساخت قانونی و گارانتی اصالت.',
        ],
      },
      {
        heading: 'پلن‌های Flexclip',
        body: [
          'پی‌کارت چندین پلن مختلف از Flexclip عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن استاندارد یک‌ماهه و سه‌ماهه',
          'پلن Pro / Business با ابزارهای پیشرفته‌تر',
          'پلن سالانه با تخفیف نسبت به ماهانه',
          'پلن Agency / Enterprise برای آژانس‌ها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Flexclip',
          path: '/s/flexclip',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Flexclip با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Flexclip در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'بسیاری از این پلتفرم‌ها API هم دارند — اگر تیم توسعه‌دهنده دارید، می‌توانید با اتوماسیون داده‌ها سود بیشتری ببرید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Flexclip',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کسب و کار و بازاریابی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کسب و کار و بازاریابی',
          path: '/c/business-marketing',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Flexclip خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Flexclip در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Flexclip چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Flexclip به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Flexclip نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Flexclip برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Flexclip چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Flexclip وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Flexclip در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Flexclip بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/flexclip',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Flexclip (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Flexclip',
        text: 'به وب‌سایت یا اپلیکیشن Flexclip مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Flexclip استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-hitpaw-iran',
    titleFa: 'خرید اکانت Hitpaw در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Hitpaw subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Hitpaw از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Hitpaw در پی‌کارت',
    keywords: [
      'خرید Hitpaw',
      'خرید اکانت Hitpaw',
      'اشتراک Hitpaw ایران',
      'اکانت Hitpaw ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'hitpaw',
    primaryCtaLabel: 'خرید اکانت Hitpaw',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'flexclip',
      'dr-fone',
    ],
    sections: [
      {
        heading: 'چرا Hitpaw برای بهره‌وری و کار؟',
        body: [
          'Hitpaw از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Hitpaw',
        body: [
          'پی‌کارت چندین پلن مختلف از Hitpaw عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Hitpaw',
          path: '/s/hitpaw',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Hitpaw با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Hitpaw در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Hitpaw',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Hitpaw خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Hitpaw در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Hitpaw چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Hitpaw به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Hitpaw نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Hitpaw برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Hitpaw چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Hitpaw وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Hitpaw در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Hitpaw بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/hitpaw',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Hitpaw (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Hitpaw',
        text: 'به وب‌سایت یا اپلیکیشن Hitpaw مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Hitpaw استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-dreamina-iran',
    titleFa: 'خرید اکانت Dreamina در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Dreamina subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Dreamina از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-image.jpg',
    coverAlt: 'خرید Dreamina در پی‌کارت',
    keywords: [
      'خرید Dreamina',
      'خرید اکانت Dreamina',
      'اشتراک Dreamina ایران',
      'اکانت Dreamina ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'dreamina',
    primaryCtaLabel: 'خرید اکانت Dreamina',
    primaryCategorySlug: 'ai-image',
    relatedServiceSlugs: [
      'ideogram',
      'leonardo',
    ],
    sections: [
      {
        heading: 'چرا Dreamina برای تولید تصویر هوش مصنوعی؟',
        body: [
          'سرویس‌های هوش مصنوعی تولید تصویر در سال‌های اخیر کیفیت و دقتی فراتر از انتظار پیدا کرده‌اند. Dreamina یکی از پلتفرم‌های شناخته‌شده در این حوزه است که قابلیت‌هایی مانند تولید تصویر از متن، ویرایش تصویر، طراحی پوستر و کاراکتر، آپ‌اسکیل و رفع نویز را با مدل‌های قدرتمند ارائه می‌کند. برای کاربران ایرانی که نیاز به ابزار حرفه‌ای دیزاین، تبلیغات یا تولید محتوای بصری دارند، Dreamina یک گزینه مقرون‌به‌صرفه و قانونی محسوب می‌شود.',
          'به دلیل تحریم‌ها، اکثر این سرویس‌ها کارت بانکی ایرانی را نمی‌پذیرند و نیاز به شماره بین‌المللی، روش پرداخت ارزی و پروکسی دارند. پی‌کارت همه این فرآیند را به‌صورت رسمی انجام می‌دهد و اکانت آماده‌به‌کار را با تحویل آنی و قیمت تومانی به شما تحویل می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های Dreamina و قیمت‌گذاری در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Dreamina عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و کارهای تک‌پروژه‌ای',
          'پلن سه‌ماهه با تخفیف نسبت به خرید جداگانه',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای دیزاینرها و تیم‌های محتوا',
          'پلن اختصاصی و اشتراکی — مناسب کسب‌وکارها و فریلنسرها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Dreamina',
          path: '/s/dreamina',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Dreamina با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Dreamina در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'مدل‌های فعلی Dreamina از فرمان فارسی هم پشتیبانی می‌کنند، اما برای دقت بهتر توصیه می‌شود فرمان‌ها (prompt) را به انگلیسی یا فارسی‌انگلیسی همراه با کلیدواژه‌های فنی بنویسید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Dreamina',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید تصویر» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید تصویر',
          path: '/c/ai-image',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Dreamina خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Dreamina در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Dreamina چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Dreamina به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Dreamina نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Dreamina برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Dreamina چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Dreamina وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Dreamina در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Dreamina بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/dreamina',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Dreamina (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Dreamina',
        text: 'به وب‌سایت یا اپلیکیشن Dreamina مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Dreamina استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-pika-iran',
    titleFa: 'خرید اکانت Pika در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Pika subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Pika از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-video.jpg',
    coverAlt: 'خرید Pika در پی‌کارت',
    keywords: [
      'خرید Pika',
      'خرید اکانت Pika',
      'اشتراک Pika ایران',
      'اکانت Pika ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'pika',
    primaryCtaLabel: 'خرید اکانت Pika',
    primaryCategorySlug: 'ai-video',
    relatedServiceSlugs: [
      'flexclip',
      'autoshorts-ai',
    ],
    sections: [
      {
        heading: 'چرا Pika برای تولید ویدیو هوش مصنوعی؟',
        body: [
          'Pika از معدود ابزارهایی است که تولید ویدیو از متن یا تصویر را با کیفیتی نزدیک به استودیو ممکن می‌کند. برای تولیدکنندگان محتوا، ادمین‌های شبکه‌های اجتماعی، مارکترها و هر کسی که دنبال خروجی ویدیویی سریع است، Pika حذف زمان رندر و ساده‌سازی کل فرآیند را در پی دارد.',
          'دسترسی به این پلتفرم از ایران بدون پی‌کارت بسیار دشوار است: نه IP ایرانی پذیرفته می‌شود، نه کارت شتاب. اکانت‌های پی‌کارت آماده‌به‌کار، با ایمیل تأییدشده و کردیت رسمی تحویل می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Pika و کردیت‌های ماهانه',
        body: [
          'پی‌کارت چندین پلن مختلف از Pika عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن استاندارد با محدودیت دقیقه/ویدیو ماهانه',
          'پلن حرفه‌ای با کیفیت بالاتر و رزولوشن ۴K',
          'پلن سالانه با تخفیف ۲۰ تا ۳۰ درصد',
          'پلن سفارشی برای استودیوها و تیم‌های پخش',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Pika',
          path: '/s/pika',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Pika با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Pika در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای پروژه‌های فارسی‌زبان، خروجی را با ابزارهای زیرنویس مثل HitPaw یا CapCut ترکیب کنید تا متن را روی ویدیو اضافه نمایید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Pika',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید ویدیو» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید ویدیو',
          path: '/c/ai-video',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Pika خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Pika در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Pika چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Pika به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Pika نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Pika برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Pika چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Pika وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Pika در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Pika بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/pika',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Pika (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Pika',
        text: 'به وب‌سایت یا اپلیکیشن Pika مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Pika استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-autoshorts-ai-iran',
    titleFa: 'خرید اکانت Autoshorts Ai در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Autoshorts Ai subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Autoshorts Ai از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-video.jpg',
    coverAlt: 'خرید Autoshorts Ai در پی‌کارت',
    keywords: [
      'خرید Autoshorts Ai',
      'خرید اکانت Autoshorts Ai',
      'اشتراک Autoshorts Ai ایران',
      'اکانت Autoshorts Ai ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'autoshorts-ai',
    primaryCtaLabel: 'خرید اکانت Autoshorts Ai',
    primaryCategorySlug: 'ai-video',
    relatedServiceSlugs: [
      'pika',
      'flexclip',
    ],
    sections: [
      {
        heading: 'چرا Autoshorts Ai برای تولید ویدیو هوش مصنوعی؟',
        body: [
          'Autoshorts Ai از معدود ابزارهایی است که تولید ویدیو از متن یا تصویر را با کیفیتی نزدیک به استودیو ممکن می‌کند. برای تولیدکنندگان محتوا، ادمین‌های شبکه‌های اجتماعی، مارکترها و هر کسی که دنبال خروجی ویدیویی سریع است، Autoshorts Ai حذف زمان رندر و ساده‌سازی کل فرآیند را در پی دارد.',
          'دسترسی به این پلتفرم از ایران بدون پی‌کارت بسیار دشوار است: نه IP ایرانی پذیرفته می‌شود، نه کارت شتاب. اکانت‌های پی‌کارت آماده‌به‌کار، با ایمیل تأییدشده و کردیت رسمی تحویل می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Autoshorts Ai و کردیت‌های ماهانه',
        body: [
          'پی‌کارت چندین پلن مختلف از Autoshorts Ai عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن استاندارد با محدودیت دقیقه/ویدیو ماهانه',
          'پلن حرفه‌ای با کیفیت بالاتر و رزولوشن ۴K',
          'پلن سالانه با تخفیف ۲۰ تا ۳۰ درصد',
          'پلن سفارشی برای استودیوها و تیم‌های پخش',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Autoshorts Ai',
          path: '/s/autoshorts-ai',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Autoshorts Ai با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Autoshorts Ai در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای پروژه‌های فارسی‌زبان، خروجی را با ابزارهای زیرنویس مثل HitPaw یا CapCut ترکیب کنید تا متن را روی ویدیو اضافه نمایید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Autoshorts Ai',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید ویدیو» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید ویدیو',
          path: '/c/ai-video',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Autoshorts Ai خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Autoshorts Ai در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Autoshorts Ai چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Autoshorts Ai به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Autoshorts Ai نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Autoshorts Ai برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Autoshorts Ai چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Autoshorts Ai وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Autoshorts Ai در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Autoshorts Ai بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/autoshorts-ai',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Autoshorts Ai (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Autoshorts Ai',
        text: 'به وب‌سایت یا اپلیکیشن Autoshorts Ai مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Autoshorts Ai استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-rephrasy-iran',
    titleFa: 'خرید اکانت Rephrasy در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Rephrasy subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Rephrasy از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/business-marketing.jpg',
    coverAlt: 'خرید Rephrasy در پی‌کارت',
    keywords: [
      'خرید Rephrasy',
      'خرید اکانت Rephrasy',
      'اشتراک Rephrasy ایران',
      'اکانت Rephrasy ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'rephrasy',
    primaryCtaLabel: 'خرید اکانت Rephrasy',
    primaryCategorySlug: 'business-marketing',
    relatedServiceSlugs: [
      'quillbot',
      'deepl',
    ],
    sections: [
      {
        heading: 'چرا Rephrasy برای کسب‌وکار و بازاریابی؟',
        body: [
          'Rephrasy ابزار حرفه‌ای حوزه بازاریابی، تبلیغات و رشد کسب‌وکار است. تیم‌های فروش، آژانس‌های دیجیتال مارکتینگ و کسب‌وکارهای ایرانی برای دسترسی به ابزارهای روز و رقابت با بازار جهانی، نیازمند این پلتفرم‌اند. پی‌کارت پلن‌ها را با پرداخت تومانی و تحویل آنی ارائه می‌دهد.',
          'بدون پی‌کارت، خرید نسخه Premium از ایران تقریباً غیرممکن است: نه پرداخت ریالی پذیرفته می‌شود، نه IP ایرانی. خرید پی‌کارت یعنی اکانت روی زیرساخت قانونی و گارانتی اصالت.',
        ],
      },
      {
        heading: 'پلن‌های Rephrasy',
        body: [
          'پی‌کارت چندین پلن مختلف از Rephrasy عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن استاندارد یک‌ماهه و سه‌ماهه',
          'پلن Pro / Business با ابزارهای پیشرفته‌تر',
          'پلن سالانه با تخفیف نسبت به ماهانه',
          'پلن Agency / Enterprise برای آژانس‌ها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Rephrasy',
          path: '/s/rephrasy',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Rephrasy با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Rephrasy در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'بسیاری از این پلتفرم‌ها API هم دارند — اگر تیم توسعه‌دهنده دارید، می‌توانید با اتوماسیون داده‌ها سود بیشتری ببرید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Rephrasy',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کسب و کار و بازاریابی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کسب و کار و بازاریابی',
          path: '/c/business-marketing',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Rephrasy خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Rephrasy در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Rephrasy چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Rephrasy به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Rephrasy نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Rephrasy برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Rephrasy چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Rephrasy وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Rephrasy در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Rephrasy بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/rephrasy',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Rephrasy (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Rephrasy',
        text: 'به وب‌سایت یا اپلیکیشن Rephrasy مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Rephrasy استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-easymusic-iran',
    titleFa: 'خرید اکانت Easymusic در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Easymusic subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Easymusic از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-voice-music.jpg',
    coverAlt: 'خرید Easymusic در پی‌کارت',
    keywords: [
      'خرید Easymusic',
      'خرید اکانت Easymusic',
      'اشتراک Easymusic ایران',
      'اکانت Easymusic ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'easymusic',
    primaryCtaLabel: 'خرید اکانت Easymusic',
    primaryCategorySlug: 'ai-voice-music',
    relatedServiceSlugs: [
      'suno',
      'elevenlabs',
    ],
    sections: [
      {
        heading: 'چرا Easymusic برای صدا و موسیقی هوش مصنوعی؟',
        body: [
          'Easymusic از قدرتمندترین ابزارهای صوتی هوش مصنوعی است که تبدیل متن به گفتار با صدای طبیعی، ساخت موسیقی، کلون صدا، حذف نویز و ترانه‌سرایی هوش مصنوعی را پوشش می‌دهد. مناسب پادکستر، خواننده، تولیدکننده محتوای ویدیویی و هر کسی که به خروجی صوتی استاندارد نیاز دارد.',
          'پرداخت به این سرویس از ایران مستلزم کارت بین‌المللی است و در صورت تشخیص IP غیرمجاز، اکانت بسته می‌شود. خرید از پی‌کارت این ریسک را حذف می‌کند: اکانت با IP ثابت، ایمیل تأییدشده و کردیت کامل تحویل می‌گردد.',
        ],
      },
      {
        heading: 'پلن‌های Easymusic در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Easymusic عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Starter / Free Trial برای تست محدود',
          'پلن Creator با کردیت بالاتر و کیفیت Premium',
          'پلن Pro / Business — مناسب استودیو و تولیدکنندگان حرفه‌ای',
          'پلن سالانه با تخفیف نسبت به ماهانه',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Easymusic',
          path: '/s/easymusic',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Easymusic با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Easymusic در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای فارسی، می‌توانید از مدل‌های Multilingual Easymusic استفاده کنید — کیفیت تلفظ فارسی به‌مراتب بهتر از سال گذشته شده.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Easymusic',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «صدا و موسیقی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های صدا و موسیقی',
          path: '/c/ai-voice-music',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Easymusic خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Easymusic در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Easymusic چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Easymusic به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Easymusic نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Easymusic برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Easymusic چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Easymusic وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Easymusic در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Easymusic بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/easymusic',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Easymusic (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Easymusic',
        text: 'به وب‌سایت یا اپلیکیشن Easymusic مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Easymusic استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-ilovesong-iran',
    titleFa: 'خرید اکانت Ilovesong در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Ilovesong subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Ilovesong از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-voice-music.jpg',
    coverAlt: 'خرید Ilovesong در پی‌کارت',
    keywords: [
      'خرید Ilovesong',
      'خرید اکانت Ilovesong',
      'اشتراک Ilovesong ایران',
      'اکانت Ilovesong ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'ilovesong',
    primaryCtaLabel: 'خرید اکانت Ilovesong',
    primaryCategorySlug: 'ai-voice-music',
    relatedServiceSlugs: [
      'suno',
      'easymusic',
    ],
    sections: [
      {
        heading: 'چرا Ilovesong برای صدا و موسیقی هوش مصنوعی؟',
        body: [
          'Ilovesong از قدرتمندترین ابزارهای صوتی هوش مصنوعی است که تبدیل متن به گفتار با صدای طبیعی، ساخت موسیقی، کلون صدا، حذف نویز و ترانه‌سرایی هوش مصنوعی را پوشش می‌دهد. مناسب پادکستر، خواننده، تولیدکننده محتوای ویدیویی و هر کسی که به خروجی صوتی استاندارد نیاز دارد.',
          'پرداخت به این سرویس از ایران مستلزم کارت بین‌المللی است و در صورت تشخیص IP غیرمجاز، اکانت بسته می‌شود. خرید از پی‌کارت این ریسک را حذف می‌کند: اکانت با IP ثابت، ایمیل تأییدشده و کردیت کامل تحویل می‌گردد.',
        ],
      },
      {
        heading: 'پلن‌های Ilovesong در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Ilovesong عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Starter / Free Trial برای تست محدود',
          'پلن Creator با کردیت بالاتر و کیفیت Premium',
          'پلن Pro / Business — مناسب استودیو و تولیدکنندگان حرفه‌ای',
          'پلن سالانه با تخفیف نسبت به ماهانه',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Ilovesong',
          path: '/s/ilovesong',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Ilovesong با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Ilovesong در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای فارسی، می‌توانید از مدل‌های Multilingual Ilovesong استفاده کنید — کیفیت تلفظ فارسی به‌مراتب بهتر از سال گذشته شده.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Ilovesong',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «صدا و موسیقی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های صدا و موسیقی',
          path: '/c/ai-voice-music',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Ilovesong خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Ilovesong در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Ilovesong چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Ilovesong به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Ilovesong نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Ilovesong برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Ilovesong چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Ilovesong وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Ilovesong در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Ilovesong بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/ilovesong',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Ilovesong (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Ilovesong',
        text: 'به وب‌سایت یا اپلیکیشن Ilovesong مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Ilovesong استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-visual-electric-iran',
    titleFa: 'خرید اکانت Visual Electric در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Visual Electric subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Visual Electric از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-image.jpg',
    coverAlt: 'خرید Visual Electric در پی‌کارت',
    keywords: [
      'خرید Visual Electric',
      'خرید اکانت Visual Electric',
      'اشتراک Visual Electric ایران',
      'اکانت Visual Electric ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'visual-electric',
    primaryCtaLabel: 'خرید اکانت Visual Electric',
    primaryCategorySlug: 'ai-image',
    relatedServiceSlugs: [
      'ideogram',
      'leonardo',
    ],
    sections: [
      {
        heading: 'چرا Visual Electric برای تولید تصویر هوش مصنوعی؟',
        body: [
          'سرویس‌های هوش مصنوعی تولید تصویر در سال‌های اخیر کیفیت و دقتی فراتر از انتظار پیدا کرده‌اند. Visual Electric یکی از پلتفرم‌های شناخته‌شده در این حوزه است که قابلیت‌هایی مانند تولید تصویر از متن، ویرایش تصویر، طراحی پوستر و کاراکتر، آپ‌اسکیل و رفع نویز را با مدل‌های قدرتمند ارائه می‌کند. برای کاربران ایرانی که نیاز به ابزار حرفه‌ای دیزاین، تبلیغات یا تولید محتوای بصری دارند، Visual Electric یک گزینه مقرون‌به‌صرفه و قانونی محسوب می‌شود.',
          'به دلیل تحریم‌ها، اکثر این سرویس‌ها کارت بانکی ایرانی را نمی‌پذیرند و نیاز به شماره بین‌المللی، روش پرداخت ارزی و پروکسی دارند. پی‌کارت همه این فرآیند را به‌صورت رسمی انجام می‌دهد و اکانت آماده‌به‌کار را با تحویل آنی و قیمت تومانی به شما تحویل می‌دهد.',
        ],
      },
      {
        heading: 'پلن‌های Visual Electric و قیمت‌گذاری در پی‌کارت',
        body: [
          'پی‌کارت چندین پلن مختلف از Visual Electric عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست و کارهای تک‌پروژه‌ای',
          'پلن سه‌ماهه با تخفیف نسبت به خرید جداگانه',
          'پلن سالانه — مقرون‌به‌صرفه‌ترین گزینه برای دیزاینرها و تیم‌های محتوا',
          'پلن اختصاصی و اشتراکی — مناسب کسب‌وکارها و فریلنسرها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Visual Electric',
          path: '/s/visual-electric',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Visual Electric با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Visual Electric در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'مدل‌های فعلی Visual Electric از فرمان فارسی هم پشتیبانی می‌کنند، اما برای دقت بهتر توصیه می‌شود فرمان‌ها (prompt) را به انگلیسی یا فارسی‌انگلیسی همراه با کلیدواژه‌های فنی بنویسید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Visual Electric',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «تولید تصویر» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های تولید تصویر',
          path: '/c/ai-image',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Visual Electric خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Visual Electric در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Visual Electric چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Visual Electric به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Visual Electric نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Visual Electric برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Visual Electric چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Visual Electric وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Visual Electric در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Visual Electric بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/visual-electric',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Visual Electric (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Visual Electric',
        text: 'به وب‌سایت یا اپلیکیشن Visual Electric مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Visual Electric استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-deepl-iran',
    titleFa: 'خرید اکانت Deepl در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Deepl subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Deepl از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-writing-seo.jpg',
    coverAlt: 'خرید Deepl در پی‌کارت',
    keywords: [
      'خرید Deepl',
      'خرید اکانت Deepl',
      'اشتراک Deepl ایران',
      'اکانت Deepl ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'deepl',
    primaryCtaLabel: 'خرید اکانت Deepl',
    primaryCategorySlug: 'ai-writing-seo',
    relatedServiceSlugs: [
      'quillbot',
      'rephrasy',
    ],
    sections: [
      {
        heading: 'چرا Deepl برای محتوا و SEO؟',
        body: [
          'Deepl ابزاری حرفه‌ای است که فرآیند تولید محتوا، بازنویسی متن، بررسی گرامر، تشخیص متن AI و بهینه‌سازی برای موتورهای جستجو را تسریع می‌کند. کارمندان دیجیتال‌مارکتینگ، نویسندگان وبلاگ و دانشجویان از این ابزار استفاده می‌کنند تا کیفیت متن انگلیسی را بدون نیاز به ویراستار حرفه‌ای بالا ببرند.',
          'دسترسی مستقیم به نسخه Premium از ایران به دلیل تحریم و محدودیت‌های پرداخت ممکن نیست. اکانت‌های پی‌کارت با پلن کامل و بدون محدودیت IP، با تحویل آنی و گارانتی به شما داده می‌شود.',
        ],
      },
      {
        heading: 'پلن‌های Deepl و قیمت تومانی',
        body: [
          'پی‌کارت چندین پلن مختلف از Deepl عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Premium ماهانه با تمام قابلیت‌های پیشرفته',
          'پلن سه‌ماهه و سالانه با تخفیف بیشتر',
          'پلن اختصاصی برای کاربرانی که نمی‌خواهند اکانت اشتراکی استفاده کنند',
          'پلن تیمی برای آژانس‌ها و تیم‌های محتوا',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Deepl',
          path: '/s/deepl',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Deepl با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Deepl در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'اگر زبان مادری شما فارسی است، Deepl را با مترجم‌های هوش مصنوعی مثل DeepL ترکیب کنید تا کیفیت خروجی نهایی صیقلی شود.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Deepl',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «نوشتار و سئو» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های نوشتار و سئو',
          path: '/c/ai-writing-seo',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Deepl خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Deepl در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Deepl چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Deepl به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Deepl نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Deepl برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Deepl چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Deepl وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Deepl در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Deepl بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/deepl',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Deepl (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Deepl',
        text: 'به وب‌سایت یا اپلیکیشن Deepl مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Deepl استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-prowritingaid-iran',
    titleFa: 'خرید اکانت Prowritingaid در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Prowritingaid subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Prowritingaid از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/ai-writing-seo.jpg',
    coverAlt: 'خرید Prowritingaid در پی‌کارت',
    keywords: [
      'خرید Prowritingaid',
      'خرید اکانت Prowritingaid',
      'اشتراک Prowritingaid ایران',
      'اکانت Prowritingaid ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'prowritingaid',
    primaryCtaLabel: 'خرید اکانت Prowritingaid',
    primaryCategorySlug: 'ai-writing-seo',
    relatedServiceSlugs: [
      'quillbot',
      'rephrasy',
    ],
    sections: [
      {
        heading: 'چرا Prowritingaid برای محتوا و SEO؟',
        body: [
          'Prowritingaid ابزاری حرفه‌ای است که فرآیند تولید محتوا، بازنویسی متن، بررسی گرامر، تشخیص متن AI و بهینه‌سازی برای موتورهای جستجو را تسریع می‌کند. کارمندان دیجیتال‌مارکتینگ، نویسندگان وبلاگ و دانشجویان از این ابزار استفاده می‌کنند تا کیفیت متن انگلیسی را بدون نیاز به ویراستار حرفه‌ای بالا ببرند.',
          'دسترسی مستقیم به نسخه Premium از ایران به دلیل تحریم و محدودیت‌های پرداخت ممکن نیست. اکانت‌های پی‌کارت با پلن کامل و بدون محدودیت IP، با تحویل آنی و گارانتی به شما داده می‌شود.',
        ],
      },
      {
        heading: 'پلن‌های Prowritingaid و قیمت تومانی',
        body: [
          'پی‌کارت چندین پلن مختلف از Prowritingaid عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن Premium ماهانه با تمام قابلیت‌های پیشرفته',
          'پلن سه‌ماهه و سالانه با تخفیف بیشتر',
          'پلن اختصاصی برای کاربرانی که نمی‌خواهند اکانت اشتراکی استفاده کنند',
          'پلن تیمی برای آژانس‌ها و تیم‌های محتوا',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Prowritingaid',
          path: '/s/prowritingaid',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Prowritingaid با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Prowritingaid در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'اگر زبان مادری شما فارسی است، Prowritingaid را با مترجم‌های هوش مصنوعی مثل DeepL ترکیب کنید تا کیفیت خروجی نهایی صیقلی شود.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Prowritingaid',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «نوشتار و سئو» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های نوشتار و سئو',
          path: '/c/ai-writing-seo',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Prowritingaid خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Prowritingaid در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Prowritingaid چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Prowritingaid به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Prowritingaid نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Prowritingaid برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Prowritingaid چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Prowritingaid وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Prowritingaid در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Prowritingaid بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/prowritingaid',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Prowritingaid (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Prowritingaid',
        text: 'به وب‌سایت یا اپلیکیشن Prowritingaid مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Prowritingaid استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-crunchyroll-iran',
    titleFa: 'خرید اکانت Crunchyroll در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Crunchyroll subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Crunchyroll از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Crunchyroll در پی‌کارت',
    keywords: [
      'خرید Crunchyroll',
      'خرید اکانت Crunchyroll',
      'اشتراک Crunchyroll ایران',
      'اکانت Crunchyroll ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'crunchyroll',
    primaryCtaLabel: 'خرید اکانت Crunchyroll',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'hbo',
    ],
    sections: [
      {
        heading: 'چرا Crunchyroll برای بهره‌وری و کار؟',
        body: [
          'Crunchyroll از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Crunchyroll',
        body: [
          'پی‌کارت چندین پلن مختلف از Crunchyroll عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Crunchyroll',
          path: '/s/crunchyroll',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Crunchyroll با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Crunchyroll در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Crunchyroll',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Crunchyroll خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Crunchyroll در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Crunchyroll چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Crunchyroll به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Crunchyroll نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Crunchyroll برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Crunchyroll چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Crunchyroll وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Crunchyroll در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Crunchyroll بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/crunchyroll',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Crunchyroll (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Crunchyroll',
        text: 'به وب‌سایت یا اپلیکیشن Crunchyroll مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Crunchyroll استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-rosetta-stone-iran',
    titleFa: 'خرید اکانت Rosetta Stone در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Rosetta Stone subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Rosetta Stone از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Rosetta Stone در پی‌کارت',
    keywords: [
      'خرید Rosetta Stone',
      'خرید اکانت Rosetta Stone',
      'اشتراک Rosetta Stone ایران',
      'اکانت Rosetta Stone ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'rosetta-stone',
    primaryCtaLabel: 'خرید اکانت Rosetta Stone',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'babbel',
      'lingq',
    ],
    sections: [
      {
        heading: 'چرا Rosetta Stone برای بهره‌وری و کار؟',
        body: [
          'Rosetta Stone از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Rosetta Stone',
        body: [
          'پی‌کارت چندین پلن مختلف از Rosetta Stone عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Rosetta Stone',
          path: '/s/rosetta-stone',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Rosetta Stone با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Rosetta Stone در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Rosetta Stone',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Rosetta Stone خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Rosetta Stone در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Rosetta Stone چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Rosetta Stone به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Rosetta Stone نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Rosetta Stone برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Rosetta Stone چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Rosetta Stone وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Rosetta Stone در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Rosetta Stone بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/rosetta-stone',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Rosetta Stone (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Rosetta Stone',
        text: 'به وب‌سایت یا اپلیکیشن Rosetta Stone مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Rosetta Stone استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-talkingavatar-iran',
    titleFa: 'خرید اکانت Talkingavatar در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Talkingavatar subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Talkingavatar از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Talkingavatar در پی‌کارت',
    keywords: [
      'خرید Talkingavatar',
      'خرید اکانت Talkingavatar',
      'اشتراک Talkingavatar ایران',
      'اکانت Talkingavatar ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'talkingavatar',
    primaryCtaLabel: 'خرید اکانت Talkingavatar',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'suno',
      'elevenlabs',
    ],
    sections: [
      {
        heading: 'چرا Talkingavatar برای بهره‌وری و کار؟',
        body: [
          'Talkingavatar از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Talkingavatar',
        body: [
          'پی‌کارت چندین پلن مختلف از Talkingavatar عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Talkingavatar',
          path: '/s/talkingavatar',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Talkingavatar با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Talkingavatar در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Talkingavatar',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Talkingavatar خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Talkingavatar در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Talkingavatar چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Talkingavatar به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Talkingavatar نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Talkingavatar برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Talkingavatar چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Talkingavatar وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Talkingavatar در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Talkingavatar بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/talkingavatar',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Talkingavatar (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Talkingavatar',
        text: 'به وب‌سایت یا اپلیکیشن Talkingavatar مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Talkingavatar استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-homestyler-iran',
    titleFa: 'خرید اکانت Homestyler در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Homestyler subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Homestyler از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/productivity-work.jpg',
    coverAlt: 'خرید Homestyler در پی‌کارت',
    keywords: [
      'خرید Homestyler',
      'خرید اکانت Homestyler',
      'اشتراک Homestyler ایران',
      'اکانت Homestyler ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'homestyler',
    primaryCtaLabel: 'خرید اکانت Homestyler',
    primaryCategorySlug: 'productivity-work',
    relatedServiceSlugs: [
      'shutterstock',
    ],
    sections: [
      {
        heading: 'چرا Homestyler برای بهره‌وری و کار؟',
        body: [
          'Homestyler از ابزارهای پرکاربرد در حوزه بهره‌وری، مدیریت کار و کسب‌وکار است. کاربران حرفه‌ای از این پلتفرم برای ساماندهی پروژه، فایل، اسناد یا اپلیکیشن‌های مدیریتی استفاده می‌کنند. پی‌کارت دسترسی به نسخه Premium را با پرداخت تومانی و تحویل آنی فراهم می‌کند.',
          'تحریم‌ها و عدم پذیرش کارت‌های ایرانی، خرید مستقیم را غیرممکن کرده. اکانت‌های پی‌کارت قانونی هستند، با ایمیل تأییدشده و گارانتی اصالت ارائه می‌شوند.',
        ],
      },
      {
        heading: 'پلن‌های Homestyler',
        body: [
          'پی‌کارت چندین پلن مختلف از Homestyler عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن یک‌ماهه برای تست',
          'پلن شش‌ماهه و سالانه با تخفیف',
          'پلن Pro / Business با قابلیت‌های پیشرفته‌تر',
          'پلن تیمی برای کاربران سازمانی',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Homestyler',
          path: '/s/homestyler',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Homestyler با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Homestyler در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'برای کسب‌وکارها، خرید پلن تیمی صرفه‌جویی قابل توجهی نسبت به اشتراک‌های جداگانه برای هر کارمند دارد.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Homestyler',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کار و بهره وری» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کار و بهره وری',
          path: '/c/productivity-work',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Homestyler خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Homestyler در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Homestyler چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Homestyler به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Homestyler نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Homestyler برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Homestyler چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Homestyler وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Homestyler در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Homestyler بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/homestyler',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Homestyler (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Homestyler',
        text: 'به وب‌سایت یا اپلیکیشن Homestyler مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Homestyler استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
  },
  {
    slug: 'buy-ajelix-iran',
    titleFa: 'خرید اکانت Ajelix در ایران ۱۴۰۴: قیمت، روش خرید و تحویل آنی',
    titleEnHint: 'Buy Ajelix subscription in Iran',
    excerpt:
      'راهنمای کامل خرید اشتراک Ajelix از ایران در پی‌کارت — قیمت پلن‌ها، روش پرداخت تومانی، تحویل آنی، فعال‌سازی و گارانتی اصالت اکانت.',
    coverImage: '/images/categories/business-marketing.jpg',
    coverAlt: 'خرید Ajelix در پی‌کارت',
    keywords: [
      'خرید Ajelix',
      'خرید اکانت Ajelix',
      'اشتراک Ajelix ایران',
      'اکانت Ajelix ارزان',
    ],
    author: DEFAULT_AUTHOR_NAME,
    authorUrl: DEFAULT_AUTHOR_URL,
    authorSameAs: defaultAuthorSameAs(),
    datePublished: PUBLISHED,
    dateModified: MODIFIED,
    primaryServiceSlug: 'ajelix',
    primaryCtaLabel: 'خرید اکانت Ajelix',
    primaryCategorySlug: 'business-marketing',
    relatedServiceSlugs: [
      'surfer-seo',
      'rephrasy',
    ],
    sections: [
      {
        heading: 'چرا Ajelix برای کسب‌وکار و بازاریابی؟',
        body: [
          'Ajelix ابزار حرفه‌ای حوزه بازاریابی، تبلیغات و رشد کسب‌وکار است. تیم‌های فروش، آژانس‌های دیجیتال مارکتینگ و کسب‌وکارهای ایرانی برای دسترسی به ابزارهای روز و رقابت با بازار جهانی، نیازمند این پلتفرم‌اند. پی‌کارت پلن‌ها را با پرداخت تومانی و تحویل آنی ارائه می‌دهد.',
          'بدون پی‌کارت، خرید نسخه Premium از ایران تقریباً غیرممکن است: نه پرداخت ریالی پذیرفته می‌شود، نه IP ایرانی. خرید پی‌کارت یعنی اکانت روی زیرساخت قانونی و گارانتی اصالت.',
        ],
      },
      {
        heading: 'پلن‌های Ajelix',
        body: [
          'پی‌کارت چندین پلن مختلف از Ajelix عرضه می‌کند که قیمت لحظه‌ای آن‌ها روی صفحه محصول به تومان نمایش داده می‌شود (قیمت‌ها وابسته به نرخ ارز و تغییر سیاست شرکت سازنده گاه‌به‌گاه به‌روز می‌گردد).',
        ],
        bullets: [
          'پلن استاندارد یک‌ماهه و سه‌ماهه',
          'پلن Pro / Business با ابزارهای پیشرفته‌تر',
          'پلن سالانه با تخفیف نسبت به ماهانه',
          'پلن Agency / Enterprise برای آژانس‌ها',
        ],
        cta: {
          label: 'مشاهده قیمت لحظه‌ای پلن‌های Ajelix',
          path: '/s/ajelix',
        },
      },
      {
        heading: 'روش پرداخت و تحویل سفارش',
        body: [
          'تمامی پرداخت‌ها در پی‌کارت از طریق درگاه‌های مجاز بانک مرکزی (شاپرک) و با کارت‌های شتابی ایرانی انجام می‌شود. پس از پرداخت موفق، اطلاعات اکانت یا کلید لایسنس به‌صورت آنی در پنل کاربری و ایمیل شما قرار می‌گیرد.',
          'پلن‌های پرفروش Ajelix با تحویل خودکار در کمتر از ۵ دقیقه ارسال می‌شوند؛ پلن‌های اختصاصی که نیازمند راه‌اندازی دستی توسط کارشناس هستند، حداکثر ظرف چند ساعت کاری فعال می‌شوند.',
        ],
      },
      {
        heading: 'گارانتی اصالت و بازگشت وجه',
        body: [
          'تمامی اکانت‌ها و پلن‌های Ajelix در پی‌کارت دارای گارانتی ۷۲ ساعته هستند: اگر در این بازه مشکلی در ورود، فعال بودن اشتراک یا کارکرد سرویس مشاهده کنید، با ثبت تیکت، اکانت جایگزین یا وجه شما به‌صورت کامل بازگشت داده می‌شود. شرایط کامل در صفحه «شرایط بازگشت وجه» توضیح داده شده است.',
          'بسیاری از این پلتفرم‌ها API هم دارند — اگر تیم توسعه‌دهنده دارید، می‌توانید با اتوماسیون داده‌ها سود بیشتری ببرید.',
        ],
      },
      {
        heading: 'سرویس‌های مرتبط با Ajelix',
        body: [
          'اگر می‌خواهید قبل از خرید، گزینه‌های مشابه را مقایسه کنید، نگاهی به کاتالوگ کامل دسته «کسب و کار و بازاریابی» در پی‌کارت بیندازید. تمام سرویس‌های این دسته با پرداخت تومانی و تحویل آنی موجود هستند.',
        ],
        cta: {
          label: 'مشاهده همه سرویس‌های کسب و کار و بازاریابی',
          path: '/c/business-marketing',
        },
      },
    ],
    faq: [
      {
        question: 'آیا اکانت Ajelix خریداری شده از پی‌کارت اصل است؟',
        answer: 'بله، تمامی اکانت‌های Ajelix در پی‌کارت اصل و قانونی هستند. اکانت‌ها از منابع رسمی بین‌المللی خریداری شده و با ایمیل و رمز معتبر در اختیار شما قرار می‌گیرند.',
      },
      {
        question: 'تحویل اکانت Ajelix چقدر زمان می‌برد؟',
        answer: 'بیشتر پلن‌های Ajelix به‌صورت تحویل خودکار در کمتر از ۵ تا ۱۵ دقیقه ارسال می‌شوند. پلن‌های اختصاصی که نیاز به فعال‌سازی دستی دارند، حداکثر چند ساعت کاری زمان می‌برند.',
      },
      {
        question: 'اگر بعد از خرید اکانت کار نکرد چه می‌شود؟',
        answer: 'تمامی اکانت‌ها در پی‌کارت ۷۲ ساعت گارانتی دارند. در صورت بروز هر مشکلی در ورود یا فعال بودن اشتراک، با ثبت تیکت اکانت جایگزین یا بازگشت کامل وجه دریافت می‌کنید.',
      },
      {
        question: 'آیا برای استفاده از Ajelix نیاز به VPN دارم؟',
        answer: 'بسته به سرویس متفاوت است. Ajelix برای کاربران ایرانی معمولاً نیاز به یک VPN معتبر دارد تا محدودیت‌های منطقه‌ای را عبور کنید. در صفحه راهنمای فعال‌سازی، کانفیگ پیشنهادی پی‌کارت معرفی شده است.',
      },
      {
        question: 'پرداخت چگونه انجام می‌شود؟',
        answer: 'پرداخت در پی‌کارت با تمامی کارت‌های شتاب از طریق درگاه شاپرک به‌صورت ریالی انجام می‌شود. نیازی به کارت بین‌المللی، ارز یا حساب پی‌پال ندارید.',
      },
      {
        question: 'تفاوت پلن اشتراکی و اختصاصی Ajelix چیست؟',
        answer: 'در پلن اشتراکی، چند کاربر روی یک اکانت Ajelix وارد می‌شوند (قیمت پایین‌تر). در پلن اختصاصی، ایمیل و رمز فقط در اختیار شماست (قیمت بالاتر اما بدون محدودیت‌های اشتراکی).',
      },
    ],
    howToSteps: [
      {
        name: 'مراجعه به صفحه اکانت Ajelix در پی‌کارت',
        text: 'در سایت پی‌کارت به آدرس صفحه اکانت Ajelix بروید و پلن مورد نظر خود را از بین پلن‌های موجود انتخاب کنید. قیمت لحظه‌ای هر پلن کنار آن نمایش داده می‌شود.',
        url: '/s/ajelix',
      },
      {
        name: 'افزودن به سبد و پرداخت تومانی',
        text: 'پس از انتخاب پلن، روی دکمه افزودن به سبد بزنید و در صفحه پرداخت، با کارت شتاب یکی از بانک‌های ایرانی، مبلغ را به‌صورت ریالی پرداخت کنید. پی‌کارت از درگاه‌های مجاز بانک مرکزی استفاده می‌کند.',
      },
      {
        name: 'دریافت اطلاعات اکانت در پنل کاربری',
        text: 'پس از پرداخت موفق، اطلاعات اکانت Ajelix (ایمیل، رمز عبور یا کلید لایسنس) به‌صورت آنی در پنل کاربری شما قرار می‌گیرد و یک نسخه نیز به ایمیلتان ارسال می‌شود.',
      },
      {
        name: 'ورود به اکانت Ajelix',
        text: 'به وب‌سایت یا اپلیکیشن Ajelix مراجعه کنید و با ایمیل و رمز ارائه‌شده وارد شوید. در صورت نیاز، یک VPN معتبر فعال کنید تا محدودیت‌های منطقه‌ای رفع شود.',
      },
      {
        name: 'استفاده از سرویس و پشتیبانی',
        text: 'حالا می‌توانید از تمام قابلیت‌های Ajelix استفاده کنید. در صورت بروز هر مشکل در طول دوره گارانتی ۷۲ ساعته، با ثبت تیکت در پنل پی‌کارت، تیم پشتیبانی به‌سرعت رسیدگی می‌کند.',
      },
    ],
    howToTotalTime: 'PT5M',
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
