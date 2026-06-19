export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { image } = req.body;
  if (!image) return res.status(400).json({ error: 'No image' });

  const base64 = image.replace(/^data:image\/\w+;base64,/, '');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
          },
          {
            type: 'text',
            text: `Mirá esta foto de una página del álbum Panini FIFA World Cup 2026.

Las casillas VACÍAS (sin figurita pegada) tienen un código impreso visible como MEX7, BRA14, ARG3, etc.
Las casillas LLENAS tienen foto del jugador encima y no se ve el código del fondo.

Tu única tarea: leé y listá SOLO los códigos que ves impresos en casillas vacías. Nada más.

Reglas:
- Solo escribí códigos que realmente leés en la imagen
- No inventes ni deduzcas códigos que no ves claramente
- El formato es: 2-4 letras mayúsculas + 1-3 números (ej: MEX7, BRA14, FWC3)

Respondé SOLO con los códigos separados por comas. Si no leés ninguno claramente, escribí: NINGUNO`,
          },
        ],
      }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return res.status(500).json({ error: err });
  }

  const data = await response.json();
  const text = data.content[0].text.trim();

  if (text === 'NINGUNO') return res.json({ missing: [] });

  const missing = text
    .split(',')
    .map(c => c.trim().toUpperCase())
    .filter(c => /^[A-Z]{2,4}\d{1,3}$/.test(c));

  return res.json({ missing });
}
