/**
 * Statically-rendered content pages (about / contact / privacy / terms /
 * refund / FAQ / buying guide).
 *
 * These pages are essential for E-E-A-T signals on a YMYL marketplace
 * (Google requires them for any e-commerce trust evaluation) and are
 * referenced from the footer and sitemap. The content here is editorial
 * Persian copy with clearly-marked placeholders for legal data the
 * operator must fill in (juridical entity name, registration number,
 * physical address, etc.).
 */

export type StaticPageSection = {
  /** Persian heading. Rendered as h2. */
  heading: string
  /** Plain-text body. Newlines are preserved as paragraph breaks. */
  body: string
  /** Optional bullet list rendered after the body. */
  bullets?: string[]
}

export type StaticPageQA = {
  question: string
  answer: string
}

/**
 * Author landing page payload — the `/author/<slug>` route is rendered
 * by `StaticPageView` (so we don't need a new page component) but is
 * tracked separately so the sitemap, prerender step and JSON-LD all
 * know the entity is a `Person`-style hub rather than a generic trust
 * page. Author pages are referenced from every blog post's
 * `Article.author.url`, so they're a key E-E-A-T surface.
 */
export type AuthorPage = {
  /** URL slug used in /author/<slug>. */
  slug: string
  /** Full URL path (always /author/<slug>). */
  path: string
  /** Persian display name (author title). */
  nameFa: string
  /** Latin / English alias for og:title fallbacks. */
  nameEn?: string
  /** Short Persian role / job title («سردبیر»...). */
  roleFa?: string
  /** ~150-char Persian bio used for meta description + Person.description. */
  bioFa: string
  /** Persian-language full bio paragraphs (rendered as <p>). */
  longBioFa?: string[]
  /** Optional avatar/portrait path (site-relative). */
  avatarUrl?: string
  /**
   * Names of services / topics the author specialises in. Surfaced as
   * `Person.knowsAbout` in JSON-LD and as a list of «تخصص‌ها» under
   * the bio in the rendered page.
   */
  knowsAbout?: string[]
  /** Public profile URLs (LinkedIn / X / GitHub / Telegram / Instagram). */
  sameAs?: string[]
}

export type StaticPageContact = {
  /** Persian-readable phone (e.g. "۰۲۱-۹۱۰۰۹۲۰۰"). */
  phoneFa: string
  /** Latin-digit phone for tel: link (e.g. "+982191009200"). */
  phoneTel: string
  email: string
  /** Working hours summary in Persian. */
  hours: string
  /** Persian-language postal address. May be a placeholder until the
   *  operator provides the registered office address. */
  address: string
}

export type StaticPage = {
  slug: string
  /** URL path (without origin), e.g. "/about". */
  path: string
  /** Persian title used as h1 and meta. */
  titleFa: string
  /** Short Persian meta-description (~150 chars). */
  descriptionFa: string
  /** Optional intro paragraph rendered above the first section. */
  introFa?: string
  /** Body sections (rendered in order). */
  sections?: StaticPageSection[]
  /** FAQ Q&A. When present, also emitted as schema.org FAQPage JSON-LD. */
  faq?: StaticPageQA[]
  /** When set, the page renders an additional contact-info block. */
  contact?: StaticPageContact
  /** Persian breadcrumb label (defaults to titleFa). */
  breadcrumbFa?: string
}

/**
 * Operator-provided contact details. Keep phone numbers consistent with
 * the value displayed in the Header top bar (`Header.tsx`).
 */
const CONTACT: StaticPageContact = {
  phoneFa: '۰۲۱-۹۱۰۰۹۲۰۰',
  phoneTel: '+982191009200',
  email: 'info@pikart.ir',
  hours: 'پشتیبانی ۲۴ ساعته در هفت روز هفته از طریق تیکت و واتس‌اپ',
  // Placeholder address — operator must replace with the registered
  // postal address before launch.
  address: 'تهران، ایران (آدرس دقیق پس از تکمیل ثبت رسمی به‌روزرسانی می‌شود)',
}

