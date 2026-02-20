'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Tag, Barcode, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { validateUPC } from '@/lib/api/product-api';

interface ManualEntryFormProps {
  initialUPC?: string;
  onSubmit: (data: {
    upc: string;
    name: string;
    brand?: string;
    ingredients: string;
  }) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ManualEntryForm({
  initialUPC = '',
  onSubmit,
  onCancel,
  isLoading = false,
}: ManualEntryFormProps) {
  const [upc, setUPC] = useState(initialUPC);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    const upcValidation = validateUPC(upc);
    if (!upcValidation.valid) {
      newErrors.upc = upcValidation.message || 'Invalid UPC';
    }
    
    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required';
    } else if (ingredients.trim().length < 10) {
      newErrors.ingredients = 'Please enter the complete ingredient list';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    await onSubmit({
      upc: upc.replace(/[^0-9]/g, ''),
      name: name.trim(),
      brand: brand.trim() || undefined,
      ingredients: ingredients.trim(),
    });
  };

  return (
    <motion.form
      data-design-id="manual-entry-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6 p-1"
    >
      <div data-design-id="form-header" className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <h2 data-design-id="form-title" className="text-xl font-bold">Add Product Manually</h2>
        <p data-design-id="form-subtitle" className="text-muted-foreground text-sm mt-1">
          Enter the product details from the label
        </p>
      </div>

      <div data-design-id="form-field-upc" className="space-y-2">
        <Label htmlFor="upc" className="flex items-center gap-2">
          <Barcode className="w-4 h-4" />
          UPC / Barcode
        </Label>
        <Input
          id="upc"
          type="text"
          inputMode="numeric"
          placeholder="Enter 8-14 digit barcode"
          value={upc}
          onChange={(e) => setUPC(e.target.value.replace(/[^0-9]/g, ''))}
          className={errors.upc ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.upc && (
          <p className="text-xs text-red-500">{errors.upc}</p>
        )}
      </div>

      <div data-design-id="form-field-name" className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Product Name *
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="e.g., Organic Whole Wheat Bread"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={errors.name ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      <div data-design-id="form-field-brand" className="space-y-2">
        <Label htmlFor="brand" className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          Brand (Optional)
        </Label>
        <Input
          id="brand"
          type="text"
          placeholder="e.g., Nature's Own"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div data-design-id="form-field-ingredients" className="space-y-2">
        <Label htmlFor="ingredients" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Ingredients *
        </Label>
        <Textarea
          id="ingredients"
          placeholder="Paste or type the ingredients list exactly as shown on the package. Separate ingredients with commas."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className={`min-h-[150px] ${errors.ingredients ? 'border-red-500' : ''}`}
          disabled={isLoading}
        />
        {errors.ingredients ? (
          <p className="text-xs text-red-500">{errors.ingredients}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Include all ingredients, sub-ingredients in parentheses, and any "contains" statements.
          </p>
        )}
      </div>

      <div data-design-id="form-actions" className="flex gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Add & Analyze
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}