export interface CategoryGuide {
  description: string;
  guideTitle: string;
  guideIntro: string;
  tips: string[];
  budgetAdvice: string;
}

export const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  Electronics: {
    description: 'Discover the latest electronics at unbeatable prices — from smartphones and laptops to headphones and smart home devices. Our curated electronics collection features top-rated products from leading brands.',
    guideTitle: 'Electronics Buying Guide: How to Choose the Right Gadget',
    guideIntro: 'Shopping for electronics can be overwhelming with so many options. Here\u2019s what to consider before making your purchase to ensure you get the best value for your money.',
    tips: [
      'Check the processor and RAM for smartphones and laptops \u2014 these determine performance for multitasking and gaming.',
      'Battery life is crucial for portable devices. Look for at least 4000mAh for phones and 8+ hours for laptops.',
      'Display quality matters: AMOLED screens offer better colours and deeper blacks than LCD at similar price points.',
      'Compare warranty and after-sales service. Brands with local service centres save you hassle later.',
      'Read recent buyer reviews focusing on long-term usage \u2014 not just unboxing impressions.',
    ],
    budgetAdvice: 'For budget-conscious buyers, last year\u2019s flagship models often offer better value than this year\u2019s mid-range options. Look for discounts during Amazon sale events for the steepest price drops.',
  },
  Headphones: {
    description: 'Find the perfect pair of headphones or earphones for music, calls, gaming, and workouts. Our collection covers wireless earbuds, over-ear headphones, and neckbands across all price ranges.',
    guideTitle: 'Headphones Buying Guide: Wired vs Wireless, ANC and More',
    guideIntro: 'Choosing the right headphones depends on how and where you plan to use them. Here\u2019s a breakdown of the key factors to consider.',
    tips: [
      'Active Noise Cancellation (ANC) is worth the premium if you commute or work in noisy environments.',
      'Battery life varies widely: true wireless earbuds average 4-8 hours per charge, while over-ears can last 30+ hours.',
      'Sound signature matters \u2014 some prefer bass-heavy tuning (great for workouts), others prefer balanced sound for podcasts and calls.',
      'Check the codec support: AAC and aptX deliver better audio quality than standard SBC on compatible devices.',
      'Comfort is key for long sessions. Over-ear headphones with plush padding are better than on-ear designs for extended wear.',
    ],
    budgetAdvice: 'You don\u2019t need to spend a fortune for decent wireless earbuds. Many options under \u20b93,000 now offer good battery life, IPX4 water resistance, and acceptable sound quality.',
  },
  Smartphones: {
    description: 'Browse our handpicked selection of smartphones with the best value \u2014 from budget 5G phones to flagship cameras and gaming devices. We compare prices, specs, and real-world performance.',
    guideTitle: 'Smartphone Buying Guide: Find Your Perfect Phone',
    guideIntro: 'With new phones launching every month, choosing the right smartphone can feel impossible. Focus on what actually matters for your daily use.',
    tips: [
      'Processor determines longevity. A Snapdragon 7-series or MediaTek Dimensity chip will stay smooth for 3+ years.',
      'RAM and storage: 6GB RAM is the minimum for smooth multitasking in 2025. Opt for 128GB storage minimum.',
      'Camera specs are misleading \u2014 megapixel count matters less than sensor size and software processing. Check sample photos.',
      'Display refresh rate: 90Hz or 120Hz makes scrolling and animations noticeably smoother than standard 60Hz.',
      'Software update policy matters. Brands like Samsung and Google promise 4-7 years of updates; others offer only 2.',
    ],
    budgetAdvice: 'The sweet spot for value in India is currently \u20b915,000\u2013\u20b925,000. Phones in this range offer 5G, AMOLED displays, and capable cameras \u2014 features that cost double just two years ago.',
  },
  'Smart Home': {
    description: 'Transform your home with smart devices \u2014 from voice assistants and security cameras to smart bulbs, plugs, and appliances. Shop the best smart home deals on Amazon.in.',
    guideTitle: 'Smart Home Buying Guide: Build Your Connected Home',
    guideIntro: 'Building a smart home doesn\u2019t have to be expensive or complicated. Start small and expand as you go. Here\u2019s what to know before you buy.',
    tips: [
      'Ecosystem matters: stick with Alexa or Google Home to avoid juggling multiple apps for different devices.',
      'Start with smart plugs \u2014 they\u2019re the cheapest way to make any appliance smart and controllable from your phone.',
      'Security cameras: look for 1080p resolution minimum, night vision, and cloud or SD card storage options.',
      'Smart bulbs save money long-term with LED efficiency. Choose Wi-Fi bulbs to avoid needing a separate hub.',
      'Check compatibility before buying. Most Indian smart home devices work on 2.4GHz Wi-Fi \u2014 ensure your router supports it.',
    ],
    budgetAdvice: 'Start with a smart speaker (\u20b93,000\u2013\u20b95,000) as your hub, then add one or two smart plugs (\u20b9600 each). This gives you voice control of existing appliances for under \u20b95,000 total.',
  },
  'Home & Kitchen': {
    description: 'Upgrade your home and kitchen with top-rated appliances, cookware, storage solutions, and decor. Our curated selection features products that combine quality with great value.',
    guideTitle: 'Home & Kitchen Buying Guide: Smart Shopping for Your Home',
    guideIntro: 'Whether you\u2019re setting up a new home or upgrading your kitchen, choosing the right appliances and cookware can save you money and frustration in the long run.',
    tips: [
      'For mixers and grinders, look for stainless steel jars and a copper motor for durability and performance.',
      'Induction cooktops are more energy-efficient than gas, but require compatible cookware with a flat magnetic base.',
      'Water purifiers: choose RO+UV if your water source is municipal; UF is sufficient for already-filtered water.',
      'Storage containers: opt for borosilicate glass for microwave-safe reheating, or BPA-free plastic for dry storage.',
      'Air fryers are versatile \u2014 they roast, grill, and reheat besides frying. Basket size matters: 4L+ for families.',
    ],
    budgetAdvice: 'Prioritise appliances you use daily (mixer grinder, induction stove) over occasional-use items. Invest in good cookware first \u2014 a solid kadai and tawa cost \u20b91,000\u2013\u20b92,000 and last years.',
  },
  'Fashion & Beauty': {
    description: 'Stay stylish with curated fashion and beauty deals \u2014 from clothing and accessories to skincare, makeup, and grooming essentials. Quality products at prices you\u2019ll love.',
    guideTitle: 'Fashion & Beauty Buying Guide: Look Great, Spend Smart',
    guideIntro: 'Shopping for fashion and beauty online can be tricky with sizing and quality concerns. Here\u2019s how to make the right choices every time.',
    tips: [
      'Check the size chart carefully \u2014 Indian brands may size differently from international ones. Measure yourself before ordering.',
      'Fabric composition matters: natural fibres (cotton, linen) are more breathable; synthetics (polyester, nylon) offer stretch and durability.',
      'For skincare, check the ingredient list rather than marketing claims. Look for SPF in moisturisers and retinol in anti-aging products.',
      'Read reviews mentioning skin type (oily, dry, combination) to find products that match your needs.',
      'Perfume: opt for Eau de Parfum (EDP) over Eau de Toilette (EDT) for longer-lasting fragrance.',
    ],
    budgetAdvice: 'Build a capsule wardrobe with versatile basics (white shirts, dark jeans, neutral tops) before buying trend pieces. In skincare, a simple routine (cleanser, moisturiser, sunscreen) beats a cabinet full of products.',
  },
  'Gaming': {
    description: 'Level up your gaming setup with the best deals on consoles, accessories, gaming laptops, and peripherals. Curated for Indian gamers looking for value and performance.',
    guideTitle: 'Gaming Buying Guide: Console, PC, or Accessories?',
    guideIntro: 'Whether you\u2019re a casual mobile gamer or a dedicated PC enthusiast, choosing the right gaming gear makes all the difference. Here\u2019s how to decide.',
    tips: [
      'For PC gaming, the graphics card (GPU) is the most important component. It determines which games you can run and at what settings.',
      'Console gaming (PlayStation, Xbox, Nintendo Switch) offers simpler setup and exclusive titles but higher game costs.',
      'Gaming mice: look for optical sensors (not laser) and adjustable DPI. Wireless gaming mice now match wired latency.',
      'Mechanical keyboards last longer and feel better than membrane ones. Cherry MX and Gateron switches are the gold standard.',
      'A good gaming headset with a dedicated mic is better than using earbuds \u2014 directional audio helps in competitive games.',
    ],
    budgetAdvice: 'A gaming laptop in the \u20b960,000\u2013\u20b980,000 range with an RTX 3050/4050 GPU can handle most modern titles at medium settings. For console gaming, the Xbox Series S is the most affordable entry point at around \u20b935,000.',
  },
  'Books': {
    description: 'Discover great reads at great prices. Our book collection covers fiction, non-fiction, self-help, and children\u2019s books \u2014 curated for every type of reader.',
    guideTitle: 'Book Buying Guide: Find Your Next Great Read',
    guideIntro: 'With millions of books available, finding something worth reading can be challenging. Here\u2019s how to pick books you\u2019ll actually enjoy.',
    tips: [
      'Read sample chapters before buying \u2014 Amazon\u2019s \u201cLook Inside\u201d feature lets you preview the writing style and pacing.',
      'Check the publication date for non-fiction. Outdated books on technology, science, or current events may contain inaccurate information.',
      'Paperback vs hardcover: paperbacks are lighter and cheaper; hardcovers are more durable and make better gifts.',
      'Consider Kindle editions for instant delivery and adjustable font sizes. Many classics are free on Kindle.',
      'Follow award shortlists (Booker, Pulitzer, JCB Prize) for reliably high-quality recommendations across genres.',
    ],
    budgetAdvice: 'Buying used books from sellers on Amazon can save 50\u201370%. Kindle editions are often cheaper than paperbacks and don\u2019t require shelf space.',
  },
};

