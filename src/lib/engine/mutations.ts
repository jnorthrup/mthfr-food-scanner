import type {
  MutationDefinition,
  MutationContraindication,
  UserMutation,
  ProductIngredient,
} from "@/types";

export const KNOWN_MUTATIONS: MutationDefinition[] = [
  {
    id: "mthfr_c677t",
    name: "MTHFR C677T",
    gene: "MTHFR",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~40%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "heterozygous", impact: "reduced", frequency: "~40%" },
      { variant: "T/T", shorthand: "homozygous", genotype: "homozygous", impact: "reduced", frequency: "~20%" },
    ],
    description: "Affects folate metabolism and methylation. T/T variant reduces enzyme efficiency by 30-70%.",
    category: "methylation",
  },
  {
    id: "mthfr_a1298c",
    name: "MTHFR A1298C",
    gene: "MTHFR",
    commonVariants: [
      { variant: "A/A", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "A/C", shorthand: "heterozygous", genotype: "heterozygous", impact: "reduced", frequency: "~30%" },
      { variant: "C/C", shorthand: "homozygous", genotype: "homozygous", impact: "reduced", frequency: "~10%" },
    ],
    description: "Affects folate processing. Less severe than C677T but can impact methylation.",
    category: "methylation",
  },
  {
    id: "cbs_c699t",
    name: "CBS C699T",
    gene: "CBS",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "G/T", shorthand: "heterozygous", genotype: "heterozygous", impact: "increased", frequency: "~25%" },
      { variant: "T/T", shorthand: "homozygous", genotype: "homozygous", impact: "increased", frequency: "~5%" },
    ],
    description: "Increases homocysteine conversion to cysteine. May need less sulfur-containing foods.",
    category: "methylation",
  },
  {
    id: "cbs_a360v",
    name: "CBS A360V",
    gene: "CBS",
    commonVariants: [
      { variant: "A/A", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "A/G", shorthand: "heterozygous", genotype: "heterozygous", impact: "increased", frequency: "~18%" },
      { variant: "G/G", shorthand: "homozygous", genotype: "homozygous", impact: "increased", frequency: "~2%" },
    ],
    description: "Affects sulfur metabolism. May increase sulfur sensitivity.",
    category: "methylation",
  },
  {
    id: "comt_val158met",
    name: "COMT Val158Met",
    gene: "COMT",
    commonVariants: [
      { variant: "G/G", shorthand: "Val/Val", genotype: "high", impact: "increased", frequency: "~25%" },
      { variant: "A/G", shorthand: "Val/Met", genotype: "intermediate", impact: "normal", frequency: "~50%" },
      { variant: "A/A", shorthand: "Met/Met", genotype: "low", impact: "reduced", frequency: "~25%" },
    ],
    description: "Affects dopamine breakdown. Met/Met may be sensitive to catechins and caffeine.",
    category: "detoxification",
  },
  {
    id: "vdr_foki",
    name: "VDR FokI",
    gene: "VDR",
    commonVariants: [
      { variant: "C/C", shorthand: "f/f", genotype: "normal", impact: "normal", frequency: "~35%" },
      { variant: "C/T", shorthand: "F/f", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "T/T", shorthand: "F/F", genotype: "efficient", impact: "increased", frequency: "~20%" },
    ],
    description: "Vitamin D receptor efficiency. Affects calcium and vitamin D needs.",
    category: "nutrient_absorption",
  },
  {
    id: "vdr_bsmi",
    name: "VDR BsmI",
    gene: "VDR",
    commonVariants: [
      { variant: "A/A", shorthand: "bb", genotype: "normal", impact: "normal", frequency: "~40%" },
      { variant: "A/G", shorthand: "Bb", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "G/G", shorthand: "BB", genotype: "reduced", impact: "reduced", frequency: "~15%" },
    ],
    description: "Vitamin D receptor variant affecting calcium metabolism.",
    category: "nutrient_absorption",
  },
  {
    id: "lct_13910",
    name: "LCT -13910 C>T",
    gene: "LCT",
    commonVariants: [
      { variant: "C/C", shorthand: "non-persistent", genotype: "reduced", impact: "reduced", frequency: "~70%" },
      { variant: "C/T", shorthand: "intermediate", genotype: "intermediate", impact: "normal", frequency: "~20%" },
      { variant: "T/T", shorthand: "persistent", genotype: "normal", impact: "normal", frequency: "~10%" },
    ],
    description: "Lactase persistence. T/T can digest lactose throughout life.",
    category: "nutrient_absorption",
  },
  {
    id: "fut2_w154x",
    name: "FUT2 W154X",
    gene: "FUT2",
    commonVariants: [
      { variant: "G/G", shorthand: "Secretor", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "G/A", shorthand: "Non-secretor", genotype: "heterozygous", impact: "reduced", frequency: "~40%" },
      { variant: "A/A", shorthand: "Non-secretor", genotype: "non-secretor", impact: "absent", frequency: "~10%" },
    ],
    description: "Secretor status affects B12 absorption and gut microbiome. Non-secretors may need more B12.",
    category: "nutrient_absorption",
  },
  {
    id: "pemt_1742",
    name: "PEMT -1742 G>A",
    gene: "PEMT",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "G/A", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~30%" },
      { variant: "A/A", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Affects choline synthesis. A/A may need more choline from diet (eggs, meat).",
    category: "nutrient_absorption",
  },
  {
    id: "g6pd",
    name: "G6PD Deficiency",
    gene: "G6PD",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Deficient", shorthand: "deficient", genotype: "deficient", impact: "absent", frequency: "~10%" },
    ],
    description: "Enzyme deficiency affecting red blood cells. Avoid fava beans and certain food colorings.",
    category: "enzyme_function",
  },
  {
    id: "maoa",
    name: "MAOA Variants",
    gene: "MAOA",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Low", shorthand: "low", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Affects tyramine metabolism. Low activity may need to limit aged cheeses and cured meats.",
    category: "detoxification",
  },
  {
    id: "hla_dq2",
    name: "HLA-DQ2",
    gene: "HLA-DQA1/DQB1",
    commonVariants: [
      { variant: "Negative", shorthand: "negative", genotype: "negative", impact: "normal", frequency: "~60%" },
      { variant: "Positive", shorthand: "positive", genotype: "positive", impact: "increased", frequency: "~40%" },
    ],
    description: "Celiac predisposition. Positive may indicate gluten sensitivity.",
    category: "immune",
  },
  {
    id: "nat2",
    name: "NAT2 Slow Acetylator",
    gene: "NAT2",
    commonVariants: [
      { variant: "Fast", shorthand: "fast", genotype: "fast", impact: "normal", frequency: "~50%" },
      { variant: "Slow", shorthand: "slow", genotype: "slow", impact: "reduced", frequency: "~50%" },
    ],
    description: "Slow acetylators may be more sensitive to caffeine and aromatic amines.",
    category: "detoxification",
  },
  {
    id: "cyp1a2",
    name: "CYP1A2 Caffeine Metabolism",
    gene: "CYP1A2",
    commonVariants: [
      { variant: "Fast", shorthand: "fast", genotype: "fast", impact: "normal", frequency: "~50%" },
      { variant: "Slow", shorthand: "slow", genotype: "slow", impact: "reduced", frequency: "~50%" },
    ],
    description: "Slow caffeine metabolizers may need to limit coffee/caffeine intake.",
    category: "detoxification",
  },
  {
    id: "mtr_a2756g",
    name: "MTR A2756G",
    gene: "MTR",
    commonVariants: [
      { variant: "A/A", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "A/G", shorthand: "heterozygous", genotype: "heterozygous", impact: "increased", frequency: "~30%" },
      { variant: "G/G", shorthand: "variant", genotype: "variant", impact: "increased", frequency: "~10%" },
    ],
    description: "Methionine synthase. G variant may increase homocysteine conversion activity. May need more B12.",
    category: "methylation",
  },
  {
    id: "mtrr_a66g",
    name: "MTRR A66G",
    gene: "MTRR",
    commonVariants: [
      { variant: "A/A", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "A/G", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~40%" },
      { variant: "G/G", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Methionine synthase reductase. G variant reduces B12 recycling. May need methylcobalamin.",
    category: "methylation",
  },
  {
    id: "bhmt_g742a",
    name: "BHMT G742A",
    gene: "BHMT",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "G/A", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~40%" },
      { variant: "A/A", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Betaine-homocysteine methyltransferase. May need TMG supplementation for homocysteine regulation.",
    category: "methylation",
  },
  {
    id: "apoe_e4",
    name: "APOE ε4",
    gene: "APOE",
    commonVariants: [
      { variant: "ε2/ε2", shorthand: "E2/E2", genotype: "protective", impact: "normal", frequency: "~1%" },
      { variant: "ε2/ε3", shorthand: "E2/E3", genotype: "protective", impact: "normal", frequency: "~12%" },
      { variant: "ε3/ε3", shorthand: "E3/E3", genotype: "neutral", impact: "normal", frequency: "~60%" },
      { variant: "ε3/ε4", shorthand: "E3/E4", genotype: "increased risk", impact: "reduced", frequency: "~20%" },
      { variant: "ε4/ε4", shorthand: "E4/E4", genotype: "high risk", impact: "reduced", frequency: "~2%" },
    ],
    description: "Apolipoprotein E. ε4 carriers should limit saturated fat and may need different dietary fat ratios.",
    category: "nutrient_absorption",
  },
  {
    id: "fto_rs9939609",
    name: "FTO rs9939609",
    gene: "FTO",
    commonVariants: [
      { variant: "T/T", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~45%" },
      { variant: "T/A", shorthand: "heterozygous", genotype: "increased", impact: "increased", frequency: "~40%" },
      { variant: "A/A", shorthand: "variant", genotype: "high", impact: "increased", frequency: "~15%" },
    ],
    description: "Fat mass and obesity-associated gene. A carriers may be more sensitive to high-fat diets.",
    category: "nutrient_absorption",
  },
  {
    id: "tcf7l2",
    name: "TCF7L2",
    gene: "TCF7L2",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~55%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "increased risk", impact: "reduced", frequency: "~35%" },
      { variant: "T/T", shorthand: "variant", genotype: "high risk", impact: "reduced", frequency: "~10%" },
    ],
    description: "Type 2 diabetes risk gene. T carriers should limit refined carbohydrates.",
    category: "nutrient_absorption",
  },
  {
    id: "pparg_pro12ala",
    name: "PPARG Pro12Ala",
    gene: "PPARG",
    commonVariants: [
      { variant: "C/C", shorthand: "Pro/Pro", genotype: "normal", impact: "normal", frequency: "~75%" },
      { variant: "C/G", shorthand: "Pro/Ala", genotype: "protective", impact: "normal", frequency: "~22%" },
      { variant: "G/G", shorthand: "Ala/Ala", genotype: "protective", impact: "normal", frequency: "~3%" },
    ],
    description: "Peroxisome proliferator-activated receptor. Ala variant may improve insulin sensitivity.",
    category: "nutrient_absorption",
  },
  {
    id: "fabp2",
    name: "FABP2 Ala54Thr",
    gene: "FABP2",
    commonVariants: [
      { variant: "G/G", shorthand: "Ala/Ala", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "G/A", shorthand: "Ala/Thr", genotype: "reduced", impact: "reduced", frequency: "~25%" },
      { variant: "A/A", shorthand: "Thr/Thr", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "Fatty acid binding protein. Thr variant may increase fat absorption. Limit saturated fat.",
    category: "nutrient_absorption",
  },
  {
    id: "adipoq",
    name: "ADIPOQ",
    gene: "ADIPOQ",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Adiponectin gene. Reduced adiponectin may affect insulin sensitivity. Omega-3s may help.",
    category: "nutrient_absorption",
  },
  {
    id: "hfe_c282y",
    name: "HFE C282Y",
    gene: "HFE",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~85%" },
      { variant: "C/Y", shorthand: "heterozygous", genotype: "carrier", impact: "increased", frequency: "~10%" },
      { variant: "Y/Y", shorthand: "homozygous", genotype: "hemochromatosis", impact: "increased", frequency: "~0.5%" },
    ],
    description: "Hemochromatosis risk. Y/Y carriers should limit iron-rich foods and vitamin C with iron.",
    category: "nutrient_absorption",
  },
  {
    id: "hfe_h63d",
    name: "HFE H63D",
    gene: "HFE",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "C/D", shorthand: "heterozygous", genotype: "carrier", impact: "normal", frequency: "~18%" },
      { variant: "D/D", shorthand: "variant", genotype: "increased", impact: "increased", frequency: "~2%" },
    ],
    description: "Milder hemochromatosis risk. May need to monitor iron intake.",
    category: "nutrient_absorption",
  },
  {
    id: "sod2_ala16val",
    name: "SOD2 Ala16Val",
    gene: "SOD2",
    commonVariants: [
      { variant: "C/C", shorthand: "Ala/Ala", genotype: "mitochondrial", impact: "normal", frequency: "~20%" },
      { variant: "C/T", shorthand: "Ala/Val", genotype: "intermediate", impact: "normal", frequency: "~50%" },
      { variant: "T/T", shorthand: "Val/Val", genotype: "cytosolic", impact: "reduced", frequency: "~30%" },
    ],
    description: "Superoxide dismutase. Val/Val may have reduced antioxidant capacity. May need MnSOD support.",
    category: "detoxification",
  },
  {
    id: "gpx1_pro198leu",
    name: "GPX1 Pro198Leu",
    gene: "GPX1",
    commonVariants: [
      { variant: "C/C", shorthand: "Pro/Pro", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "C/T", shorthand: "Pro/Leu", genotype: "reduced", impact: "reduced", frequency: "~35%" },
      { variant: "T/T", shorthand: "Leu/Leu", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "Glutathione peroxidase. Leu variant has reduced selenium-dependent activity. May need selenium.",
    category: "detoxification",
  },
  {
    id: "gstm1_null",
    name: "GSTM1 Null",
    gene: "GSTM1",
    commonVariants: [
      { variant: "Present", shorthand: "present", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "Null", shorthand: "null", genotype: "deleted", impact: "absent", frequency: "~50%" },
    ],
    description: "Glutathione S-transferase. Null genotype cannot detoxify certain carcinogens. Support with sulforaphane.",
    category: "detoxification",
  },
  {
    id: "gstt1_null",
    name: "GSTT1 Null",
    gene: "GSTT1",
    commonVariants: [
      { variant: "Present", shorthand: "present", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Null", shorthand: "null", genotype: "deleted", impact: "absent", frequency: "~20%" },
    ],
    description: "Glutathione S-transferase theta. Null affects detoxification of environmental toxins.",
    category: "detoxification",
  },
  {
    id: "hnm1_c314t",
    name: "HNMT C314T",
    gene: "HNMT",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~25%" },
      { variant: "T/T", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "Histamine N-methyltransferase. T variant reduces histamine breakdown. Limit high-histamine foods.",
    category: "detoxification",
  },
  {
    id: "dao",
    name: "DAO Activity",
    gene: "ABP1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Low", shorthand: "low", genotype: "reduced", impact: "reduced", frequency: "~20%" },
    ],
    description: "Diamine oxidase. Low activity cannot break down dietary histamine. Avoid fermented foods.",
    category: "detoxification",
  },
  {
    id: "aldh2",
    name: "ALDH2 Glu504Lys",
    gene: "ALDH2",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~95% globally" },
      { variant: "G/A", shorthand: "heterozygous", genotype: "flusher", impact: "reduced", frequency: "~40% in E.Asia" },
      { variant: "A/A", shorthand: "variant", genotype: "inactive", impact: "absent", frequency: "~10% in E.Asia" },
    ],
    description: "Aldehyde dehydrogenase. A variant causes alcohol flush. Cannot detoxify acetaldehyde.",
    category: "detoxification",
  },
  {
    id: "ace_id",
    name: "ACE I/D",
    gene: "ACE",
    commonVariants: [
      { variant: "I/I", shorthand: "insertion", genotype: "low", impact: "normal", frequency: "~30%" },
      { variant: "I/D", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "D/D", shorthand: "deletion", genotype: "high", impact: "increased", frequency: "~25%" },
    ],
    description: "Angiotensin-converting enzyme. D/D may need more potassium-rich foods for blood pressure.",
    category: "other",
  },
  {
    id: "agtr1",
    name: "AGTR1 A1166C",
    gene: "AGTR1",
    commonVariants: [
      { variant: "A/A", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "A/C", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~25%" },
      { variant: "C/C", shorthand: "variant", genotype: "increased", impact: "increased", frequency: "~5%" },
    ],
    description: "Angiotensin receptor. C/C may need more potassium and less sodium.",
    category: "other",
  },
  {
    id: "tnf_alpha",
    name: "TNF-alpha -308 G>A",
    gene: "TNF",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "G/A", shorthand: "heterozygous", genotype: "increased", impact: "increased", frequency: "~18%" },
      { variant: "A/A", shorthand: "variant", genotype: "high", impact: "increased", frequency: "~2%" },
    ],
    description: "Tumor necrosis factor. A allele increases inflammatory response. Anti-inflammatory diet beneficial.",
    category: "immune",
  },
  {
    id: "il6_174",
    name: "IL-6 -174 G>C",
    gene: "IL6",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "G/C", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~35%" },
      { variant: "C/C", shorthand: "variant", genotype: "increased", impact: "increased", frequency: "~5%" },
    ],
    description: "Interleukin-6. C allele increases inflammation. Omega-3s and anti-inflammatory foods helpful.",
    category: "immune",
  },
  {
    id: "il10",
    name: "IL-10 -1082 G>A",
    gene: "IL10",
    commonVariants: [
      { variant: "G/G", shorthand: "high", genotype: "anti-inflammatory", impact: "normal", frequency: "~25%" },
      { variant: "G/A", shorthand: "intermediate", genotype: "intermediate", impact: "normal", frequency: "~50%" },
      { variant: "A/A", shorthand: "low", genotype: "pro-inflammatory", impact: "reduced", frequency: "~25%" },
    ],
    description: "Interleukin-10 anti-inflammatory. A/A produces less, may need anti-inflammatory diet.",
    category: "immune",
  },
  {
    id: "cyp2c9",
    name: "CYP2C9",
    gene: "CYP2C9",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "poor metabolizer", impact: "reduced", frequency: "~20%" },
    ],
    description: "Drug-metabolizing enzyme. Poor metabolizers should be cautious with certain drugs and supplements.",
    category: "detoxification",
  },
  {
    id: "cyp2c19",
    name: "CYP2C19",
    gene: "CYP2C19",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Intermediate", shorthand: "intermediate", genotype: "intermediate", impact: "reduced", frequency: "~30%" },
      { variant: "Poor", shorthand: "poor", genotype: "poor", impact: "absent", frequency: "~10%" },
    ],
    description: "Drug-metabolizing enzyme. Poor metabolizers may have issues with PPIs and certain supplements.",
    category: "detoxification",
  },
  {
    id: "cyp2d6",
    name: "CYP2D6",
    gene: "CYP2D6",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Intermediate", shorthand: "intermediate", genotype: "intermediate", impact: "reduced", frequency: "~15%" },
      { variant: "Poor", shorthand: "poor", genotype: "poor", impact: "absent", frequency: "~5%" },
    ],
    description: "Drug-metabolizing enzyme. Poor metabolizers cannot process certain compounds.",
    category: "detoxification",
  },
  {
    id: "sult1a1",
    name: "SULT1A1 Arg213His",
    gene: "SULT1A1",
    commonVariants: [
      { variant: "G/G", shorthand: "Arg/Arg", genotype: "normal", impact: "normal", frequency: "~65%" },
      { variant: "G/A", shorthand: "Arg/His", genotype: "intermediate", impact: "normal", frequency: "~30%" },
      { variant: "A/A", shorthand: "His/His", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "Sulfotransferase. His variant reduces detoxification of estrogen and other compounds.",
    category: "detoxification",
  },
  {
    id: "esr1",
    name: "ESR1 PvuII",
    gene: "ESR1",
    commonVariants: [
      { variant: "T/T", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~45%" },
      { variant: "T/C", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "C/C", shorthand: "variant", genotype: "modified", impact: "normal", frequency: "~10%" },
    ],
    description: "Estrogen receptor alpha. May affect phytoestrogen response.",
    category: "other",
  },
  {
    id: "pon1_q192r",
    name: "PON1 Q192R",
    gene: "PON1",
    commonVariants: [
      { variant: "A/A", shorthand: "Gln/Gln", genotype: "slow", impact: "reduced", frequency: "~30%" },
      { variant: "A/G", shorthand: "Gln/Arg", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "G/G", shorthand: "Arg/Arg", genotype: "fast", impact: "normal", frequency: "~25%" },
    ],
    description: "Paraoxonase. Gln/Gln slower at detoxifying organophosphates. Eat organic when possible.",
    category: "detoxification",
  },
  {
    id: "pon1_m55l",
    name: "PON1 M55L",
    gene: "PON1",
    commonVariants: [
      { variant: "T/T", shorthand: "Met/Met", genotype: "unstable", impact: "reduced", frequency: "~20%" },
      { variant: "T/M", shorthand: "Met/Leu", genotype: "intermediate", impact: "normal", frequency: "~50%" },
      { variant: "M/M", shorthand: "Leu/Leu", genotype: "stable", impact: "normal", frequency: "~30%" },
    ],
    description: "Paraoxonase stability. Met/Met variant degrades faster. Pomegranate may boost PON1.",
    category: "detoxification",
  },
  {
    id: "slc30a8",
    name: "SLC30A8",
    gene: "SLC30A8",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "increased risk", impact: "reduced", frequency: "~35%" },
      { variant: "T/T", shorthand: "variant", genotype: "high risk", impact: "reduced", frequency: "~5%" },
    ],
    description: "Zinc transporter. T allele increases diabetes risk. Zinc supplementation may help.",
    category: "nutrient_absorption",
  },
  {
    id: "alo12",
    name: "ALOX12",
    gene: "ALOX12",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "G/A", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~40%" },
      { variant: "A/A", shorthand: "variant", genotype: "increased", impact: "increased", frequency: "~10%" },
    ],
    description: "Arachidonate 12-lipoxygenase. A allele increases oxidative stress. Avoid excess omega-6.",
    category: "other",
  },
  {
    id: "mthfd1",
    name: "MTHFD1 R653Q",
    gene: "MTHFD1",
    commonVariants: [
      { variant: "G/G", shorthand: "Arg/Arg", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "G/A", shorthand: "Arg/Gln", genotype: "reduced", impact: "reduced", frequency: "~40%" },
      { variant: "A/A", shorthand: "Gln/Gln", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Methylenetetrahydrofolate dehydrogenase. May need more folate and glycine.",
    category: "methylation",
  },
  {
    id: "shmt1",
    name: "SHMT1 C1420T",
    gene: "SHMT1",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "modified", impact: "normal", frequency: "~35%" },
      { variant: "T/T", shorthand: "variant", genotype: "modified", impact: "normal", frequency: "~5%" },
    ],
    description: "Serine hydroxymethyltransferase. May benefit from serine and glycine.",
    category: "methylation",
  },
  {
    id: "nnos",
    name: "NOS3 Glu298Asp",
    gene: "NOS3",
    commonVariants: [
      { variant: "G/G", shorthand: "Glu/Glu", genotype: "normal", impact: "normal", frequency: "~35%" },
      { variant: "G/T", shorthand: "Glu/Asp", genotype: "intermediate", impact: "normal", frequency: "~50%" },
      { variant: "T/T", shorthand: "Asp/Asp", genotype: "reduced", impact: "reduced", frequency: "~15%" },
    ],
    description: "Endothelial nitric oxide synthase. Asp/Asp may need L-arginine support.",
    category: "other",
  },
  {
    id: "hla_dq8",
    name: "HLA-DQ8",
    gene: "HLA-DQA1/DQB1",
    commonVariants: [
      { variant: "Negative", shorthand: "negative", genotype: "negative", impact: "normal", frequency: "~70%" },
      { variant: "Positive", shorthand: "positive", genotype: "positive", impact: "increased", frequency: "~30%" },
    ],
    description: "Celiac risk allele. DQ8 positive indicates gluten sensitivity risk.",
    category: "immune",
  },
  {
    id: "cd14",
    name: "CD14 -260 C>T",
    gene: "CD14",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~40%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "T/T", shorthand: "variant", genotype: "increased", impact: "increased", frequency: "~15%" },
    ],
    description: "Toll-like receptor co-receptor. T allele increases inflammatory response to endotoxin.",
    category: "immune",
  },
  {
    id: "tlr4",
    name: "TLR4 Asp299Gly",
    gene: "TLR4",
    commonVariants: [
      { variant: "A/A", shorthand: "Asp/Asp", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "A/G", shorthand: "Asp/Gly", genotype: "intermediate", impact: "normal", frequency: "~25%" },
      { variant: "G/G", shorthand: "Gly/Gly", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "Toll-like receptor 4. Gly variant has blunted inflammatory response to LPS.",
    category: "immune",
  },
  {
    id: "crp",
    name: "CRP -286 C>T>A",
    gene: "CRP",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~35%" },
      { variant: "T/T", shorthand: "variant", genotype: "high", impact: "increased", frequency: "~15%" },
    ],
    description: "C-reactive protein. Elevated CRP variant indicates higher inflammation. Anti-inflammatory diet recommended.",
    category: "immune",
  },
  {
    id: "mbl2",
    name: "MBL2 Codon 52",
    gene: "MBL2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Variant", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Mannose-binding lectin. Variant reduces immune function. May need immune support.",
    category: "immune",
  },
  {
    id: "ifng",
    name: "IFNG +874 A>T",
    gene: "IFNG",
    commonVariants: [
      { variant: "A/A", shorthand: "high", genotype: "high", impact: "increased", frequency: "~30%" },
      { variant: "A/T", shorthand: "intermediate", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "T/T", shorthand: "low", genotype: "low", impact: "reduced", frequency: "~25%" },
    ],
    description: "Interferon gamma. T/T produces less IFNG. May affect viral immunity.",
    category: "immune",
  },
  {
    id: "kilgore",
    name: "KIR2DL3",
    gene: "KIR",
    commonVariants: [
      { variant: "Present", shorthand: "inhibitory", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "Absent", shorthand: "less inhibitory", genotype: "modified", impact: "normal", frequency: "~50%" },
    ],
    description: "Killer cell immunoglobulin-like receptor. Affects NK cell function.",
    category: "immune",
  },
  {
    id: "gcr",
    name: "NR3C1 BclI",
    gene: "NR3C1",
    commonVariants: [
      { variant: "G/G", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "G/C", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~35%" },
      { variant: "C/C", shorthand: "variant", genotype: "sensitive", impact: "reduced", frequency: "~5%" },
    ],
    description: "Glucocorticoid receptor. C/C may have heightened stress response. Adaptogenic herbs may help.",
    category: "other",
  },
  {
    id: "bche",
    name: "BCHE -116 A>G",
    gene: "BCHE",
    commonVariants: [
      { variant: "A/A", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "A/G", shorthand: "heterozygous", genotype: "intermediate", impact: "normal", frequency: "~25%" },
      { variant: "G/G", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "Butyrylcholinesterase. G/G has reduced enzyme activity. Affects certain drug/chemical sensitivity.",
    category: "detoxification",
  },
  {
    id: " EphX2",
    name: "EPHX2 K55R",
    gene: "EPHX2",
    commonVariants: [
      { variant: "A/A", shorthand: "Lys/Lys", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "A/G", shorthand: "Lys/Arg", genotype: "intermediate", impact: "normal", frequency: "~40%" },
      { variant: "G/G", shorthand: "Arg/Arg", genotype: "increased", impact: "increased", frequency: "~10%" },
    ],
    description: "Epoxide hydrolase. G/G variant associated with higher inflammation.",
    category: "detoxification",
  },
  {
    id: "gsta1",
    name: "GSTA1 -69 C>T",
    gene: "GSTA1",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~40%" },
      { variant: "T/T", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Glutathione S-transferase alpha. Reduced activity may affect carcinogen detoxification.",
    category: "detoxification",
  },
  {
    id: "gstp1",
    name: "GSTP1 Ile105Val",
    gene: "GSTP1",
    commonVariants: [
      { variant: "A/A", shorthand: "Ile/Ile", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "A/G", shorthand: "Ile/Val", genotype: "intermediate", impact: "normal", frequency: "~40%" },
      { variant: "G/G", shorthand: "Val/Val", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Glutathione S-transferase pi. Val variant has reduced activity.",
    category: "detoxification",
  },
  {
    id: "mged",
    name: "MGMT",
    gene: "MGMT",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~40%" },
    ],
    description: "O6-methylguanine-DNA methyltransferase. Affects DNA repair. Cruciferous vegetables may help.",
    category: "detoxification",
  },
  {
    id: "xpd",
    name: "XPD Lys751Gln",
    gene: "ERCC2",
    commonVariants: [
      { variant: "A/A", shorthand: "Lys/Lys", genotype: "normal", impact: "normal", frequency: "~40%" },
      { variant: "A/C", shorthand: "Lys/Gln", genotype: "intermediate", impact: "normal", frequency: "~45%" },
      { variant: "C/C", shorthand: "Gln/Gln", genotype: "reduced", impact: "reduced", frequency: "~15%" },
    ],
    description: "DNA repair enzyme. Gln variant may need more antioxidants.",
    category: "detoxification",
  },
  {
    id: "xrcc1",
    name: "XRCC1 Arg399Gln",
    gene: "XRCC1",
    commonVariants: [
      { variant: "G/G", shorthand: "Arg/Arg", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "G/A", shorthand: "Arg/Gln", genotype: "intermediate", impact: "normal", frequency: "~40%" },
      { variant: "A/A", shorthand: "Gln/Gln", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "DNA repair protein. Gln variant may increase cancer risk with certain exposures.",
    category: "detoxification",
  },
  {
    id: "atm",
    name: "ATM",
    gene: "ATM",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~99%" },
      { variant: "Carrier", shorthand: "carrier", genotype: "heterozygous", impact: "reduced", frequency: "~1%" },
    ],
    description: "Ataxia telangiectasia mutated. Carriers should limit radiation exposure.",
    category: "detoxification",
  },
  {
    id: "brca1",
    name: "BRCA1",
    gene: "BRCA1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~99%" },
      { variant: "Carrier", shorthand: "carrier", genotype: "heterozygous", impact: "reduced", frequency: "~0.2%" },
    ],
    description: "Breast cancer gene. Carriers should limit alcohol and estrogen exposure.",
    category: "other",
  },
  {
    id: "brca2",
    name: "BRCA2",
    gene: "BRCA2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~99%" },
      { variant: "Carrier", shorthand: "carrier", genotype: "heterozygous", impact: "reduced", frequency: "~0.2%" },
    ],
    description: "Breast cancer gene 2. Carriers should limit processed meats and alcohol.",
    category: "other",
  },
  {
    id: "p53",
    name: "TP53",
    gene: "TP53",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Variant", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~20%" },
    ],
    description: "Guardian of the genome. Variants may need more antioxidant support.",
    category: "other",
  },
  {
    id: "cyp3a4",
    name: "CYP3A4",
    gene: "CYP3A4",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Drug-metabolizing enzyme. Reduced activity affects many compounds.",
    category: "detoxification",
  },
  {
    id: "cyp3a5",
    name: "CYP3A5",
    gene: "CYP3A5",
    commonVariants: [
      { variant: "Expresser", shorthand: "expresser", genotype: "normal", impact: "normal", frequency: "~20%" },
      { variant: "Non-expresser", shorthand: "non-expresser", genotype: "reduced", impact: "reduced", frequency: "~80%" },
    ],
    description: "Non-expressers may have reduced drug metabolism capacity.",
    category: "detoxification",
  },
  {
    id: "slc23a1",
    name: "SLC23A1",
    gene: "SLC23A1",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "C/T", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~40%" },
      { variant: "T/T", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Vitamin C transporter. T/T may need more vitamin C from diet.",
    category: "nutrient_absorption",
  },
  {
    id: "slc23a2",
    name: "SLC23A2",
    gene: "SLC23A2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~50%" },
    ],
    description: "Vitamin C transporter. Reduced may need more vitamin C.",
    category: "nutrient_absorption",
  },
  {
    id: "tcn2",
    name: "TCN2 C776G",
    gene: "TCN2",
    commonVariants: [
      { variant: "C/C", shorthand: "wildtype", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "C/G", shorthand: "heterozygous", genotype: "reduced", impact: "reduced", frequency: "~40%" },
      { variant: "G/G", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Transcobalamin II. G variant affects B12 delivery to cells.",
    category: "nutrient_absorption",
  },
  {
    id: "cubn",
    name: "CUBN",
    gene: "CUBN",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Variant", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Intrinsic factor-cubilin receptor. Affects B12 absorption.",
    category: "nutrient_absorption",
  },
  {
    id: "amd1",
    name: "AMD1",
    gene: "AMD1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "S-adenosylmethionine decarboxylase. Affects polyamine synthesis.",
    category: "methylation",
  },
  {
    id: "gnmt",
    name: "GNMT",
    gene: "GNMT",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~20%" },
    ],
    description: "Glycine N-methyltransferase. Variant affects methylation capacity.",
    category: "methylation",
  },
  {
    id: "ahcy",
    name: "AHCY",
    gene: "AHCY",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "S-adenosylhomocysteine hydrolase. Critical for methylation.",
    category: "methylation",
  },
  {
    id: "mat1a",
    name: "MAT1A",
    gene: "MAT1A",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~10%" },
    ],
    description: "Methionine adenosyltransferase. Produces SAM for methylation.",
    category: "methylation",
  },
  {
    id: "bhmt2",
    name: "BHMT2",
    gene: "BHMT2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Betaine-homocysteine methyltransferase 2. Alternative homocysteine pathway.",
    category: "methylation",
  },
  {
    id: "cth",
    name: "CTH",
    gene: "CTH",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Cystathionine gamma-lyase. Part of transsulfuration pathway.",
    category: "methylation",
  },
  {
    id: "cdkn2a",
    name: "CDKN2A",
    gene: "CDKN2A",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Variant", shorthand: "variant", genotype: "increased risk", impact: "increased", frequency: "~20%" },
    ],
    description: "Cell cycle regulator. Variant increases cancer risk with certain exposures.",
    category: "other",
  },
  {
    id: "mnsod",
    name: "MnSOD",
    gene: "SOD2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~40%" },
      { variant: "Variant", shorthand: "variant", genotype: "modified", impact: "normal", frequency: "~60%" },
    ],
    description: "Mitochondrial superoxide dismutase. Important antioxidant enzyme.",
    category: "detoxification",
  },
  {
    id: "cat",
    name: "CAT",
    gene: "CAT",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~40%" },
    ],
    description: "Catalase. Reduced activity may need more antioxidant support.",
    category: "detoxification",
  },
  {
    id: "nqo1",
    name: "NQO1 P187S",
    gene: "NQO1",
    commonVariants: [
      { variant: "C/C", shorthand: "Pro/Pro", genotype: "normal", impact: "normal", frequency: "~50%" },
      { variant: "C/T", shorthand: "Pro/Ser", genotype: "intermediate", impact: "reduced", frequency: "~35%" },
      { variant: "T/T", shorthand: "Ser/Ser", genotype: "reduced", impact: "absent", frequency: "~15%" },
    ],
    description: "NAD(P)H quinone dehydrogenase. T/T lacks enzyme activity. Avoid quinone-containing foods.",
    category: "detoxification",
  },
  {
    id: "ho1",
    name: "HO-1",
    gene: "HMOX1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Inducer", shorthand: "inducer", genotype: "protective", impact: "increased", frequency: "~30%" },
    ],
    description: "Heme oxygenase-1. Inducer variant provides antioxidant protection.",
    category: "detoxification",
  },
  {
    id: "nrf2",
    name: "NFE2L2 (Nrf2)",
    gene: "NFE2L2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~75%" },
      { variant: "Variant", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~25%" },
    ],
    description: "Master antioxidant regulator. Variant reduces antioxidant response.",
    category: "detoxification",
  },
  {
    id: "gclc",
    name: "GCLC",
    gene: "GCLC",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~40%" },
    ],
    description: "Glutamate-cysteine ligase. Reduced may need NAC support.",
    category: "detoxification",
  },
  {
    id: "gclm",
    name: "GCLM",
    gene: "GCLM",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~40%" },
    ],
    description: "Glutamate-cysteine ligase modifier. Affects glutathione synthesis.",
    category: "detoxification",
  },
  {
    id: "sod1",
    name: "SOD1",
    gene: "SOD1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~95%" },
      { variant: "Variant", shorthand: "variant", genotype: "modified",     impact: "reduced", frequency: "~5%" },
    ],
    description: "Copper-zinc superoxide dismutase. Rare variants affect ALS risk.",
    category: "detoxification",
  },
  {
    id: "txn",
    name: "TXN",
    gene: "TXN",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~20%" },
    ],
    description: "Thioredoxin. Reduced may need more antioxidants.",
    category: "detoxification",
  },
  {
    id: "txnip",
    name: "TXNIP",
    gene: "TXNIP",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Increased", shorthand: "increased", genotype: "increased", impact: "increased", frequency: "~40%" },
    ],
    description: "Thioredoxin interacting protein. High may increase oxidative stress.",
    category: "detoxification",
  },
  {
    id: "prdx",
    name: "PRDX1",
    gene: "PRDX1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Peroxiredoxin. Reduced may need more antioxidant support.",
    category: "detoxification",
  },
  {
    id: "gss",
    name: "GSS",
    gene: "GSS",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~20%" },
    ],
    description: "Glutathione synthetase. Critical for glutathione production.",
    category: "detoxification",
  },
  {
    id: "gstz1",
    name: "GSTZ1",
    gene: "GSTZ1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~70%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~30%" },
    ],
    description: "Glutathione transferase zeta. Also affects tyrosine metabolism.",
    category: "detoxification",
  },
  {
    id: " Ephx1",
    name: "EPHX1",
    gene: "EPHX1",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~60%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~40%" },
    ],
    description: "Microsomal epoxide hydrolase. Reduces detoxification of epoxides.",
    category: "detoxification",
  },
  {
    id: "gsr",
    name: "GSR",
    gene: "GSR",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~80%" },
      { variant: "Reduced", shorthand: "reduced", genotype: "reduced", impact: "reduced", frequency: "~20%" },
    ],
    description: "Glutathione reductase. Maintains glutathione in reduced form.",
    category: "detoxification",
  },
  {
    id: "g6pd",
    name: "G6PD",
    gene: "G6PD",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Deficient", shorthand: "deficient", genotype: "deficient", impact: "absent", frequency: "~10%" },
    ],
    description: "Glucose-6-phosphate dehydrogenase. Deficiency causes favism reaction.",
    category: "enzyme_function",
  },
  {
    id: "pak7",
    name: "PAK7",
    gene: "PAK7",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~95%" },
      { variant: "Variant", shorthand: "variant", genotype: "reduced", impact: "reduced", frequency: "~5%" },
    ],
    description: "p21-activated kinase 7. Affects brain development and function.",
    category: "other",
  },
  {
    id: "mage",
    name: "MAGE",
    gene: "MAGEA2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Variant", shorthand: "variant", genotype: "modified",     impact: "reduced", frequency: "~10%" },
    ],
    description: "Melanoma antigen. Associated with cancer testis antigens.",
    category: "other",
  },
  {
    id: "mage",
    name: "GAGE",
    gene: "GAGE",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~90%" },
      { variant: "Variant", shorthand: "variant", genotype: "modified",     impact: "reduced", frequency: "~10%" },
    ],
    description: "G antigen. Cancer-associated gene family.",
    category: "other",
  },
  {
    id: "ctag2",
    name: "CTAG2",
    gene: "CTAG2",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~95%" },
      { variant: "Variant", shorthand: "variant", genotype: "modified",     impact: "reduced", frequency: "~5%" },
    ],
    description: "Cancer/testis antigen 2. NY-ESO-1 family.",
    category: "other",
  },
  {
    id: "spata",
    name: "SPATA",
    gene: "SPATA8",
    commonVariants: [
      { variant: "Normal", shorthand: "normal", genotype: "normal", impact: "normal", frequency: "~95%" },
      { variant: "Variant", shorthand: "variant", genotype: "modified",     impact: "reduced", frequency: "~5%" },
    ],
    description: "Spermatogenesis associated. Fertility-related gene.",
    category: "other",
  },
];

