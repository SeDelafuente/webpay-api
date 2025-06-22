import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const router: Router = Router();

const TBK_API_KEY_ID = process.env.TBK_API_KEY_ID;
const TBK_API_KEY_SECRET = process.env.TBK_API_KEY_SECRET;
const BASE_URL = process.env.WEBPAY_API_URL;
const RETURN_URL = process.env.RETURN_URL;

router.get('/redirect', (req, res) => {
  console.log('🟢 GET /redirect recibida con query:', req.query);
  const token = req.query.token_ws as string;
  const uri = `${process.env.APP_SCHEME}://${process.env.APP_HOST}?token_ws=${encodeURIComponent(token)}`;
  console.log('🟢 Redirigiendo a URI:', uri);
  return res.redirect(uri);
});

router.post('/create', async (req: Request, res: Response) => {
  try {
    const { buy_order, session_id, amount } = req.body;

    console.log("URL Webpay:", `${BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`);


    const response = await axios.post(
      `${BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`,
      {
        buy_order,
        session_id,
        amount,
        return_url: RETURN_URL,
      },
      {
        headers: {
          'Tbk-Api-Key-Id': TBK_API_KEY_ID,
          'Tbk-Api-Key-Secret': TBK_API_KEY_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data || error.message);
    } else {
      console.error((error as Error).message);
    }
    res.status(500).json({ error: 'Error creando transacción' });
  }
});

router.post('/commit', async (req: Request, res: Response) => {
  try {
    const { token_ws } = req.body;

    const response = await axios.put(
      `${BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`,
      {},
      {
        headers: {
          'Tbk-Api-Key-Id': TBK_API_KEY_ID,
          'Tbk-Api-Key-Secret': TBK_API_KEY_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error: unknown) {
    let status = 500;
    let data: any = { error: (error as Error).message };
    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      data = error.response?.data || { error: error.message };
      console.error('Error confirmando transacción:', data);
    } else {
      console.error('Error confirmando transacción:', (error as Error).message);
    }
    res.status(status).json({ error: 'Error confirmando transacción', details: data });
  }
});

router.get('/status/:token', async (req: Request, res: Response) => {
  try {
    const token = req.params.token;

    const response = await axios.get(
      `${BASE_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
      {
        headers: {
          'Tbk-Api-Key-Id': TBK_API_KEY_ID,
          'Tbk-Api-Key-Secret': TBK_API_KEY_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error: unknown) {
    let status = 500;
    let data: any = { error: (error as Error).message };
    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      data = error.response?.data || { error: error.message };
      console.error('Error consultando estado:', data);
    } else {
      console.error('Error consultando estado:', (error as Error).message);
    }
    res.status(status).json({ error: 'Error consultando estado', details: data });
  }
});

router.post(
  '/redirect',
  (req: Request, res: Response) => {
    const { token_ws } = req.body;
    const uri = `${process.env.APP_SCHEME}://${process.env.APP_HOST}`
              + `?token_ws=${encodeURIComponent(token_ws)}`;
    return res.redirect(uri);
  }
);



export default router;