export const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '<path d="M9 3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V3Zm0 1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V4Zm2 0h2V3h-2v1Z"/><rect x="9" y="10" width="6" height="6" rx="1"/>',
  Headphones: '<path d="M4 14a8 8 0 0 1 16 0v2a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1.8A6 6 0 0 0 5.2 13H7a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Z"/><circle cx="6.5" cy="13.5" r="1.5"/><circle cx="17.5" cy="13.5" r="1.5"/>',
  Smartphones: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  'Smart Home': '<path d="M3 10.5L12 3l9 7.5"/><path d="M5 10v8a2 2 0 0 0 2 2h3v-6h4v6h3a2 2 0 0 0 2-2v-8"/><circle cx="12" cy="15" r="1"/>',
  'Home & Kitchen': '<path d="M4 5h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V5Z"/><path d="M8 3h8v2H8V3Z"/><path d="M12 11v10"/><path d="M8 21h8"/>',
  'Fashion & Beauty': '<path d="M7 4.5a4 4 0 0 1 4 0l1 .5 1-.5a4 4 0 0 1 4 0v.5A4 4 0 0 1 17 8H7a4 4 0 0 1 0-3.5Z"/><path d="M12 8v4"/><path d="M8 18a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4H8v-4Z"/>',
  Gaming: '<path d="M6 12H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2"/><path d="M6 12v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/>',
  Books: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6.5a1.5 1.5 0 0 0 0 3H19"/><path d="M4 19.5V6"/>',
};

export const GENERAL_BUYING_TIPS = [
  'Always compare prices across sellers. The same product on Amazon.in may have different prices from different sellers.',
  'Check the seller rating and return policy before purchasing \u2014 especially for electronics and high-value items.',
  'Subscribe to our Telegram channel for instant alerts on the best deals and flash sales.',
  'Use our affiliate links to support us at no extra cost. You get the same Amazon price, and we earn a small commission that helps us keep finding great deals.',
  'Read product reviews focusing on long-term usage. Five-star ratings on day one are less reliable than reviews written after months of use.',
];