export const MUTATION_CONTRAINDICATIONS: MutationContraindication[] = [
  // MTHFR C677T
  {
    mutationId: "mthfr_c677t",
    ingredientPattern: "folic acid|folacin|pteroylglutamic acid",
    severity: "avoid",
    reason: "Synthetic folic acid cannot be efficiently converted by MTHFR C677T variant. May accumulate unmetabolized.",
    evidence: "T/T variant reduces MTHFR activity by 30-70%",
    alternative: "Use methylfolate (5-MTHF) instead",
  },
  {
    mutationId: "mthfr_c677t",
    ingredientPattern: "cyanocobalamin",
    severity: "caution",
    reason: "Cyanocobalamin requires conversion and contains cyanide. MTHFR variants may have reduced capacity.",
    evidence: "Methylcobalamin is preferred for MTHFR variants",
    alternative: "Use methylcobalamin or hydroxocobalamin",
  },
  {
    mutationId: "mthfr_c677t",
    ingredientPattern: "enriched|fortified",
    severity: "limit",
    reason: "Enriched/fortified foods typically contain synthetic folic acid",
    evidence: "US fortification programs use folic acid",
  },
  {
    mutationId: "mthfr_a1298c",
    ingredientPattern: "folic acid",
    severity: "limit",
    reason: "Reduced folate conversion efficiency with A1298C variant",
    evidence: "C/C variant reduces activity by ~20%",
    alternative: "Consider methylfolate",
  },

  // CBS variants (sulfur sensitivity)
  {
    mutationId: "cbs_c699t",
    ingredientPattern: "sulfite|sulphite|e220|e221|e222|e223|e224|e225|e226|e227",
    severity: "avoid",
    reason: "CBS T/T variant increases sulfur processing. Sulfites may cause sensitivity reactions.",
    evidence: "CBS variants affect sulfur amino acid metabolism",
  },
  {
    mutationId: "cbs_c699t",
    ingredientPattern: "sulfur|sulphur",
    severity: "limit",
    reason: "May need to limit high-sulfur foods (eggs, cruciferous vegetables)",
    evidence: "CBS affects homocysteine-to-cysteine conversion",
  },
  {
    mutationId: "cbs_a360v",
    ingredientPattern: "sulfite|sulphite",
    severity: "avoid",
    reason: "A360V variant affects sulfur metabolism",
    evidence: "CBS variants impact sulfur-containing amino acid processing",
  },

  // G6PD
  {
    mutationId: "g6pd",
    ingredientPattern: "fava beans|broad beans|diva beans",
    severity: "avoid",
    reason: "Fava beans can trigger hemolytic crisis in G6PD deficiency",
    evidence: "Known trigger for G6PD deficiency episodes",
  },
  {
    mutationId: "g6pd",
    ingredientPattern: "blue 1|brilliant blue|fd&c blue",
    severity: "caution",
    reason: "Some artificial colors may trigger G6PD reactions",
    evidence: "Case reports of food color sensitivity in G6PD deficiency",
  },

  // COMT
  {
    mutationId: "comt_val158met",
    ingredientPattern: "caffeine|coffee|tea",
    severity: "limit",
    reason: "Met/Met variant has reduced COMT activity, slower dopamine breakdown. Caffeine may overstimulate.",
    evidence: "COMT is main dopamine metabolic pathway",
  },
  {
    mutationId: "comt_val158met",
    ingredientPattern: "green tea|catechin|egcg",
    severity: "caution",
    reason: "Catechins may affect dopamine in Met/Met individuals",
    evidence: "COMT affects catecholamine metabolism",
  },

  // Lactose
  {
    mutationId: "lct_13910",
    ingredientPattern: "lactose|milk solids|dry milk|whey",
    severity: "limit",
    reason: "Non-persistent lactase (C/C) may cause lactose intolerance",
    evidence: "LCT -13910 C>T determines lactase persistence",
  },

  // MAOA
  {
    mutationId: "maoa",
    ingredientPattern: "tyramine|aged cheese|cheddar|parmesan",
    severity: "limit",
    reason: "MAOA variants may reduce tyramine metabolism. Aged cheeses contain high tyramine.",
    evidence: "MAOA metabolizes tyramine from fermented foods",
  },
  {
    mutationId: "maoa",
    ingredientPattern: "cured|smoked|salami|prosciutto",
    severity: "limit",
    reason: "Cured meats contain tyramine and other vasoactive amines",
    evidence: "Fermented/cured meats have high tyramine content",
  },

  // NAT2
  {
    mutationId: "nat2",
    ingredientPattern: "caffeine|coffee",
    severity: "caution",
    reason: "Slow acetylators may have slower caffeine metabolism",
    evidence: "NAT2 affects caffeine metabolism",
  },

  // CYP1A2
  {
    mutationId: "cyp1a2",
    ingredientPattern: "caffeine|coffee",
    severity: "limit",
    reason: "Slow metabolizers should limit caffeine intake to avoid side effects",
    evidence: "CYP1A2 is primary caffeine metabolizing enzyme",
  },

  // FUT2 (B12 absorption)
  {
    mutationId: "fut2_w154x",
    ingredientPattern: "cyanocobalamin",
    severity: "caution",
    reason: "Non-secretors may have reduced B12 absorption from cyanocobalamin",
    evidence: "FUT2 affects intrinsic factor-mediated B12 absorption",
    alternative: "Use methylcobalamin or sublingual B12",
  },

  // PEMT (choline)
  {
    mutationId: "pemt_1742",
    ingredientPattern: "egg|eggs",
    severity: "caution",
    reason: "A/A variant reduces endogenous choline synthesis. May need dietary choline.",
    evidence: "PEMT is involved in phosphatidylcholine synthesis",
    alternative: "Consider choline supplementation or egg consumption",
  },

  // HLA-DQ2 (celiac)
  {
    mutationId: "hla_dq2",
    ingredientPattern: "wheat|barley|rye|gluten",
    severity: "avoid",
    reason: "HLA-DQ2 positive indicates celiac predisposition. Gluten triggers immune response.",
    evidence: "HLA-DQ2/DQ8 are major celiac risk alleles",
  },

  // MTR (methionine synthase)
  {
    mutationId: "mtr_a2756g",
    ingredientPattern: "cyanocobalamin",
    severity: "caution",
    reason: "G variant may increase B12 turnover. Consider methylcobalamin.",
    evidence: "MTR requires B12 for methionine synthesis",
    alternative: "Use methylcobalamin supplement",
  },
  {
    mutationId: "mtr_a2756g",
    ingredientPattern: "nitrous oxide|laughing gas",
    severity: "avoid",
    reason: "Nitrous oxide inactivates B12, critical for MTR function",
    evidence: "MTR is B12-dependent enzyme",
  },

  // MTRR
  {
    mutationId: "mtrr_a66g",
    ingredientPattern: "cyanocobalamin",
    severity: "avoid",
    reason: "G variant impairs B12 recycling. Cannot efficiently use cyanocobalamin.",
    evidence: "MTRR regenerates B12 for MTR",
    alternative: "Use methylcobalamin or hydroxocobalamin",
  },

  // BHMT
  {
    mutationId: "bhmt_g742a",
    ingredientPattern: "betaine|tmg|trimethylglycine",
    severity: "caution",
    reason: "A variant reduces betaine-homocysteine conversion",
    evidence: "BHMT converts betaine to help lower homocysteine",
  },

  // APOE
  {
    mutationId: "apoe_e4",
    ingredientPattern: "saturated fat|coconut oil|palm oil|butter",
    severity: "limit",
    reason: "ε4 carriers have impaired fat metabolism and increased Alzheimer's risk",
    evidence: "APOE ε4 affects lipid transport and brain metabolism",
    alternative: "Use olive oil, avocado oil instead",
  },
  {
    mutationId: "apoe_e4",
    ingredientPattern: "alcohol",
    severity: "limit",
    reason: "ε4 carriers have reduced alcohol tolerance",
    evidence: "APOE ε4 affects liver metabolism",
  },

  // FTO
  {
    mutationId: "fto_rs9939609",
    ingredientPattern: "high fructose corn syrup|hfcs|fructose",
    severity: "limit",
    reason: "A allele increases obesity risk with high-fat/high-sugar diets",
    evidence: "FTO affects satiety signaling and fat storage",
  },
  {
    mutationId: "fto_rs9939609",
    ingredientPattern: "saturated fat",
    severity: "limit",
    reason: "A allele carriers more sensitive to dietary fat",
    evidence: "FTO variant affects fat metabolism",
  },

  // TCF7L2
  {
    mutationId: "tcf7l2",
    ingredientPattern: "high fructose corn syrup|sugar|sucrose",
    severity: "limit",
    reason: "T allele increases diabetes risk, worsens with refined carbs",
    evidence: "TCF7L2 affects insulin secretion",
  },
  {
    mutationId: "tcf7l2",
    ingredientPattern: "white bread|white rice|refined grain",
    severity: "limit",
    reason: "T allele carriers have worse glycemic response to refined carbs",
    evidence: "TCF7L2 affects glucose homeostasis",
  },

  // FABP2
  {
    mutationId: "fabp2",
    ingredientPattern: "saturated fat|butter|lard",
    severity: "limit",
    reason: "Thr variant increases intestinal fatty acid absorption by 2x",
    evidence: "FABP2 Ala54Thr increases fat transport",
    alternative: "Use polyunsaturated fats",
  },

  // HFE (hemochromatosis)
  {
    mutationId: "hfe_c282y",
    ingredientPattern: "iron|ferrous|ferric|heme iron",
    severity: "avoid",
    reason: "Y/Y homozygotes have iron overload. Avoid iron supplements.",
    evidence: "HFE regulates iron absorption",
  },
  {
    mutationId: "hfe_c282y",
    ingredientPattern: "vitamin c|ascorbic acid",
    severity: "limit",
    reason: "Vitamin C increases iron absorption, may worsen overload",
    evidence: "Vitamin C reduces ferric to ferrous iron",
  },
  {
    mutationId: "hfe_h63d",
    ingredientPattern: "iron supplement",
    severity: "caution",
    reason: "D/D variant may increase iron storage",
    evidence: "HFE H63D moderate iron loading effect",
  },

  // SOD2
  {
    mutationId: "sod2_ala16val",
    ingredientPattern: "manganese",
    severity: "caution",
    reason: "Val/Val may benefit from manganese (SOD2 cofactor) but doses vary",
    evidence: "SOD2 is manganese-dependent",
  },

  // GPX1
  {
    mutationId: "gpx1_pro198leu",
    ingredientPattern: "selenium",
    severity: "caution",
    reason: "Leu variant has reduced GPX1 activity, may need selenium support",
    evidence: "GPX1 is selenium-dependent",
    alternative: "Brazil nuts are good selenium source",
  },

  // GSTM1/GSTT1 null
  {
    mutationId: "gstm1_null",
    ingredientPattern: "cruciferous|broccoli|cauliflower|brassica",
    severity: "caution",
    reason: "Null genotype benefits from sulforaphane to upregulate GST",
    evidence: "Sulforaphane induces GST expression",
    alternative: "Eat broccoli sprouts for sulforaphane",
  },
  {
    mutationId: "gstt1_null",
    ingredientPattern: "vegetable|fruit",
    severity: "caution",
    reason: "Null genotype should maximize cruciferous vegetables",
    evidence: "GSTT1 null needs dietary detox support",
  },

  // HNMT (histamine)
  {
    mutationId: "hnm1_c314t",
    ingredientPattern: "histamine|fermented|aged cheese|sauerkraut",
    severity: "avoid",
    reason: "T variant reduces histamine breakdown",
    evidence: "HNMT degrades histamine in tissues",
  },
  {
    mutationId: "hnm1_c314t",
    ingredientPattern: "wine|beer|alcohol",
    severity: "limit",
    reason: "Alcohol inhibits HNMT and contains histamine",
    evidence: "Alcohol and histamine synergize",
  },

  // DAO
  {
    mutationId: "dao",
    ingredientPattern: "histamine|fermented|aged cheese|salami|sauerkraut",
    severity: "avoid",
    reason: "Low DAO cannot break down dietary histamine",
    evidence: "DAO is primary intestinal histamine degrader",
  },
  {
    mutationId: "dao",
    ingredientPattern: "alcohol|wine|beer",
    severity: "limit",
    reason: "Alcohol inhibits DAO activity",
    evidence: "Alcohol blocks DAO function",
  },

  // ALDH2 (alcohol flush)
  {
    mutationId: "aldh2",
    ingredientPattern: "alcohol|ethanol|wine|beer|spirits",
    severity: "avoid",
    reason: "A allele prevents acetaldehyde detoxification, increases cancer risk",
    evidence: "ALDH2 deficiency causes acetaldehyde accumulation",
  },

  // TNF-alpha
  {
    mutationId: "tnf_alpha",
    ingredientPattern: "omega-6|vegetable oil|soybean oil|corn oil",
    severity: "limit",
    reason: "A allele increases inflammation, limit pro-inflammatory omega-6",
    evidence: "NF-κB pathway activation by omega-6",
    alternative: "Use olive oil, avocado oil",
  },

  // IL-6
  {
    mutationId: "il6_174",
    ingredientPattern: "trans fat|hydrogenated|partially hydrogenated",
    severity: "avoid",
    reason: "C allele increases IL-6, trans fats worsen inflammation",
    evidence: "Trans fats activate IL-6 pathway",
  },
  {
    mutationId: "il6_174",
    ingredientPattern: "omega-3|fish oil|flaxseed",
    severity: "caution",
    reason: "C/C may benefit from omega-3 anti-inflammatory effects",
    evidence: "Omega-3s reduce IL-6",
    alternative: "Consider omega-3 supplementation",
  },

  // PON1
  {
    mutationId: "pon1_q192r",
    ingredientPattern: "organophosphate|pesticide|grenade green|conventional produce",
    severity: "caution",
    reason: "Gln/Gln has reduced organophosphate detoxification",
    evidence: "PON1 hydrolyzes organophosphates",
    alternative: "Choose organic produce",
  },
  {
    mutationId: "pon1_m55l",
    ingredientPattern: "pomegranate|berry",
    severity: "caution",
    reason: "Met/Met destabilizes PON1, pomegranate may boost activity",
    evidence: "Polyphenols upregulate PON1",
    alternative: "Consider pomegranate juice for PON1 support",
  },

  // SLC30A8 (zinc)
  {
    mutationId: "slc30a8",
    ingredientPattern: "zinc",
    severity: "caution",
    reason: "T allele affects zinc transport, may need zinc supplementation",
    evidence: "SLC30A8 transports zinc to insulin granules",
    alternative: "Consider zinc supplementation",
  },

  // ALOX12
  {
    mutationId: "alo12",
    ingredientPattern: "vegetable oil|omega-6|corn oil|soybean oil",
    severity: "limit",
    reason: "A allele increases lipid peroxidation from omega-6",
    evidence: "ALOX12 converts omega-6 to inflammatory mediators",
  },

  // NQO1
  {
    mutationId: "nqo1",
    ingredientPattern: "quinone|ubiquinone|coenzyme q10",
    severity: "caution",
    reason: "T/T lacks NQO1 activity, cannot process quinones",
    evidence: "NQO1 detoxifies quinones",
  },

  // HLA-DQ8 (celiac)
  {
    mutationId: "hla_dq8",
    ingredientPattern: "wheat|barley|rye|gluten",
    severity: "avoid",
    reason: "HLA-DQ8 positive indicates celiac predisposition. Gluten triggers immune response.",
    evidence: "HLA-DQ8 is celiac risk allele",
  },

  // CRP (inflammation)
  {
    mutationId: "crp",
    ingredientPattern: "trans fat|hydrogenated|processed food",
    severity: "avoid",
    reason: "T/T CRP variant indicates higher inflammation baseline",
    evidence: "CRP is inflammatory marker",
  },

  // TLR4
  {
    mutationId: "tlr4",
    ingredientPattern: "lps|endotoxin|bacterial",
    severity: "caution",
    reason: "Gly variant has blunted response to endotoxin",
    evidence: "TLR4 recognizes bacterial LPS",
  },

  // MBL2 (immune)
  {
    mutationId: "mbl2",
    ingredientPattern: "sugar|refined carbohydrate",
    severity: "limit",
    reason: "Variant reduces immune function. Limit sugar to support immunity.",
    evidence: "MBL is collectin involved in innate immunity",
  },

  // IFNG
  {
    mutationId: "ifng",
    ingredientPattern: "sugar|inflammation",
    severity: "limit",
    reason: "T/T produces less interferon-gamma, may affect viral immunity",
    evidence: "IFNG is key antiviral cytokine",
  },

  // BCHE
  {
    mutationId: "bche",
    ingredientPattern: "organophosphate|pesticide",
    severity: "caution",
    reason: "G/G variant has reduced cholinesterase activity",
    evidence: "BCHE hydrolyzes certain toxins",
  },

  // GSTA1
  {
    mutationId: "gsta1",
    ingredientPattern: "cruciferous|broccoli|cauliflower",
    severity: "caution",
    reason: "T/T has reduced GSTA1, benefits from cruciferous for induction",
    evidence: "Sulforaphane induces GST",
  },

  // GSTP1
  {
    mutationId: "gstp1",
    ingredientPattern: "cruciferous|broccoli|brassica",
    severity: "caution",
    reason: "Val variant has reduced GSTP1 activity",
    evidence: "GSTP1 is important for carcinogen detoxification",
  },

  // EPHX1
  {
    mutationId: " Ephx1",
    ingredientPattern: "epoxide|processed meat",
    severity: "caution",
    reason: "Reduced EPHX1 affects epoxide detoxification",
    evidence: "EPHX1 processes environmental epoxides",
  },

  // GCLC/GCLM (glutathione)
  {
    mutationId: "gclc",
    ingredientPattern: "nac|n-acetyl cysteine|glutathione",
    severity: "caution",
    reason: "Reduced variant may benefit from NAC supplementation",
    evidence: "GCLC is rate-limiting for glutathione synthesis",
  },
  {
    mutationId: "gclm",
    ingredientPattern: "nac|n-acetyl cysteine|glutathione",
    severity: "caution",
    reason: "Reduced variant may benefit from NAC support",
    evidence: "GCLM modifies glutathione synthesis",
  },

  // GSR
  {
    mutationId: "gsr",
    ingredientPattern: "antioxidant|vitamin c|vitamin e",
    severity: "caution",
    reason: "Reduced GSR may need more antioxidant support",
    evidence: "GSR maintains glutathione in reduced form",
  },

  // CAT
  {
    mutationId: "cat",
    ingredientPattern: "antioxidant|polyphenol|flavonoid",
    severity: "caution",
    reason: "Reduced catalase may need dietary antioxidants",
    evidence: "CAT decomposes hydrogen peroxide",
  },

  // NRF2
  {
    mutationId: "nrf2",
    ingredientPattern: "cruciferous|broccoli| sulforaphane",
    severity: "caution",
    reason: "Variant reduces antioxidant response, needs dietary inducers",
    evidence: "NRF2 is master antioxidant regulator",
  },

  // HO1
  {
    mutationId: "ho1",
    ingredientPattern: "antioxidant|polyphenol|resveratrol",
    severity: "caution",
    reason: "Inducer variant is protective, non-carriers may need more support",
    evidence: "HO-1 produces biliverdin/bilirubin antioxidants",
  },

  // SOD1
  {
    mutationId: "sod1",
    ingredientPattern: "copper|zinc",
    severity: "caution",
    reason: "Variant may affect copper/zinc SOD function",
    evidence: "SOD1 requires copper and zinc",
  },

  // TXN
  {
    mutationId: "txn",
    ingredientPattern: "antioxidant|selenium",
    severity: "caution",
    reason: "Reduced thioredoxin may need more antioxidant support",
    evidence: "TXN is key intracellular antioxidant",
  },

  // BRCA1/2
  {
    mutationId: "brca1",
    ingredientPattern: "alcohol|estrogen|hormone",
    severity: "avoid",
    reason: "Carriers should limit alcohol and estrogenic compounds",
    evidence: "BRCA1/2 involved in DNA repair",
  },
  {
    mutationId: "brca2",
    ingredientPattern: "alcohol|processed meat",
    severity: "limit",
    reason: "Carriers should limit alcohol and processed meats",
    evidence: "BRCA2 affects DNA repair",
  },

  // TP53
  {
    mutationId: "p53",
    ingredientPattern: "antioxidant|beta-carotene|vitamin a",
    severity: "caution",
    reason: "Variant may need more antioxidant support",
    evidence: "p53 is guardian of the genome",
  },

  // ATM
  {
    mutationId: "atm",
    ingredientPattern: "radiation|x-ray|gamma",
    severity: "avoid",
    reason: "Carriers should minimize radiation exposure",
    evidence: "ATM involved in DNA damage response",
  },

  // CYP3A4/3A5
  {
    mutationId: "cyp3a4",
    ingredientPattern: "grapefruit|grape fruit",
    severity: "avoid",
    reason: "Inhibits CYP3A4, affects drug metabolism",
    evidence: "CYP3A4 metabolizes many compounds",
  },
  {
    mutationId: "cyp3a5",
    ingredientPattern: "grapefruit|grape fruit",
    severity: "caution",
    reason: "Non-expressers may have different grapefruit interaction",
    evidence: "CYP3A5 expression affects metabolism",
  },

  // SLC23A1 (Vitamin C)
  {
    mutationId: "slc23a1",
    ingredientPattern: "vitamin c|ascorbic acid|citrus",
    severity: "caution",
    reason: "T/T variant has reduced vitamin C transport",
    evidence: "SLC23A1 is vitamin C transporter",
  },

  // TCN2 (B12)
  {
    mutationId: "tcn2",
    ingredientPattern: "cyanocobalamin",
    severity: "caution",
    reason: "G variant affects B12 delivery to tissues",
    evidence: "TCN2 is transcobalamin transporter",
    alternative: "Consider methylcobalamin",
  },

  // CUBN (B12 absorption)
  {
    mutationId: "cubn",
    ingredientPattern: "vitamin b12|b12",
    severity: "caution",
    reason: "Variant affects intrinsic factor-mediated B12 absorption",
    evidence: "CUBN is cubilin receptor for B12",
    alternative: "Consider sublingual B12",
  },

  // HFE (iron)
  {
    mutationId: "hfe_c282y",
    ingredientPattern: "red meat|heme iron",
    severity: "limit",
    reason: "Y/Y carriers have iron overload risk",
    evidence: "HFE regulates hepcidin and iron absorption",
  },

  // APOE
  {
    mutationId: "apoe_e4",
    ingredientPattern: "high cholesterol|saturated fat",
    severity: "avoid",
    reason: "ε4 carriers have impaired cholesterol transport",
    evidence: "APOE is lipid transport protein",
  },
];

