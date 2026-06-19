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
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
          },
          {
            type: 'text',
            text: `Esta es una foto de páginas del álbum Panini FIFA World Cup 2026.
Identificá todos los códigos de figuritas visibles. Los códigos tienen el formato: 2-4 letras mayúsculas seguidas de 1-3 números. Ejemplos: BRA14, ARG3, MEX11, FWC1, FWC00, CUW5, ESP20.
Los equipos posibles son: FWC, MEX, RSA, KOR, CZE, CAN, BIH, QAT, SUI, BRA, MAR, HAI, SCO, USA, PAR, AUS, TUR, GER, CUW, CIV, ECU, NED, JPN, SWE, TUN, BEL, EGY, IRN, NZL, ESP, CPV, KSA, URU, FRA, SEN, IRQ, NOR, ARG, ALG, AUT, JOR, POR, COD, UZB, COL, ENG, CRO, GHA, PAN.
Cada equipo tiene figuritas del 1 al 20. FWC va del 00 al 19.
Respondé SOLO con una lista de códigos separados por comas, sin explicación. Ejemplo: BRA1,BRA2,BRA14,ARG3
Si no ves ningún código claro, respondé con: NINGUNO`,
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

  if (text === 'NINGUNO') return res.json({ codes: [] });

  const codes = text.split(',').map(c => c.trim().toUpperCase()).filter(c => /^[A-Z]{2,4}\d{1,3}$/.test(c));
  return res.json({ codes });
}
