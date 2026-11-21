import { getAssetPath } from "../utils/assets";
export const PRODUCTS = [
  {
    id: "tee-feroz-black",
    title: "FEROZ SAVAGE OVERSIZED TEE",
    subtitle: "Heavyweight 320 GSM Combed Portuguese Cotton",
    price: 65.00,
    color: "Pitch Black // Neon Pink Panther",
    category: "T-SHIRTS",
    sizes: ["S", "M", "L", "XL"],
    edition: "LIMITED EDITION // 150 PIECES",
    image: getAssetPath("/images/products/hero_david_feroz_black.jpg"),
    gallery: [
      getAssetPath("/images/products/hero_david_feroz_black.jpg"),
      getAssetPath("/images/products/tee_savage_black.png")
    ],
    description: "Architectural boxy silhouette cut from bespoke 320 GSM organic Portuguese cotton. Features high-density screenprint of the neon pink panther leaping through cyan arches with brutalist 'FEROZ SAVAGE' typography.",
    specs: {
      origin: "Porto, Portugal",
      weight: "320 GSM",
      composition: "100% Organic Combed Cotton",
      treatment: "Cold Pre-Shrunk Garment Wash"
    }
  },
  {
    id: "tee-diamond-pink",
    title: "DIAMOND DIET OVERSIZED TEE",
    subtitle: "Heavyweight 320 GSM Vintage Washed Cotton",
    price: 65.00,
    color: "Dusty Rose // Diamond Ruby",
    category: "T-SHIRTS",
    sizes: ["S", "M", "L", "XL"],
    edition: "LIMITED EDITION // 150 PIECES",
    image: getAssetPath("/images/products/hero_david_pink_diet.jpg"),
    gallery: [
      getAssetPath("/images/products/hero_david_pink_diet.jpg")
    ],
    description: "'Keep The Calories, I'll Take Carats' back print statement graphic with crystal diamond lips. Sculpted with dropped shoulders and reinforced twin-needle stitching for lasting architectural drape.",
    specs: {
      origin: "Porto, Portugal",
      weight: "320 GSM",
      composition: "100% Heavy Jersey Cotton",
      treatment: "Vintage Enzyme Softening"
    }
  },
  {
    id: "tee-dunk-white",
    title: "RETRO DUNK ARCHIVE TEE",
    subtitle: "Vintage Porsche & Basketball Collage",
    price: 60.00,
    color: "Optic White // Multi",
    category: "GRAPHICS",
    sizes: ["S", "M", "L", "XL"],
    edition: "FALSE STEP® CORE ARCHIVE",
    image: getAssetPath("/images/products/tee_dunk_white.png"),
    gallery: [
      getAssetPath("/images/products/tee_dunk_white.png")
    ],
    description: "Multilayered montage graphic combining classical marble statues, sky slam dunk, and vintage 911 coupe silhouette in vibrant cyan and peach neon tones over optic white jersey.",
    specs: {
      origin: "Porto, Portugal",
      weight: "300 GSM",
      composition: "100% Ringspun Cotton",
      treatment: "Silicon Garment Washed"
    }
  },
  {
    id: "tee-savage-green",
    title: "SEVAGE TIGER BOTANIC TEE",
    subtitle: "Forest Green Heavyweight Jersey",
    price: 65.00,
    color: "Forest Green // Multi",
    category: "T-SHIRTS",
    sizes: ["S", "M", "L", "XL"],
    edition: "DROP EXCLUSIVE",
    image: getAssetPath("/images/products/tee_savage_green.png"),
    gallery: [
      getAssetPath("/images/products/tee_savage_green.png")
    ],
    description: "Vibrant botanical bedroom illustration featuring the slumbering Bengal tiger and stylized 'SEVAGE' graffiti typography over a rich racing green cotton base.",
    specs: {
      origin: "Porto, Portugal",
      weight: "320 GSM",
      composition: "100% Combed Cotton",
      treatment: "Bio-Polished Anti-Pill"
    }
  },
  {
    id: "tee-savage-noir",
    title: "SEVAGE TIGER NOIR TEE",
    subtitle: "Obsidian Black Heavyweight Jersey",
    price: 65.00,
    color: "Obsidian Black // Multi",
    category: "T-SHIRTS",
    sizes: ["S", "M", "L", "XL"],
    edition: "DROP EXCLUSIVE",
    image: getAssetPath("/images/products/tee_savage_black.png"),
    gallery: [
      getAssetPath("/images/products/tee_savage_black.png")
    ],
    description: "The classic 'SEVAGE' tiger slumber artwork contrasted against deep obsidian black. Premium 1x1 rib collar that holds shape perpetually.",
    specs: {
      origin: "Porto, Portugal",
      weight: "320 GSM",
      composition: "100% Combed Cotton",
      treatment: "Carbon Peached Finish"
    }
  },
  {
    id: "tee-black-fs24",
    title: "FALSE STEP® CAPSULE FS-24",
    subtitle: "Architectural Studio Edition",
    price: 70.00,
    color: "Deep Onyx",
    category: "ARCHIVE",
    sizes: ["S", "M", "L", "XL"],
    edition: "STUDIO CAPSULE 24.0",
    image: getAssetPath("/images/products/tee_black_fs24.jpg"),
    gallery: [
      getAssetPath("/images/products/tee_black_fs24.jpg"),
      getAssetPath("/images/products/graphic_fs21_main.jpg")
    ],
    description: "Limited studio release developed in collaboration with False Step archive workshops. Custom dye bath with distressed tonal accents.",
    specs: {
      origin: "Porto, Portugal",
      weight: "340 GSM",
      composition: "100% Organic Heavy Cotton",
      treatment: "Cold Dye Washed"
    }
  }
];

