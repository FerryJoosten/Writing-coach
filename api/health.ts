export default function handler(_req: any, res: any) {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    '';

  res.status(200).json({
    status: 'ok',
    geminiKeyConfigured: !!key,
    keyPreview: key ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : 'NIET_INGESTELD',
    message: key
      ? 'API is operationeel en gekoppeld aan Gemini.'
      : 'Geen GEMINI_API_KEY gevonden in Vercel. Voeg de variabele toe in je Vercel Dashboard (Settings > Environment Variables) en klik op Redeploy.',
  });
}
