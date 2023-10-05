import express from 'express';

const App = express();

// production build entry point
if (import.meta.env.PROD) {
    const PORT = process.env.PORT || 8080;

    App.listen(PORT, () => {
        console.debug(`Server is listening on port: ${PORT}`);
    });
}

export {
    App
}
