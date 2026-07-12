import { describe, it, expect, mock, beforeEach } from "bun:test";
import { 
  normalizeUPC, 
  validateUPC,
  generateMockProduct,
  fetchFromUPCItemDB,
  fetchFromOpenFoodFacts
} from '../src/lib/api/product-api';

describe('Product API', () => {
  describe('normalizeUPC', () => {
    it('should keep 12-digit UPCs unchanged', () => {
      expect(normalizeUPC('012345678905')).toBe('012345678905');
    });

    it('should keep 13-digit EANs unchanged', () => {
      expect(normalizeUPC('5901234123457')).toBe('5901234123457');
    });

    it('should pad short UPCs with leading zeros', () => {
      expect(normalizeUPC('12345678')).toBe('000012345678');
    });

    it('should remove non-numeric characters', () => {
      expect(normalizeUPC('012-345-678905')).toBe('012345678905');
      expect(normalizeUPC('012 345 678905')).toBe('012345678905');
    });

    it('should convert 13-digit starting with 0 to 12-digit', () => {
      expect(normalizeUPC('0012345678905')).toBe('012345678905');
    });
  });

  describe('validateUPC', () => {
    it('should validate correct 12-digit UPCs', () => {
      const result = validateUPC('012345678905');
      expect(result.valid).toBe(true);
    });

    it('should validate correct 13-digit EANs', () => {
      const result = validateUPC('5901234123457');
      expect(result.valid).toBe(true);
    });

    it('should reject empty UPCs', () => {
      const result = validateUPC('');
      expect(result.valid).toBe(false);
      expect(result.message).toBeTruthy();
    });

    it('should reject UPCs shorter than 8 digits', () => {
      const result = validateUPC('1234567');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('8 digits');
    });

    it('should reject UPCs longer than 14 digits', () => {
      const result = validateUPC('123456789012345');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('14 digits');
    });

    it('should accept UPCs with non-numeric characters that get stripped', () => {
      const result = validateUPC('012345678ABC');
      expect(result.valid).toBe(true);
    });

    it('should reject UPCs that are too short after stripping non-numeric', () => {
      const result = validateUPC('ABC1234');
      expect(result.valid).toBe(false);
    });
  });

  describe('generateMockProduct', () => {
    it('should generate a mock product with the provided UPC', () => {
      const upc = '012345678905';
      const product = generateMockProduct(upc);
      
      expect(product.upc).toBe(upc);
      expect(product.name).toBeTruthy();
      expect(product.ingredients).toBeTruthy();
      expect(product.source).toBe('demo');
    });

    it('should include sample ingredients', () => {
      const product = generateMockProduct('012345678905');
      expect(product.ingredients).toContain('Water');
      expect(product.ingredients).toContain('Folic Acid');
    });
  });
});

describe('API Integration Points', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = mock(() => Promise.resolve(new Response()));
    // Mock console.error to keep test output clean
    mock.module('console', () => ({
      error: mock(() => {}),
    }));
    // Alternatively, just spy on it if it's already available
    global.console.error = mock(() => {});
  });

  describe('fetchFromOpenFoodFacts', () => {
    it('should return mapped product on success', async () => {
      const mockData = {
        status: 1,
        product: {
          product_name: 'Test Product',
          brands: 'Test Brand',
          ingredients_text: 'Water, Sugar',
          image_front_url: 'http://example.com/image.jpg'
        },
      };

      global.fetch = mock(() =>
        Promise.resolve(new Response(JSON.stringify(mockData), { status: 200 }))
      );

      const result = await fetchFromOpenFoodFacts('123456789012');
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('Test Product');
      expect(result?.brand).toBe('Test Brand');
      expect(result?.ingredients).toBe('Water, Sugar');
      expect(result?.source).toBe('open_food_facts');
    });

    it('should return null when product not found (status 0)', async () => {
      const mockData = { status: 0 };
      global.fetch = mock(() =>
        Promise.resolve(new Response(JSON.stringify(mockData), { status: 200 }))
      );

      const result = await fetchFromOpenFoodFacts('123456789012');
      expect(result).toBeNull();
    });

    it('should return null on non-200 response', async () => {
      global.fetch = mock(() =>
        Promise.resolve(new Response(null, { status: 404 }))
      );

      const result = await fetchFromOpenFoodFacts('123456789012');
      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      global.fetch = mock(() => Promise.reject(new Error('Network error')));

      const result = await fetchFromOpenFoodFacts('123456789012');
      expect(result).toBeNull();
    });
  });

  describe('fetchFromUPCItemDB', () => {
    it('should return mapped product on success', async () => {
      const mockData = {
        items: [{
          title: 'UPC Product',
          brand: 'UPC Brand',
          description: 'Ingredients list',
          images: ['http://example.com/upc.jpg']
        }]
      };

      global.fetch = mock(() =>
        Promise.resolve(new Response(JSON.stringify(mockData), { status: 200 }))
      );

      const result = await fetchFromUPCItemDB('123456789012');
      
      expect(result).not.toBeNull();
      expect(result?.name).toBe('UPC Product');
      expect(result?.brand).toBe('UPC Brand');
      expect(result?.ingredients).toBe('Ingredients list');
      expect(result?.source).toBe('upc_item_db');
    });

    it('should return null when no items found', async () => {
      const mockData = { items: [] };
      global.fetch = mock(() =>
        Promise.resolve(new Response(JSON.stringify(mockData), { status: 200 }))
      );

      const result = await fetchFromUPCItemDB('123456789012');
      expect(result).toBeNull();
    });

    it('should return null on non-200 response', async () => {
      global.fetch = mock(() =>
        Promise.resolve(new Response(null, { status: 429 }))
      );

      const result = await fetchFromUPCItemDB('123456789012');
      expect(result).toBeNull();
    });

    it('should return null on fetch error', async () => {
      global.fetch = mock(() => Promise.reject(new Error('Network error')));

      const result = await fetchFromUPCItemDB('123456789012');
      expect(result).toBeNull();
    });
  });
});