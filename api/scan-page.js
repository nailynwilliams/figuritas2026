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
            text: `Esta es una foto de una página del álbum Panini FIFA World Cup 2026.

PASO 1: ¿Qué equipo(s) ves claramente en esta foto? Solo reportá equipos cuyo nombre o bandera se ve EXPLÍCITAMENTE en la imagen. Si no ves claramente el nombre del equipo, no lo incluyas.

PASO 2: Para cada equipo que identificaste con certeza, mirá sus casillas en la foto e identificá cuáles están VACÍAS (se ve el código impreso en el fondo del álbum porque no hay figurita pegada encima).

REGLAS ESTRICTAS:
- Solo reportá el/los equipo(s) que realmente aparece(n) en la foto
- NO inventes ni asumas equipos que no estén visibles
- Una casilla vacía es donde se ve el código impreso (ej: MEX7) sin figurita encima
- Una casilla llena tiene foto del jugador tapando el fondo

Respondé SOLO en este formato (un bloque por equipo visible):
EQUIPO:MEX
VACIAS:MEX7,MEX11,MEX20

Si la página está completamente llena sin casillas vacías:
EQUIPO:MEX
VACIAS:

Si no podés identificar ningún equipo con claridad: NINGUNO`,
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
