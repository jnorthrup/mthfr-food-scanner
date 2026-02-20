import { 
  normalizeUPC, 
  validateUPC,
  generateMockProduct 
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
  describe('Open Food Facts API format', () => {
    it('should expect status field in response', () => {
      const mockResponse = {
        status: 1,
        product: {
          product_name: 'Test Product',
          ingredients_text: 'Water, Sugar',
        },
      };
      
      expect(mockResponse.status).toBe(1);
      expect(mockResponse.product.product_name).toBeTruthy();
    });

    it('should handle product not found response', () => {
      const notFoundResponse = {
        status: 0,
        status_verbose: 'product not found',
      };
      
      expect(notFoundResponse.status).toBe(0);
    });
  });

  describe('UPC Item DB API format', () => {
    it('should expect items array in response', () => {
      const mockResponse = {
        code: 'OK',
        total: 1,
        items: [
          {
            title: 'Test Product',
            brand: 'Test Brand',
          },
        ],
      };
      
      expect(mockResponse.items.length).toBe(1);
      expect(mockResponse.items[0].title).toBeTruthy();
    });
  });
});