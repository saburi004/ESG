import { REGIONS } from '@/utils/constants';

interface EmberData {
    entity: string;
    year: number;
    data: number; // gCO2/kWh
}

export class EmberService {
    private static BASE_URL = 'https://api.ember-climate.org/v1';

    /**
     * Fetch carbon intensity for a specific region (country code).
     * Note: Ember uses Country Codes (e.g., USA, IRL, SWE, IND).
     * We need to map AWS Regions to Ember Entity Codes.
     */
    static async getCarbonIntensity(regionId: string): Promise<number | null> {
        const apiKey = process.env.EMBER_API_KEY;
        if (!apiKey) {
            console.warn('EMBER_API_KEY missing. Using fallback.');
            return null;
        }

        const entityCode = this.mapRegionToEntity(regionId);
        if (!entityCode) return null;

        try {
            // Fetch latest yearly data (more stable)
            // Endpoint typically requires &api_key=... or Header
            const url = `${this.BASE_URL}/carbon-intensity/yearly?entity=${entityCode}&min_year=2023&api_key=${apiKey}`;

            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Ember API Failed: ${res.status} ${res.statusText}`);
                return null; // Fallback
            }

            const json = await res.json();
            // Assuming response format [ { entity: 'USA', year: 2023, value: 367, ... } ]
            // Adjust based on actual response structure if needed. 
            // Based on typical Ember extraction:
            if (Array.isArray(json) && json.length > 0) {
                // Return the latest year's value
                const latest = json[json.length - 1];
                return latest.value || latest.data;
            }

            return null;
        } catch (error) {
            console.error('Ember Service Error:', error);
            return null;
        }
    }

    private static mapRegionToEntity(regionId: string): string | null {
        // AWS Region -> Ember/ISO Country Code
        const map: Record<string, string> = {
            'us-east-1': 'USA', // United States
            'eu-west-1': 'IRL', // Ireland
            'eu-north-1': 'SWE', // Sweden
            'ap-south-1': 'IND', // India
        };
        return map[regionId] || null;
    }
}
