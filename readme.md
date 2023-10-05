# CookUnity Challenge

You can see the challenge [here](docs/excersice.pdf)

> Disclaimer: [fixer.io](https://fixer.io/#pricing_plan) limit the base for conversion on free plans. So, this project was developed using EUR as base for conversions

## Architecture

This project uses a modular architecture and event communication using a simple EventBus.

The general idea is that calls to external services will be cached using Redis because the general data does not change frequently [1].

In conclusion, the event system listens when an IP trace is recorded and at that time computes and caches it for the `/statistics` service. Therefore, each call to `/traces` with a new IP address fires the event.

[1]. A trace is assumed to be new for each new IP. That is, two calls with the same IP will not compute two traces

## Hacking

This projects uses [fixer.io](https://fixer.io) and [ip-api.com](https://ip-api.com) as external services dependencies. Fixer is a paid service but provides a free plan, so you need to get your API KEY.

Anyways the project implements two limited mock services for both external dependencies.

If you use these mocks you're limited to IPs and currencies but can be used for free testing.

### Dependencies

```
- NodeJS >= 18
- NPM >= 8
- Redis >= 7
- Postgresql >= 15
```

### Prepare app

```bash
cp env.example .env
```
### Running the app

#### Natively

```bash
# install dependencies
npm install

# execute migrations
npm run migrations

# run in dev mode on port 3000
npm run dev
```

> Don't forget to configure your `.env` file with your credentials.

#### With Docker

Rise up the application and all their dependencies
```bash
docker-compose up -d --build
```

### Testing

```bash
npm test
```
## Documentation

* [The excercise file](docs/excercise.pdf) documents the requirements for the implemented API.

### Mocks

```
# CURRENCY_SERVICE_DRIVER="mock" driver dataset

{ iso: "ARS", symbol: "$", conversion_rate: 366.56184 },
{ iso: "CAD", symbol: "$", conversion_rate: 1.444327 },
{ iso: "USD", symbol: "$", conversion_rate: 1.04725 },
{ iso: 'AUD', symbol: '$', conversion_rate: 1.660296 },
{ iso: 'EUR', symbol: '€', conversion_rate: 1 },
{ iso: 'GBP', symbol: '£', conversion_rate: 0.865194 },
```

```
# GEOLOCATION_SERVICE_DRIVER="mock" driver dataset

{
    ip: '1.1.1.1',
    name: 'Australia',
    code: 'AU',
    lat: -33.494,
    lon: 143.2104,
    currency: 'AUD',
},
{
    ip: '8.8.8.8',
    name: 'United States',
    code: 'US',
    lat: 37.751,
    lon: -97.822,
    currency: 'USD',
},
{
    ip: '190.191.237.90',
    name: 'Argentina',
    code: 'AR',
    lat: -36,
    lon: -59.9964,
    currency: 'ARS',
},
{
    ip: '115.240.90.163',
    name: 'India',
    code: 'IN',
    lat: 23.3426,
    lon: 85.3099,
    currency: 'INR',
},
{
    ip: '8.14.232.132',
    name: 'Mexico',
    code: 'MX',
    lat: 19.3574,
    lon: -99.2752,
    currency: 'MXN',
}
```