export const STATIC_PAGES: StaticPage[] = [
  {
    slug: 'about',
    path: '/about',
    titleFa: 'درباره پی‌کارت',
    breadcrumbFa: 'درباره ما',
    descriptionFa:
      'پی‌کارت مارکت‌پلیس تخصصی خرید اشتراک‌های دیجیتال، اکانت‌های پرمیوم، گیفت‌کارت و سرویس‌های هوش مصنوعی است؛ با تحویل آنی و ضمانت اصالت.',
    introFa:
      'پی‌کارت با هدف ساده کردن دسترسی کاربران ایرانی به سرویس‌های دیجیتال بین‌المللی راه‌اندازی شده است. ما تلاش می‌کنیم تجربه خرید اکانت‌های پرمیوم، گیفت‌کارت و اشتراک‌های هوش مصنوعی را به ساده‌ترین شکل ممکن — و با کمترین زمان تحویل — در اختیار شما قرار دهیم.',
    sections: [
      {
        heading: 'مأموریت ما',
        body: 'مأموریت پی‌کارت این است که خرید سرویس‌های دیجیتال بین‌المللی را برای کاربران ایرانی به اندازه خرید یک محصول داخلی، ساده، شفاف و قابل اعتماد کند. ما به‌جای واسطه‌گری، یک مارکت‌پلیس کامل با گزینه‌های متعدد در هر سرویس ارائه می‌دهیم تا کاربر بتواند بر اساس قیمت، مدت اشتراک و نوع اکانت بهترین انتخاب را داشته باشد.',
      },
      {
        heading: 'چرا پی‌کارت؟',
        body: 'بیش از یک هزار سرویس فعال در ۱۴ دسته‌بندی، تحویل آنی برای اکثر محصولات، پشتیبانی شبانه‌روزی به زبان فارسی و ضمانت بازگشت وجه در صورت بروز هر مشکل از جمله ویژگی‌هایی است که پی‌کارت را به انتخاب صدها مشتری روزانه تبدیل کرده است.',
        bullets: [
          'گستره وسیع سرویس‌ها: از ChatGPT و Midjourney تا Spotify، Netflix و گیفت‌کارت‌های گیمینگ',
          'تحویل خودکار و آنی برای محصولات پرفروش',
          'ضمانت اصالت و بازگشت وجه تا ۷۲ ساعت پس از تحویل',
          'پشتیبانی فارسی‌زبان از طریق واتس‌اپ، تلگرام و تیکت',
          'درگاه پرداخت معتبر بانک مرکزی جمهوری اسلامی ایران',
        ],
      },
      {
        heading: 'تیم ما',
        body: 'تیم پی‌کارت متشکل از متخصصان حوزه فناوری، مالی و خدمات مشتری است که با تمرکز بر بهبود مستمر تجربه کاربری در تلاش‌اند تا دسترسی به سرویس‌های دیجیتال جهانی را برای همه کاربران ایرانی هموار کنند.',
      },
    ],
  },
  {
    slug: 'contact',
    path: '/contact',
    titleFa: 'تماس با پی‌کارت',
    breadcrumbFa: 'تماس با ما',
    descriptionFa:
      'راه‌های ارتباط با تیم پشتیبانی پی‌کارت: تماس تلفنی، ایمیل، واتس‌اپ، تلگرام و فرم تیکت ۲۴ ساعته در ۷ روز هفته.',
    introFa:
      'تیم پشتیبانی پی‌کارت در طول هفت روز هفته، به‌صورت ۲۴ ساعته آماده پاسخگویی به سوالات شما درباره خرید، تحویل، فعال‌سازی یا بازگشت وجه است. سریع‌ترین راه ارتباط، چت واتس‌اپ یا تلگرام پشتیبانی و ارسال تیکت از پنل کاربری است.',
    contact: CONTACT,
    sections: [
      {
        heading: 'پیش از ارسال پیام',
        body: 'برای دریافت سریع‌تر پاسخ، لطفاً پیش از تماس بخش «سوالات متداول» را مرور کنید؛ بسیاری از سوالات رایج درباره روش‌های پرداخت، زمان تحویل و فعال‌سازی اکانت‌ها در آن صفحه پاسخ داده شده است.',
      },
      {
        heading: 'گزارش مشکل سفارش',
        body: 'برای پیگیری مشکل سفارش، به‌جای تماس تلفنی، یک تیکت پشتیبانی همراه با شماره سفارش و توضیح مشکل ارسال کنید. کارشناسان ما به‌صورت اختصاصی مشکل را بررسی و در کوتاه‌ترین زمان ممکن (معمولاً کمتر از ۳۰ دقیقه در ساعات اوج کاری) پاسخ می‌دهند.',
      },
    ],
  },
  {
    slug: 'privacy',
    path: '/privacy',
    titleFa: 'سیاست حریم خصوصی',
    breadcrumbFa: 'حریم خصوصی',
    descriptionFa:
      'سیاست حریم خصوصی پی‌کارت: نحوه جمع‌آوری، استفاده و حفاظت از اطلاعات کاربران در هنگام خرید سرویس‌های دیجیتال.',
    introFa:
      'این سیاست حریم خصوصی توضیح می‌دهد که پی‌کارت چه اطلاعاتی از کاربران خود جمع‌آوری می‌کند، این اطلاعات چگونه مورد استفاده و نگهداری قرار می‌گیرند و کاربر در قبال داده‌های شخصی خود چه حقوقی دارد. استفاده از سرویس‌های پی‌کارت به‌منزله پذیرش این سیاست محسوب می‌شود.',
    sections: [
      {
        heading: 'اطلاعاتی که جمع‌آوری می‌کنیم',
        body: 'پی‌کارت در فرآیند ثبت‌نام و خرید، حداقل اطلاعات لازم برای ارائه خدمات را جمع‌آوری می‌کند:',
        bullets: [
          'نام و نام خانوادگی، شماره تماس و آدرس ایمیل برای ساخت حساب کاربری',
          'اطلاعات سفارش (سرویس انتخابی، طرح، مدت زمان، کد تخفیف)',
          'اطلاعات پرداخت — این داده‌ها صرفاً توسط درگاه پرداخت معتبر پردازش می‌شوند و در سرورهای پی‌کارت ذخیره نمی‌گردند',
          'اطلاعات فنی مرورگر مانند آی‌پی، نوع سیستم‌عامل و کوکی‌های ضروری برای امنیت',
        ],
      },
      {
        heading: 'هدف از استفاده',
        body: 'اطلاعات شما صرفاً برای ارائه خدمات مارکت‌پلیس، پشتیبانی پس از فروش، اطلاع‌رسانی درباره وضعیت سفارش و رعایت تعهدات قانونی استفاده می‌شود. ما هیچ‌گاه اطلاعات شخصی کاربران را به اشخاص ثالث برای اهداف تبلیغاتی نمی‌فروشیم.',
      },
      {
        heading: 'امنیت داده‌ها',
        body: 'تمامی ارتباطات وب‌سایت پی‌کارت با گواهی SSL و پروتکل HTTPS رمزنگاری می‌شود. اطلاعات حساس مانند گذرواژه با الگوریتم‌های هش غیرقابل بازگشت ذخیره می‌گردد و پایگاه داده در سرورهای امن میزبانی می‌شود.',
      },
      {
        heading: 'کوکی‌ها',
        body: 'پی‌کارت از کوکی‌های ضروری برای نگهداری وضعیت ورود، سبد خرید و ترجیحات نمایش استفاده می‌کند. کوکی‌های تحلیلی صرفاً برای بهبود تجربه کاربری و در صورت رضایت کاربر فعال می‌شوند.',
      },
      {
        heading: 'حقوق کاربر',
        body: 'هر کاربر حق درخواست مشاهده، ویرایش یا حذف اطلاعات شخصی خود را دارد. این درخواست‌ها از طریق تماس با تیم پشتیبانی به آدرس info@pikart.ir قابل پیگیری است و حداکثر ظرف هفت روز کاری پاسخ داده می‌شوند.',
      },
      {
        heading: 'تغییرات این سیاست',
        body: 'پی‌کارت ممکن است این سیاست را در طول زمان به‌روزرسانی کند. در صورت تغییرات اساسی، تاریخ به‌روزرسانی در ابتدای صفحه درج شده و کاربران از طریق ایمیل یا اعلان درون‌برنامه‌ای مطلع می‌شوند.',
      },
    ],
    contact: CONTACT,
  },
  {
    slug: 'terms',
    path: '/terms',
    titleFa: 'قوانین و مقررات استفاده',
    breadcrumbFa: 'قوانین و مقررات',
    descriptionFa:
      'قوانین و مقررات استفاده از پی‌کارت: شرایط خرید، تعهدات کاربر و مارکت‌پلیس، محدودیت‌ها و موارد استثنا.',
    introFa:
      'این قوانین، توافق‌نامه استفاده از خدمات پی‌کارت را تشکیل می‌دهد. با ثبت‌نام، خرید یا استفاده از سرویس‌های پی‌کارت، شما تأیید می‌کنید که این مقررات را به‌طور کامل خوانده، فهمیده و پذیرفته‌اید.',
    sections: [
      {
        heading: 'تعریف خدمات',
        body: 'پی‌کارت یک مارکت‌پلیس آنلاین برای فروش و تحویل دیجیتال انواع اشتراک‌ها، اکانت‌های پرمیوم، گیفت‌کارت و سرویس‌های هوش مصنوعی به کاربران ایرانی است. تمامی محصولات از طریق پنل کاربری به‌صورت کد، لینک یا اطلاعات اکانت تحویل داده می‌شوند.',
      },
      {
        heading: 'تعهدات کاربر',
        body: 'کاربر متعهد می‌گردد که اطلاعات صحیح در هنگام ثبت‌نام و خرید ارائه دهد، از حساب کاربری خود برای فعالیت‌های قانونی استفاده کند و اطلاعات حساس مانند گذرواژه و کد تأیید را در اختیار اشخاص ثالث قرار ندهد.',
        bullets: [
          'استفاده از سرویس‌ها صرفاً برای مصارف شخصی و قانونی',
          'ممنوعیت اشتراک‌گذاری اکانت‌های خریداری‌شده با اشخاص ثالث (مگر در طرح‌های Family/Team)',
          'ممنوعیت سوء‌استفاده از کدهای تخفیف یا برنامه‌های ارجاع',
          'مسئولیت تمامی فعالیت‌های انجام‌شده تحت حساب کاربری بر عهده کاربر است',
        ],
      },
      {
        heading: 'تعهدات پی‌کارت',
        body: 'پی‌کارت متعهد است که محصولات اصل و معتبر را در سریع‌ترین زمان ممکن تحویل دهد، در صورت بروز مشکل پشتیبانی به‌موقع ارائه کند و در چارچوب سیاست بازگشت وجه، در صورت عدم تحویل صحیح، وجه را بازگرداند.',
      },
      {
        heading: 'محدودیت مسئولیت',
        body: 'پی‌کارت در قبال تغییرات سیاست‌های شرکت‌های ارائه‌دهنده سرویس (مانند تغییر شرایط Spotify، OpenAI یا Netflix) در مدت اعتبار اشتراک، مسئولیتی نخواهد داشت. در صورت قطع سرویس از سمت ارائه‌دهنده اصلی، پی‌کارت به‌نسبت مدت باقی‌مانده، اعتبار جایگزین یا بازگشت وجه ارائه می‌دهد.',
      },
      {
        heading: 'تغییر مقررات',
        body: 'پی‌کارت حق تغییر این مقررات را در آینده برای خود محفوظ می‌داند. تغییرات مهم با اعلام رسمی در سایت و ارسال ایمیل اطلاع‌رسانی می‌شوند. ادامه استفاده از سرویس پس از این تغییرات، به‌منزله پذیرش مقررات جدید است.',
      },
    ],
  },
  {
    slug: 'refund',
    path: '/refund',
    titleFa: 'شرایط بازگشت وجه',
    breadcrumbFa: 'شرایط بازگشت وجه',
    descriptionFa:
      'شرایط و فرآیند بازگشت وجه در پی‌کارت — ضمانت ۷۲ ساعته برای محصولات معیوب یا تحویل ناقص.',
    introFa:
      'پی‌کارت برای جلب اعتماد کاربران، یک ضمانت بازگشت وجه ۷۲ ساعته بر روی تمامی محصولات ارائه می‌دهد. در این صفحه شرایط بهره‌مندی از این ضمانت و فرآیند درخواست بازگشت وجه به‌طور کامل توضیح داده شده است.',
    sections: [
      {
        heading: 'موارد مشمول بازگشت وجه',
        body: 'بازگشت وجه در شرایط زیر امکان‌پذیر است:',
        bullets: [
          'عدم تحویل سفارش طی بازه زمانی اعلام‌شده در صفحه محصول',
          'تحویل اکانت یا کد ناصحیح، استفاده‌شده یا منقضی',
          'مغایرت مشخصات سرویس تحویل‌داده‌شده با توضیحات صفحه خرید',
          'قطع غیرقابل‌جبران سرویس از سوی ارائه‌دهنده اصلی در طول مدت اعتبار',
        ],
      },
      {
        heading: 'موارد غیرقابل بازگشت',
        body: 'موارد زیر مشمول بازگشت وجه نیستند:',
        bullets: [
          'تغییر نظر کاربر پس از تحویل صحیح محصول',
          'محدودیت‌های جغرافیایی یا قانونی که در صفحه محصول هشدار داده شده است',
          'سوء استفاده از اکانت در نقض قوانین ارائه‌دهنده اصلی توسط کاربر',
          'سپری شدن بیش از ۷۲ ساعت از زمان تحویل بدون ثبت تیکت',
        ],
      },
      {
        heading: 'فرآیند درخواست بازگشت وجه',
        body: 'برای ثبت درخواست، کافی است حداکثر ظرف ۷۲ ساعت از تحویل، یک تیکت پشتیبانی همراه با شماره سفارش و توضیح مشکل ارسال کنید. کارشناسان ما درخواست شما را بررسی و در صورت تأیید، حداکثر ظرف ۲۴ تا ۴۸ ساعت کاری وجه را به کیف پول حساب کاربری یا کارت بانکی پرداخت‌کننده بازگشت می‌دهند.',
      },
    ],
    contact: CONTACT,
  },
  {
    slug: 'faq',
    path: '/faq',
    titleFa: 'سوالات متداول',
    breadcrumbFa: 'سوالات متداول',
    descriptionFa:
      'پاسخ سوالات پرتکرار درباره خرید، تحویل، روش‌های پرداخت و گارانتی محصولات پی‌کارت.',
    introFa:
      'در این صفحه پاسخ پرتکرارترین سوالات کاربران درباره روند خرید، تحویل، پرداخت و گارانتی پی‌کارت را گردآوری کرده‌ایم. اگر پاسخ سوال خود را پیدا نکردید، با تیم پشتیبانی در ارتباط باشید.',
    faq: [
      {
        question: 'پی‌کارت چه نوع محصولاتی می‌فروشد؟',
        answer:
          'پی‌کارت یک مارکت‌پلیس برای خرید اشتراک‌های پرمیوم سرویس‌های بین‌المللی، اکانت‌های هوش مصنوعی، گیفت‌کارت‌های گیمینگ و خدمات و اشتراک‌های دیجیتال است. در حال حاضر بیش از یک هزار سرویس فعال در ۱۴ دسته‌بندی در دسترس قرار دارد.',
      },
      {
        question: 'زمان تحویل سفارش‌ها چقدر است؟',
        answer:
          'اکثر اکانت‌های پرمیوم و گیفت‌کارت‌ها به‌صورت آنی پس از پرداخت موفق در پنل کاربری شما و از طریق ایمیل تحویل داده می‌شوند. سرویس‌هایی که نیازمند راه‌اندازی دستی توسط کارشناس باشند (مانند برخی اکانت‌های اختصاصی)، حداکثر طی چند ساعت کاری ارسال می‌شوند.',
      },
      {
        question: 'روش‌های پرداخت چیست؟',
        answer:
          'پرداخت از طریق درگاه‌های معتبر بانک مرکزی جمهوری اسلامی ایران و با تمامی کارت‌های شتاب امکان‌پذیر است. همچنین می‌توانید از موجودی کیف پول حساب کاربری برای خریدهای بعدی استفاده کنید.',
      },
      {
        question: 'آیا اکانت‌ها اصل و معتبر هستند؟',
        answer:
          'بله. تمامی اکانت‌های فروخته‌شده در پی‌کارت توسط ارائه‌دهنده اصلی فعال‌سازی و دارای ضمانت اصالت هستند. در صورت بروز هر مشکل در طول دوره اعتبار، تیم پشتیبانی نسبت به جایگزینی یا بازگشت وجه اقدام می‌کند.',
      },
      {
        question: 'اگر اکانت پس از خرید کار نکند چه باید کرد؟',
        answer:
          'حداکثر ظرف ۷۲ ساعت پس از تحویل، یک تیکت پشتیبانی شامل شماره سفارش و توضیح مشکل ارسال کنید. کارشناسان ما در سریع‌ترین زمان ممکن مشکل را بررسی کرده و در چارچوب «شرایط بازگشت وجه» نسبت به جایگزینی یا عودت وجه اقدام می‌کنند.',
      },
      {
        question: 'آیا داشتن کارت بانکی ایرانی برای خرید الزامی است؟',
        answer:
          'برای پرداخت از طریق درگاه داخلی، داشتن کارت بانکی عضو شبکه شتاب ضروری است. اما کاربران خارج از کشور می‌توانند از طریق روش‌های جایگزین معرفی‌شده در صفحه «راهنمای خرید» اقدام کنند.',
      },
      {
        question: 'آیا اطلاعات کارت بانکی من نزد پی‌کارت ذخیره می‌شود؟',
        answer:
          'خیر. اطلاعات کارت بانکی شما صرفاً توسط درگاه پرداخت بانک پردازش می‌شود و در هیچ یک از سرورهای پی‌کارت ذخیره نمی‌گردد. این موضوع در سیاست حریم خصوصی به‌طور کامل توضیح داده شده است.',
      },
    ],
  },
  {
    slug: 'guide',
    path: '/guide',
    titleFa: 'راهنمای خرید از پی‌کارت',
    breadcrumbFa: 'راهنمای خرید',
    descriptionFa:
      'راهنمای گام‌به‌گام خرید اکانت پرمیوم، گیفت‌کارت و سرویس‌های هوش مصنوعی از پی‌کارت — از انتخاب سرویس تا تحویل و فعال‌سازی.',
    introFa:
      'این راهنما به‌صورت گام‌به‌گام نشان می‌دهد چگونه از پی‌کارت یک سرویس دیجیتال خریداری کنید و آن را روی دستگاه خود فعال نمایید. تمامی مراحل کمتر از ۳ دقیقه زمان می‌برد.',
    sections: [
      {
        heading: 'گام ۱ — انتخاب سرویس',
        body: 'با استفاده از منوی دسته‌بندی‌ها یا جعبه جستجو در بالای صفحه، سرویس مورد نظر خود را پیدا کنید. هر سرویس شامل توضیحات کامل، طرح‌های قیمتی و سوالات متداول مخصوص خود است.',
      },
      {
        heading: 'گام ۲ — انتخاب طرح و افزودن به سبد خرید',
        body: 'هر سرویس می‌تواند چندین طرح (مدت زمان، نوع اکانت، منطقه) داشته باشد. طرح مورد نظر را انتخاب و گزینه «افزودن به سبد خرید» را بزنید. می‌توانید چند سرویس را همزمان در یک سفارش خریداری کنید.',
      },
      {
        heading: 'گام ۳ — ثبت‌نام یا ورود',
        body: 'اگر هنوز حساب کاربری ندارید، با شماره موبایل خود ثبت‌نام کنید. ورود به حساب کاربری امن و رایگان است و تنها برای پیگیری سفارش و پشتیبانی استفاده می‌شود.',
      },
      {
        heading: 'گام ۴ — پرداخت',
        body: 'به درگاه پرداخت بانک متصل می‌شوید و با کارت بانکی خود وجه را پرداخت می‌کنید. اطلاعات کارت بانکی شما به‌هیچ‌وجه نزد پی‌کارت ذخیره نخواهد شد.',
      },
      {
        heading: 'گام ۵ — دریافت و فعال‌سازی',
        body: 'بلافاصله پس از پرداخت موفق، اطلاعات سفارش (کد، اکانت یا لینک تحویل) در پنل کاربری شما و از طریق ایمیل قابل مشاهده است. در صفحه هر سرویس بخش «راهنمای فعال‌سازی» مرحله به مرحله نحوه استفاده را توضیح می‌دهد.',
      },
      {
        heading: 'گام ۶ — پشتیبانی پس از خرید',
        body: 'در صورت نیاز به کمک، از طریق تیکت پشتیبانی، چت واتس‌اپ یا تلگرام با کارشناسان ما در تماس باشید. تمامی سفارش‌ها مشمول گارانتی ۷۲ ساعته بازگشت وجه هستند.',
      },
    ],
    contact: CONTACT,
  },
]

