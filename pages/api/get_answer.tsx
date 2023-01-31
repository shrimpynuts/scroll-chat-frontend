import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { question } = req.body;

    const backendEndpoint =
      "https://scroll-chat-backend.vercel.app/api/get_answer";

    const result = await fetch(backendEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: question }),
    });

    return res.status(200).json(await result.json());
  } else {
    return res.status(400).json({ error: "Must be POST request." });
  }
}
