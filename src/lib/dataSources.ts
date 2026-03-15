/**
 * Public data sources for nutrigenomics / gene-food interactions
 * No authentication required (or free tier available)
 */

export interface ExternalDataSource {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  requiresApiKey: boolean;
  rateLimit?: string;
  dataType: "variants" | "nutrients" | "interactions" | "phenotypes";
  exampleQuery?: string;
}

export const PUBLIC_DATA_SOURCES: ExternalDataSource[] = [
  {
    id: "clinvar",
    name: "ClinVar API (NIH)",
    description:
      "Database of genetic variants linked to human health. Includes nutrient sensitivities (lactose, fructose) and metabolic conditions.",
    baseUrl: "https://clinicaltables.nlm.nih.gov/api/variants/v4",
    requiresApiKey: false,
    rateLimit: "7,500 results max",
    dataType: "variants",
    exampleQuery:
      "?terms=MTHFR&ef=GeneSymbol,PhenotypeList,dbSNP&maxList=10",
  },
  {
    id: "usda_fdc",
    name: "USDA FoodData Central",
    description:
      "Comprehensive nutrient profiles for 260,000+ foods. Cross-reference with genetic sensitivities.",
    baseUrl: "https://api.nal.usda.gov/fdc/v1",
    requiresApiKey: true,
    rateLimit: "1,000/hour (free key)",
    dataType: "nutrients",
    exampleQuery: "/foods/search?query=cheddar+cheese&api_key=DEMO_KEY",
  },
  {
    id: "nutrigenomedb",
    name: "NutriGenomeDB",
    description:
      "Exploratory tool connecting gene expression profiles to nutrients/bioactive compounds.",
    baseUrl: "http://nutrigenomedb.org",
    requiresApiKey: false,
    dataType: "interactions",
  },
  {
    id: "snpedia",
    name: "SNPedia",
    description:
      "Wiki-based SNP database with published research. Useful for variant-nutrient relationships.",
    baseUrl: "https://www.snpedia.com",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "dbsnp",
    name: "dbSNP",
    description:
      "NCBI database of genetic variation. Search by rsID to get variant details.",
    baseUrl: "https://api.ncbi.nlm.nih.gov/dbsnp/v2",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "openfoodfacts",
    name: "Open Food Facts",
    description:
      "Crowdsourced open database of food products. Free API with 1 req/sec.",
    baseUrl: "https://world.openfoodfacts.org/api/v2",
    requiresApiKey: false,
    rateLimit: "1 req/sec",
    dataType: "nutrients",
  },
  {
    id: "dbget",
    name: "KEGG/DBGET",
    description:
      "Japanese genome database with pathway information for metabolic genes.",
    baseUrl: "https://www.genome.jp/dbget",
    requiresApiKey: false,
    dataType: "interactions",
  },
  {
    id: "genecards",
    name: "GeneCards",
    description:
      "Human gene database with protein info, pathways, and related diseases.",
    baseUrl: "https://www.genecards.org",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "omim",
    name: "OMIM",
    description:
      "Online Mendelian Inheritance in Man. Phenotype-gene relationships.",
    baseUrl: "https://api.omim.org/api",
    requiresApiKey: true,
    dataType: "phenotypes",
  },
  {
    id: "uniprot",
    name: "UniProt",
    description:
      "Protein sequence/function database. Good for enzyme function and variants.",
    baseUrl: "https://rest.uniprot.org",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "ncbi_gene",
    name: "NCBI Gene",
    description: "Gene-centered information including variants and phenotypes.",
    baseUrl: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "pharmgkb",
    name: "PharmGKB",
    description:
      "Pharmacogenomics database. Contains drug-gene and some food-gene interactions.",
    baseUrl: "https://api.pharmgkb.org",
    requiresApiKey: true,
    dataType: "interactions",
  },
  {
    id: "exac",
    name: "gnomAD",
    description:
      "Genome aggregation database. Variant frequency data for population genetics.",
    baseUrl: "https://gnomad.broadinstitute.org/api",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "pubchem",
    name: "PubChem",
    description:
      "Chemical compound data. Useful for bioactive food compounds.",
    baseUrl: "https://pubchem.ncbi.nlm.nih.gov/rest",
    requiresApiKey: false,
    rateLimit: "5 req/sec, 300/min",
    dataType: "nutrients",
  },
  {
    id: "ctd",
    name: "CTD (Comparative Toxicogenomics)",
    description:
      "Gene-chemical-disease relationships. Food compound interactions.",
    baseUrl: "http://ctdbase.org",
    requiresApiKey: false,
    dataType: "interactions",
  },
  {
    id: "mesh",
    name: "MeSH NLM",
    description:
      "Medical subject headings. Useful for searching nutrition literature.",
    baseUrl: "https://id.nlm.nih.gov/mesh",
    requiresApiKey: false,
    dataType: "phenotypes",
  },
  {
    id: "pdb",
    name: "Protein Data Bank",
    description: "3D protein structures. Useful for understanding enzyme variants.",
    baseUrl: "https://data.rcsb.org/rest/v1",
    requiresApiKey: false,
    dataType: "variants",
  },
  {
    id: "reactome",
    name: "Reactome",
    description:
      "Pathway database. Metabolic and signaling pathways with gene info.",
    baseUrl: "https://reactome.org/ContentService",
    requiresApiKey: false,
    dataType: "interactions",
  },
  {
    id: "string",
    name: "STRING",
    description:
      "Protein-protein interaction database. Metabolic network analysis.",
    baseUrl: "https://string-db.org/api",
    requiresApiKey: false,
    dataType: "interactions",
  },
  {
    id: "biogrid",
    name: "BioGRID",
    description:
      "Protein and genetic interactions. Pathway analysis.",
    baseUrl: "https://webservice.thebiogrid.org",
    requiresApiKey: true,
    dataType: "interactions",
  },
];