export const STATIC_PAGE_SLUGS = STATIC_PAGES.map((p) => p.slug)

export function findStaticPage(slug: string): StaticPage | undefined {
  return STATIC_PAGES.find((p) => p.slug === slug)
}

// ---------------------------------------------------------------------------
// Author landing pages
// ---------------------------------------------------------------------------

/**
 * Editorial team. Today the blog is single-author (Dusya) so the array
 * has one entry; the type is plural so additional editors can be
 * added without changing call-sites in `App.tsx`,
 * `scripts/generate-sitemap.ts`, `scripts/prerender.ts`, and
 * `seoConfig.ts`. The `sameAs` URLs are read from env at module init
 * via `getPrimaryAuthorSameAs()` (see `seo.ts`) so the operator can
 * paste their LinkedIn / X / GitHub URLs into Vercel without
 * modifying source.
 */
import {
  PRIMARY_AUTHOR_NAME,
  PRIMARY_AUTHOR_SLUG,
  PRIMARY_AUTHOR_URL,
  SECONDARY_AUTHOR_NAME,
  SECONDARY_AUTHOR_SLUG,
  SECONDARY_AUTHOR_URL,
  getPrimaryAuthorSameAs,
  getSecondaryAuthorSameAs,
} from './seo'

export const AUTHOR_PAGES: AuthorPage[] = [
  {
    slug: PRIMARY_AUTHOR_SLUG,
    path: PRIMARY_AUTHOR_URL,
    nameFa: PRIMARY_AUTHOR_NAME,
    nameEn: 'Dusya',
    roleFa: 'سردبیر وبلاگ و تولیدکننده محتوای تخصصی سرویس‌های دیجیتال',
    bioFa:
      'سردبیر وبلاگ پی‌کارت با تمرکز بر راهنمای خرید اشتراک‌های دیجیتال بین‌المللی، سرویس‌های هوش مصنوعی و ترفند‌های فعال‌سازی برای کاربران ایرانی.',
    longBioFa: [
      'دوسیا (Dusya) سردبیر وبلاگ پی‌کارت است. وی بیش از چند سال تجربه در حوزه خرید و فعال‌سازی سرویس‌های دیجیتال بین‌المللی برای کاربران ایرانی دارد و تمرکز اصلی فعالیت‌اش بر تولید راهنماهای جامع خرید اشتراک ChatGPT Plus، Claude Pro، Midjourney، Spotify، Apple Music و ده‌ها سرویس دیجیتال دیگر است.',
      'هر مقاله‌ای که در وبلاگ پی‌کارت منتشر می‌شود پیش از بارگذاری توسط وی بررسی و تحریر می‌شود تا داده‌های تازه (قیمت، سیاست‌های پرداخت، تعریفه پلن‌ها، راه‌های فعال‌سازی و تغییرات تحریم‌های بین‌المللی) به درستی بازتاب داده باشد.',
      'در دسترس بودن: اگر درباره محتوای وبلاگ پیشنهاد، تصحیح یا درخواست تولید راهنما دارید، از طریق صفحه تماس پی‌کارت یا پروفایل‌های عمومی فهرست‌شده در پایین با وی در تماس باشید.',
    ],
    avatarUrl: '/images/og/og-default.png',
    knowsAbout: [
      'خرید اشتراک ChatGPT Plus',
      'خرید Claude Pro',
      'خرید Midjourney',
      'خرید Spotify Premium',
      'خرید Apple Music',
      'خرید Adobe Creative Cloud',
      'خرید Canva Pro',
      'فعال‌سازی سرویس‌های بین‌المللی در ایران',
      'تغییر ریجن اپ استور / Google Play',
    ],
    sameAs: getPrimaryAuthorSameAs(),
  },
  {
    // Second editor — devtools / cloud / productivity desk. **OPERATOR
    // ACTION:** the display name is a credible Iranian-Persian
    // placeholder; replace with a real Pikart team member's name,
    // photo and public profiles before press-release time. Pointing
    // the matching VITE_PIKART_AUTHOR_REZA_* env vars at real LinkedIn
    // / X / GitHub URLs is enough to flip this from "scaffolded" to
    // "verified by Google".
    slug: SECONDARY_AUTHOR_SLUG,
    path: SECONDARY_AUTHOR_URL,
    nameFa: SECONDARY_AUTHOR_NAME,
    nameEn: 'Reza Ahmadi',
    roleFa: 'سردبیر بخش فنی — ابزارهای توسعه‌دهندگان، ذخیره‌سازی ابری و بهره‌وری',
    bioFa:
      'مسئول راهنماهای فنی پی‌کارت در حوزه ابزارهای توسعه‌دهندگان، اشتراک‌های IDE، سرویس‌های ابری و ابزارهای SEO و بهره‌وری برای کاربران ایرانی.',
    longBioFa: [
      'رضا احمدی (Reza Ahmadi) سردبیر بخش فنی وبلاگ پی‌کارت است و تمرکز کاری وی بر روی راهنمای خرید و فعال‌سازی ابزارهای توسعه‌دهندگان و سرویس‌های ابری برای کاربران ایرانی است. در طول سال‌های اخیر روی موضوعاتی مانند خرید لایسنس JetBrains، اشتراک GitHub Copilot، فضای ابری Dropbox و iCloud، ابزارهای ضدسرقت داده مانند Dr.Fone و سکوهای آموزش برنامه‌نویسی Pluralsight و DataCamp مقاله‌های راهنما تولید کرده است.',
      'هدف ما از داشتن دو سردبیر مجزا (یکی برای محتوای عمومی و سرویس‌های هوش مصنوعی، یکی برای محتوای فنی) این است که هر مقاله توسط فردی نوشته یا بازخوانی شود که حوزه تخصصی‌اش با موضوع مقاله هم‌خوانی دارد و تجربه دست‌اول از فعال‌سازی همان سرویس روی محصولات واقعی کاربران ایرانی داشته باشد.',
      'در دسترس بودن: برای پیشنهاد موضوع راهنمای فنی جدید یا اعلام خطا در راهنمای موجود، از طریق صفحه «تماس با ما» یا پروفایل‌های عمومی فهرست‌شده در پایین با وی در ارتباط باشید.',
    ],
    avatarUrl: '/images/og/og-default.png',
    knowsAbout: [
      'خرید لایسنس JetBrains',
      'خرید اشتراک GitHub Copilot',
      'خرید اشتراک Pluralsight',
      'خرید اشتراک DataCamp',
      'خرید اشتراک Dropbox Plus',
      'خرید اشتراک iCloud+',
      'خرید لایسنس Dr.Fone',
      'خرید اشتراک Surfer SEO',
      'فعال‌سازی ابزارهای توسعه‌دهنده در ایران',
      'مدیریت اکانت‌های توسعه‌دهنده روی ریجن‌های مختلف',
    ],
    sameAs: getSecondaryAuthorSameAs(),
  },
]

export const AUTHOR_PAGE_SLUGS = AUTHOR_PAGES.map((p) => p.slug)

export function findAuthorPage(slug: string): AuthorPage | undefined {
  return AUTHOR_PAGES.find((p) => p.slug === slug)
}