export const UPSELLS = [
  {
    id: "socks-3pack",
    title: "FALSE STEP® RIBBED SOCKS (3-PACK)",
    price: 24.00,
    color: "Bone / Black / Forest",
    size: "O/S",
    image: getAssetPath("/images/products/tee_savage_green.png")
  },
  {
    id: "beanie-ribbed",
    title: "FALSE STEP® ARCHIVE BEANIE",
    price: 35.00,
    color: "Obsidian Black",
    size: "O/S",
    image: getAssetPath("/images/products/tee_savage_black.png")
  }
];

export const INITIAL_COLLECTIONS = [
  {
    id: "col_drop07",
    name: "DROP 07 // FEROZ SAVAGE CAPSULE",
    slug: "drop-07-feroz-savage",
    tagline: "Escultura clássica de mármore romano fundida com brutalismo contemporâneo.",
    cover: getAssetPath("/images/products/hero_david_feroz_black.jpg"),
    badge: "EDIÇÃO LIMITADA // 150 UNIDADES",
    status: "active",
    productIds: [
      "tee-feroz-black",
      "tee-diamond-pink",
      "tee-dunk-white"
    ]
  },
  {
    id: "col_core",
    name: "CORE ARCHIVE // HEAVYWEIGHT 320 GSM",
    slug: "core-archive",
    tagline: "Essenciais permanentes tecidos em malha pesada portuguesa no Porto.",
    cover: getAssetPath("/images/products/tee_black_fs24.jpg"),
    badge: "PRODUÇÃO CONTÍNUA",
    status: "active",
    productIds: [
      "tee-savage-green",
      "tee-savage-noir",
      "tee-black-fs24"
    ]
  }
];

export const INITIAL_COUPONS = [
  {
    id: "coup_01",
    code: "FALSTEP10",
    type: "percentage",
    value: 10,
    minSpend: 50,
    active: true
  },
  {
    id: "coup_02",
    code: "VIPDROP20",
    type: "percentage",
    value: 20,
    minSpend: 120,
    active: true
  },
  {
    id: "coup_03",
    code: "PORTOGRATIS",
    type: "fixed",
    value: 15,
    minSpend: 80,
    active: true
  }
];
