'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, AlertTriangle, ChevronDown, Info } from 'lucide-react';
import type { ProductIngredient, SafetyStatus, RiskLevel } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface IngredientListProps {
  ingredients: ProductIngredient[];
  showProvenance?: boolean;
}

const statusConfig: Record<SafetyStatus, {
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
  label: string;
}> = {
  safe: {
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    label: 'Safe',
  },
  unsafe: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    label: 'Unsafe',
  },
  unknown: {
    icon: HelpCircle,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    label: 'Unknown',
  },
};

const riskConfig: Record<RiskLevel, {
  color: string;
  label: string;
}> = {
  high: { color: 'bg-red-500', label: 'High Risk' },
  medium: { color: 'bg-amber-500', label: 'Medium Risk' },
  low: { color: 'bg-blue-500', label: 'Low Risk' },
};

function IngredientItem({ 
  ingredient, 
  index,
  showProvenance = false,
}: { 
  ingredient: ProductIngredient; 
  index: number;
  showProvenance?: boolean;
}) {
  const config = statusConfig[ingredient.safetyStatus];
  const StatusIcon = config.icon;
  const hasDetails = ingredient.safetyReason || ingredient.maskingReason || ingredient.subIngredients?.length;

  if (!hasDetails) {
    return (
      <motion.div
        data-design-id={`ingredient-item-${index}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className={cn(
          "flex items-center justify-between p-3 rounded-xl border",
          config.bgColor,
          "border-transparent"
        )}
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={cn("w-5 h-5 flex-shrink-0", config.color)} />
          <div>
            <span className="font-medium">{ingredient.canonicalName}</span>
            {ingredient.originalText.toLowerCase() !== ingredient.canonicalName.toLowerCase() && (
              <span className="text-xs text-muted-foreground ml-2">
                ({ingredient.originalText})
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {ingredient.isMasking && ingredient.maskingRiskLevel && (
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] px-1.5",
                riskConfig[ingredient.maskingRiskLevel].color,
                "text-white border-0"
              )}
            >
              <AlertTriangle className="w-3 h-3 mr-0.5" />
              Masking
            </Badge>
          )}
          
          {showProvenance && (
            <Badge variant="outline" className="text-[10px]">
              {ingredient.sourceProvenance}
            </Badge>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      data-design-id={`ingredient-accordion-${index}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value={`ing-${index}`} className="border-0">
          <AccordionTrigger 
            className={cn(
              "p-3 rounded-xl border hover:no-underline",
              config.bgColor,
              "border-transparent hover:border-border/50"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <StatusIcon className={cn("w-5 h-5 flex-shrink-0", config.color)} />
              <div className="text-left">
                <span className="font-medium">{ingredient.canonicalName}</span>
                {ingredient.originalText.toLowerCase() !== ingredient.canonicalName.toLowerCase() && (
                  <span className="text-xs text-muted-foreground ml-2">
                    ({ingredient.originalText})
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 mr-2">
              {ingredient.isMasking && ingredient.maskingRiskLevel && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] px-1.5",
                    riskConfig[ingredient.maskingRiskLevel].color,
                    "text-white border-0"
                  )}
                >
                  <AlertTriangle className="w-3 h-3 mr-0.5" />
                  Masking
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          
          <AccordionContent className="px-3 pt-2 pb-3">
            <div className="space-y-3 pl-8">
              {ingredient.safetyReason && (
                <div data-design-id={`safety-reason-${index}`} className="flex items-start gap-2 text-sm">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{ingredient.safetyReason}</p>
                </div>
              )}
              
              {ingredient.isMasking && ingredient.maskingReason && (
                <div data-design-id={`masking-reason-${index}`} className="flex items-start gap-2 text-sm bg-violet-50 dark:bg-violet-950/30 rounded-lg p-2">
                  <AlertTriangle className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                  <p className="text-violet-700 dark:text-violet-300">{ingredient.maskingReason}</p>
                </div>
              )}
              
              {ingredient.subIngredients && ingredient.subIngredients.length > 0 && (
                <div data-design-id={`sub-ingredients-${index}`} className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Sub-ingredients:</p>
                  <div className="space-y-1.5 pl-2 border-l-2 border-muted">
                    {ingredient.subIngredients.map((sub, subIndex) => {
                      const subConfig = statusConfig[sub.safetyStatus];
                      const SubIcon = subConfig.icon;
                      return (
                        <div
                          key={subIndex}
                          data-design-id={`sub-ingredient-${index}-${subIndex}`}
                          className="flex items-center gap-2 text-sm"
                        >
                          <SubIcon className={cn("w-4 h-4", subConfig.color)} />
                          <span>{sub.canonicalName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div data-design-id={`confidence-${index}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Confidence: {Math.round(ingredient.confidence * 100)}%</span>
                {showProvenance && (
                  <>
                    <span>•</span>
                    <span>Source: {ingredient.sourceProvenance}</span>
                  </>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}

export function IngredientList({ ingredients, showProvenance = false }: IngredientListProps) {
  const sortedIngredients = [...ingredients].sort((a, b) => {
    const priority = { unsafe: 0, unknown: 1, safe: 2 };
    return priority[a.safetyStatus] - priority[b.safetyStatus];
  });

  return (
    <TooltipProvider>
      <div data-design-id="ingredient-list" className="space-y-2">
        <div data-design-id="ingredient-list-header" className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Ingredients ({ingredients.length})</h3>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Safe
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              Unknown
            </span>
            <span className="flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-red-500" />
              Unsafe
            </span>
          </div>
        </div>
        
        <div className="space-y-1.5">
          {sortedIngredients.map((ingredient, index) => (
            <IngredientItem
              key={index}
              ingredient={ingredient}
              index={index}
              showProvenance={showProvenance}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}