import { TEAMS, stickerKey } from '../src/data/album.js';

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

Tu tarea: identificar las casillas VACÍAS (donde NO hay figurita pegada y se ve el código impreso en el fondo del álbum, como MEX7, MEX11, MEX20).

Las casillas que SÍ tienen figurita pegada muestran la foto del jugador tapando el fondo — esas NO las listes.

Lógica de uso: si el equipo tiene 20 casillas y las vacías son MEX7, MEX11 y MEX20, entonces el usuario tiene las otras 17 figuritas de ese equipo.

Equipos posibles: FWC (figuritas 00-19), y todos estos con figuritas 1-20: MEX, RSA, KOR, CZE, CAN, BIH, QAT, SUI, BRA, MAR, HAI, SCO, USA, PAR, AUS, TUR, GER, CUW, CIV, ECU, NED, JPN, SWE, TUN, BEL, EGY, IRN, NZL, ESP, CPV, KSA, URU, FRA, SEN, IRQ, NOR, ARG, ALG, AUT, JOR, POR, COD, UZB, COL, ENG, CRO, GHA, PAN.

Respondé en este formato exacto (un bloque por equipo):
EQUIPO:MEX
VACIAS:MEX7,MEX11,MEX20

Si hay varios equipos en la foto, repetí el bloque:
EQUIPO:MEX
VACIAS:MEX7,MEX11,MEX20
EQUIPO:BRA
VACIAS:BRA3,BRA15

Si una página de equipo está completamente llena, ponés VACIAS: (vacío).
Si no podés identificar nada con claridad, respondé: NINGUNO`,
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

  if (text === 'NINGUNO') return res.json({ owned: [], empty: [] });

  // Parse response blocks
  const owned = [];
  const empty = [];

  const blocks = text.split(/EQUIPO:/g).filter(b => b.trim());
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const teamCode = lines[0].trim();
    const team = TEAMS[teamCode];
    if (!team) continue;

    const vaciaLine = lines.find(l => l.startsWith('VACIAS:'));
    const vaciasRaw = vaciaLine ? vaciaLine.replace('VACIAS:', '').trim() : '';
    const emptySet = new Set(
      vaciasRaw ? vaciasRaw.split(',').map(c => c.trim().toUpperCase()).filter(Boolean) : []
    );

    // Mark empties
    emptySet.forEach(c => empty.push(c));

    // By subtraction: all stickers NOT in emptySet are owned
    for (const s of team.stickers) {
      const key = stickerKey(teamCode, s.num);
      if (!emptySet.has(key)) owned.push(key);
    }
  }

  return res.json({ owned, empty });
}