/**
 * Query ClinVar API for variant information
 * No API key required
 */
export async function queryClinVar(
  geneSymbol: string,
  maxResults = 10,
): Promise<unknown> {
  const url = `${PUBLIC_DATA_SOURCES[0].baseUrl}/search?terms=${encodeURIComponent(
    geneSymbol,
  )}&ef=GeneSymbol,PhenotypeList,dbSNP,AminoAcidChange&maxList=${maxResults}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ClinVar API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Query USDA FoodData Central for food nutrients
 * Requires API key (free from https://api.data.gov)
 */
export async function queryUSDAFood(
  query: string,
  apiKey: string,
  maxResults = 10,
): Promise<unknown> {
  const url = `${PUBLIC_DATA_SOURCES[1].baseUrl}/foods/search?query=${encodeURIComponent(
    query,
  )}&dataType=Branded,Foundation&pageSize=${maxResults}&api_key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`USDA API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Query Open Food Facts API
 * No API key required
 */
export async function queryOpenFoodFacts(
  barcode: string,
): Promise<unknown> {
  const url = `${PUBLIC_DATA_SOURCES[5].baseUrl}/product/${barcode}.json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open Food Facts error: ${response.status}`);
  }
  return response.json();
}

/**
 * Search Open Food Facts by ingredient
 */
export async function searchOpenFoodFacts(
  ingredient: string,
  maxResults = 20,
): Promise<unknown> {
  const url = `${PUBLIC_DATA_SOURCES[5].baseUrl}/cgi/search.pl?search_terms=${encodeURIComponent(
    ingredient,
  )}&search_simple=1&action=process&json=1&page_size=${maxResults}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Open Food Facts error: ${response.status}`);
  }
  return response.json();
}

/**
 * Query UniProt for protein/variant information
 */
export async function queryUniProt(geneSymbol: string): Promise<unknown> {
  const url = `${PUBLIC_DATA_SOURCES[9].baseUrl}/uniprotkb/search?query=gene:${geneSymbol}+AND+organism_id:9606&fields=accession,gene_names,protein_name,function,xref_genename&size=10`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`UniProt API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Query PubChem for compound information
 */
export async function queryPubChem(
  compoundName: string,
): Promise<unknown> {
  const url = `${PUBLIC_DATA_SOURCES[13].baseUrl}/compound/name/${encodeURIComponent(
    compoundName,
  )}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`PubChem API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Get data sources by type
 */
export function getDataSourcesByType(
  type: ExternalDataSource["dataType"],
): ExternalDataSource[] {
  return PUBLIC_DATA_SOURCES.filter((s) => s.dataType === type);
}
