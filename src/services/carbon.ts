import { MODEL_ENERGY_ESTIMATES } from '@/utils/constants';

export class CarbonService {
    /**
     * Calculate Energy (kWh) and CO2 (g) for a given usage
     */
    static calculateImpact(modelName: string, tokens: number, regionIntensity: number = 475) {
        // Default global avg intensity ~475 gCO2/kWh if unknown

        const estimates = MODEL_ENERGY_ESTIMATES[modelName] || MODEL_ENERGY_ESTIMATES['GPT-3']; // Fallback

        // Estimate energy: (tokens / 1000) * kWh_per_1k
        const energykWh = (tokens / 1000) * estimates.approxPer1KToken_kWh;

        // Emissions: energy (kWh) * intensity (gCO2/kWh)
        const co2Grams = energykWh * regionIntensity;

        return {
            energykWh,
            co2Grams
        };
    }

    static getRating(co2Grams: number): string {
        if (co2Grams < 10) return 'A';
        if (co2Grams < 50) return 'B';
        if (co2Grams < 100) return 'C';
        if (co2Grams < 500) return 'D';
        return 'E';
    }
}
