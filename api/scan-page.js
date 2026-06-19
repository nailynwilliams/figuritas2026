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
            text: `Esta es una foto de una o más páginas del álbum Panini FIFA World Cup 2026.

IMPORTANTE: El álbum tiene casillas impresas que muestran el código (ej: MEX1, BRA14) aunque no tengan figurita pegada. NO me interesa esas casillas vacías.

Solo me interesan las casillas que tienen una FIGURITA PEGADA ENCIMA, es decir, donde se ve la foto del jugador, el escudo, o la imagen de la figurita real (no el fondo impreso del álbum).

Para cada figurita pegada que veas, identificá su código usando:
- El número/código impreso EN LA PROPIA FIGURITA (muchas lo tienen en la esquina o al pie)
- El nombre del jugador y el equipo/bandera visible en la figurita
- Los equipos posibles: FWC, MEX, RSA, KOR, CZE, CAN, BIH, QAT, SUI, BRA, MAR, HAI, SCO, USA, PAR, AUS, TUR, GER, CUW, CIV, ECU, NED, JPN, SWE, TUN, BEL, EGY, IRN, NZL, ESP, CPV, KSA, URU, FRA, SEN, IRQ, NOR, ARG, ALG, AUT, JOR, POR, COD, UZB, COL, ENG, CRO, GHA, PAN
- Cada equipo tiene figuritas del 1 al 20. FWC va del 00 al 19.

Respondé SOLO con los códigos de las figuritas PEGADAS, separados por comas. Sin explicación. Ejemplo: BRA1,BRA14,ARG3
Si no hay ninguna figurita pegada visible, respondé: NINGUNO`,
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
