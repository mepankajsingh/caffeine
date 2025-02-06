// Unit conversion utilities and state management
import { ref, computed } from 'vue'

const currentUnit = ref<'ml' | 'fl_oz'>('ml')

// Conversion constants
const ML_PER_FL_OZ = 29.5735
const REFERENCE_FL_OZ = 12 // Standard 12 fl oz serving
const REFERENCE_ML = 100 // Standard 100ml reference

export function useUnits() {
  const toggleUnit = () => {
    currentUnit.value = currentUnit.value === 'ml' ? 'fl_oz' : 'ml'
  }

  const formatVolume = (volume: string) => {
    // Extract number and unit from string (e.g., "16 fl oz" or "473 ml")
    const match = volume.match(/(\d+(?:\.\d+)?)\s*(ml|fl\s*oz)/i)
    if (!match) return volume

    const value = parseFloat(match[1])
    const unit = match[2].toLowerCase().replace(/\s+/g, '')

    if (currentUnit.value === 'ml') {
      if (unit === 'floz') {
        return `${Math.round(value * ML_PER_FL_OZ)} ml`
      }
      return `${Math.round(value)} ml`
    } else {
      if (unit === 'ml') {
        return `${(value / ML_PER_FL_OZ).toFixed(1)} fl oz`
      }
      return `${value} fl oz`
    }
  }

  const calculateCaffeinePer100ml = (caffeine: number, servingSize: string) => {
    const match = servingSize.match(/(\d+(?:\.\d+)?)\s*(ml|fl\s*oz)/i)
    if (!match) return null

    const value = parseFloat(match[1])
    const unit = match[2].toLowerCase().replace(/\s+/g, '')

    // First convert serving size to ml
    const volumeInMl = unit === 'floz' ? value * ML_PER_FL_OZ : value
    
    // Calculate caffeine per ml
    const caffeinePerMl = caffeine / volumeInMl
    
    // Return based on current unit
    if (currentUnit.value === 'ml') {
      // For ml, calculate per 100ml
      return Math.round(caffeinePerMl * REFERENCE_ML)
    } else {
      // For fl oz, calculate per 12 fl oz
      return Math.round(caffeinePerMl * (REFERENCE_FL_OZ * ML_PER_FL_OZ))
    }
  }

  return {
    currentUnit: computed(() => currentUnit.value),
    toggleUnit,
    formatVolume,
    calculateCaffeinePer100ml,
    REFERENCE_FL_OZ,
    REFERENCE_ML
  }
}
