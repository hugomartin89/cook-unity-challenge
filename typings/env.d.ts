declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            DATABASE_URL: string;

            GEOLOCATION_SERVICE_DRIVER: 'ip-api' | 'mock';
            CURRENCY_SERVICE_DRIVER: 'fixer.io' | 'mock';

            FIXER_PLAN?: 'free' | 'paid';
            FIXER_BASE: string;
            FIXER_API_URL: string;
            FIXER_API_KEY: string;
        }
    }
}

export { }