export function getMutationById(id: string): MutationDefinition | undefined {
  return KNOWN_MUTATIONS.find((m) => m.id === id);
}

export function getContraindicationsForMutation(
  mutationId: string,
): MutationContraindication[] {
  return MUTATION_CONTRAINDICATIONS.filter((c) => c.mutationId === mutationId);
}

export function checkIngredientContraindication(
  ingredientName: string,
  userMutations: UserMutation[],
): { contraindication: MutationContraindication | null; mutationId: string | null } {
  const lowerIngredient = ingredientName.toLowerCase();

  for (const userMutation of userMutations) {
    const contraindications = getContraindicationsForMutation(userMutation.mutationId);

    for (const contraindication of contraindications) {
      const pattern = new RegExp(contraindication.ingredientPattern, "i");
      if (pattern.test(lowerIngredient)) {
        return {
          contraindication,
          mutationId: userMutation.mutationId,
        };
      }
    }
  }

  return { contraindication: null, mutationId: null };
}

export function checkAllIngredientsContraindications(
  ingredients: ProductIngredient[],
  userMutations: UserMutation[],
): Map<string, { contraindication: MutationContraindication; mutationId: string }> {
  const results = new Map<string, { contraindication: MutationContraindication; mutationId: string }>();

  for (const ingredient of ingredients) {
    const result = checkIngredientContraindication(ingredient.canonicalName, userMutations);
    if (result.contraindication) {
      results.set(ingredient.canonicalName, {
        contraindication: result.contraindication,
        mutationId: result.mutationId!,
      });
    }

    if (ingredient.subIngredients) {
      for (const sub of ingredient.subIngredients) {
        const subResult = checkIngredientContraindication(sub.canonicalName, userMutations);
        if (subResult.contraindication) {
          results.set(sub.canonicalName, {
            contraindication: subResult.contraindication,
            mutationId: subResult.mutationId!,
          });
        }
      }
    }
  }

  return results;
}

export function getMutationCategories(): { id: string; name: string; count: number }[] {
  const categories = new Map<string, number>();

  for (const mutation of KNOWN_MUTATIONS) {
    const current = categories.get(mutation.category) || 0;
    categories.set(mutation.category, current + 1);
  }

  return Array.from(categories.entries()).map(([id, count]) => ({
    id,
    name: id.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count,
  }));
}