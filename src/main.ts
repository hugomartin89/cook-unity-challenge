import express from 'express';
import { InstallStatsModule } from '@stats/StatsModule';
import { InstallTracesModule } from '@tracing/TracingModule';

const App = express();

// production build entry point
if (import.meta.env.PROD) {
    const PORT = process.env.PORT || 8080;

    App.listen(PORT, () => {
        console.debug(`Server is listening on port: ${PORT}`);
    });
}

// global middlewares
App.use(express.json());

// module initialization
InstallStatsModule('/statistics', App);
InstallTracesModule('/traces', App);

export {
    App
}
