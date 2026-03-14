/**
 * Slot schema types - defines what researchers can modify.
 */

export type SlotValueType = 'float' | 'int' | 'enum' | 'boolean';

export type SlotCategory = 
  | 'allocation'
  | 'threshold'
  | 'sizing'
  | 'timing'
  | 'risk'
  | 'regime'
  | 'execution';

export interface SlotRange {
  min: number;
  max: number;
  step?: number;
  enumValues?: string[];
}

export interface SlotDefinition {
  slotId: string;
  description: string;
  valueType: SlotValueType;
  range: SlotRange;
  category: SlotCategory;
  currentValue: null; // ALWAYS null - never expose actual values
}

export interface SlotSchema {
  version: string;
  lastUpdated: number;
  slots: SlotDefinition[];
}

/**
 * Internal slot mapping (PRIVATE - only in behemoth-trader).
 * Maps public slots to internal strategy parameters.
 */
export interface InternalSlotMapping {
  slotId: string;
  internalPath: string;
  transform?: 'direct' | 'inverse' | 'scaled' | 'custom';
  transformParams?: Record<string, unknown>;
}

