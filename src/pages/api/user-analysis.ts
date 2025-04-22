
import type { NextApiRequest, NextApiResponse } from 'next';

// This simulates an API handler for n8n. In Vite (SPA) this file serves as a placeholder for illustration!
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // You'd forward this data to n8n or process as needed.
    // Here we just simulate and return a OK
    return res.status(200).json({ status: "received" });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
