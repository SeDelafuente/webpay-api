import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import webpayRoutes from './routes/webpay.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/api/webpay', webpayRoutes);
// index.ts (add these lines)
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err.message);
    console.error(err.stack); // Print stack trace for more details
    process.exit(1); // Exit with a non-zero code to indicate an error
});
// Add global unhandled rejection/exception handlers (good practice)
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    console.error(err.stack);
    process.exit(1);
});
