export const MODEL_ENERGY_ESTIMATES: Record<string, { energyPerResponse_kWh: number; approxPer1KToken_kWh: number }> = {
    "GPT-3": { energyPerResponse_kWh: 0.0003, approxPer1KToken_kWh: 0.0003 },
    "GPT-4": { energyPerResponse_kWh: 0.0005, approxPer1KToken_kWh: 0.0005 },
    "Gemini": { energyPerResponse_kWh: 0.00024, approxPer1KToken_kWh: 0.00048 },
    "LLaMA3_small": { energyPerResponse_kWh: 0.0000317, approxPer1KToken_kWh: 0.0000317 },
    "LLaMA3_large": { energyPerResponse_kWh: 0.001861, approxPer1KToken_kWh: 0.001861 },
    "GPT-4o": { energyPerResponse_kWh: 0.00043, approxPer1KToken_kWh: 0.00043 }
};

export const PROJECTS = [
    { id: 'project-a', name: 'Alpha-Gen', usage: 'heavy', model: 'GPT-4' },
    { id: 'project-b', name: 'Beta-Bot', usage: 'medium', model: 'GPT-3' },
    { id: 'project-c', name: 'Gamma-Lite', usage: 'low', model: 'LLaMA3_small' },
    { id: 'project-d', name: 'Delta-Experimental', usage: 'very-low', model: 'Gemini' },
];

export const REGIONS = [
    { id: 'us-east-1', name: 'US East (N. Virginia)', carbonIntensity: 367 }, // gCO2/kWh
    { id: 'eu-west-1', name: 'EU West (Ireland)', carbonIntensity: 289 },
    { id: 'eu-north-1', name: 'EU North (Stockholm)', carbonIntensity: 12 }, // Very green
    { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', carbonIntensity: 725 },
];
