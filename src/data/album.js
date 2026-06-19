// Panini FIFA World Cup 2026 - Album completo
// Total: 980 figuritas | 68 brillantes
// FWC: 20 brillantes (FWC00 + FWC1–FWC19)
// 48 selecciones × 20 figuritas = 960  →  sticker #1 siempre es el escudo brillante
// Total: 20 + 960 = 980 ✓  |  Brillantes: 20 + 48 = 68 ✓
//
// Equipos con numeración con cero: CUW (01-20) y JPN (01-20)

function team(name, flag, color, group, players) {
  return {
    name, flag, color, group,
    stickers: [
      { num: 1,  type: 'brillo',  label: 'Escudo ⭐' },
      { num: 2,  type: 'grupo',   label: `Panel Grupo ${group}` },
      ...players.map((p, i) => ({ num: i + 3, type: 'jugador', label: p })),
    ],
  };
}

// Genera la clave pública de una figurita
export function stickerKey(code, num) {
  if (code === 'FWC' && num === 0) return 'FWC00';
  return `${code}${num}`;
}

export const TEAMS = {

  // ══════════════════════════════════
  // ESPECIALES — FWC00 a FWC19
  // ══════════════════════════════════
  FWC: {
    name: 'Especiales',
    flag: '🏆',
    color: '#f59e0b',
    padded: false,
    stickers: [
      { num: 0,  type: 'brillo', label: 'Copa del Mundo FIFA ⭐' },
      { num: 1,  type: 'brillo', label: 'Balón oficial Adidas 2026 ⭐' },
      { num: 2,  type: 'brillo', label: 'Alemania Occ. campeón 1954 ⭐' },
      { num: 3,  type: 'brillo', label: 'Brasil campeón 1958 ⭐' },
      { num: 4,  type: 'brillo', label: 'Brasil campeón 1962 ⭐' },
      { num: 5,  type: 'brillo', label: 'Inglaterra campeón 1966 ⭐' },
      { num: 6,  type: 'brillo', label: 'Brasil campeón 1970 ⭐' },
      { num: 7,  type: 'brillo', label: 'Alemania Occ. campeón 1974 ⭐' },
      { num: 8,  type: 'brillo', label: 'Argentina campeón 1978 ⭐' },
      { num: 9,  type: 'brillo', label: 'Italia campeón 1982 ⭐' },
      { num: 10, type: 'brillo', label: 'Argentina campeón 1986 ⭐' },
      { num: 11, type: 'brillo', label: 'Alemania campeón 1990 ⭐' },
      { num: 12, type: 'brillo', label: 'Brasil campeón 1994 ⭐' },
      { num: 13, type: 'brillo', label: 'Francia campeón 1998 ⭐' },
      { num: 14, type: 'brillo', label: 'Brasil campeón 2002 ⭐' },
      { num: 15, type: 'brillo', label: 'Italia campeón 2006 ⭐' },
      { num: 16, type: 'brillo', label: 'España campeón 2010 ⭐' },
      { num: 17, type: 'brillo', label: 'Alemania campeón 2014 ⭐' },
      { num: 18, type: 'brillo', label: 'Francia campeón 2018 ⭐' },
      { num: 19, type: 'brillo', label: 'Argentina campeón 2022 ⭐' },
    ],
  },

  // ══════════════════════════════════
  // GRUPO A
  // ══════════════════════════════════
  MEX: team('México', '🇲🇽', '#006847', 'A', [
    'Guillermo Ochoa', 'Jorge Sánchez', 'César Montes', 'Johan Vásquez',
    'Jesús Gallardo', 'Edson Álvarez', 'Héctor Herrera', 'Carlos Rodríguez',
    'Hirving Lozano', 'Raúl Jiménez', 'Henry Martín', 'Alexis Vega',
    'Santiago Giménez', 'Roberto Alvarado', 'Orbelin Pineda', 'Luis Romo',
    'Uriel Antuna', 'Rodolfo Pizarro',
  ]),

  RSA: team('Sudáfrica', '🇿🇦', '#007A4D', 'A', [
    'Ronwen Williams', 'Nyiko Mobbie', 'Mothobi Mvala', 'Rushine De Reuck',
    'Sifiso Hlanti', 'Teboho Mokoena', 'Ethan Ntsontso', 'Themba Zwane',
    'Percy Tau', 'Lyle Foster', 'Evidence Makgopa', 'Relebohile Mofokeng',
    'Bongani Zungu', 'Yusuf Maart', 'Khuliso Mudau', 'Grant Kekana',
    'Bradley Grobler', 'Kobamelo Kodisang',
  ]),

  KOR: team('Corea del Sur', '🇰🇷', '#C60C30', 'A', [
    'Kim Seung-gyu', 'Kim Moon-hwan', 'Kim Min-jae', 'Jung Seung-hyun',
    'Kim Jin-su', 'Jung Woo-young', 'Lee Jae-sung', 'Hwang In-beom',
    'Son Heung-min', 'Hwang Hee-chan', 'Cho Gue-sung', 'Lee Kang-in',
    'Oh Hyeon-gyu', 'Kwon Chang-hoon', 'Na Sang-ho', 'Paik Seung-ho',
    'Kim Tae-hwan', 'Seol Young-woo',
  ]),

  CZE: team('Chequia', '🇨🇿', '#D7141A', 'A', [
    'Jiří Staněk', 'Vladimír Coufal', 'Tomáš Holeš', 'Jakub Brabec',
    'Jan Bořil', 'Tomáš Souček', 'Alex Král', 'Lukáš Provod',
    'Ondřej Lingr', 'Patrik Schick', 'Adam Hložek', 'Tomáš Chorý',
    'Antonín Barák', 'David Jurásek', 'Jakub Pešek', 'Jan Kuchta',
    'Martin Vitík', 'Matěj Jurásek',
  ]),

  // ══════════════════════════════════
  // GRUPO B
  // ══════════════════════════════════
  CAN: team('Canadá', '🇨🇦', '#FF0000', 'B', [
    'Maxime Crépeau', 'Alistair Johnston', 'Kamal Miller', 'Moise Bombito',
    'Samuel Adekugbe', 'Stephen Eustáquio', 'Jonathan Osorio', 'Mark-Anthony Kaye',
    'Alphonso Davies', 'Jonathan David', 'Tajon Buchanan', 'Cyle Larin',
    'Richie Laryea', 'Derek Cornelius', 'Liam Millar', 'Ismael Koné',
    'Jacen Russell-Rowe', 'Milan Borjan',
  ]),

  BIH: team('Bosnia y Herzegovina', '🇧🇦', '#002395', 'B', [
    'Ibrahim Šehić', 'Sead Kolašinac', 'Anel Ahmedhodžić', 'Dario Šutalo',
    'Haris Hajradinović', 'Miralem Pjanić', 'Dženan Pejčinović', 'Amar Dedić',
    'Edin Džeko', 'Ermedin Demirović', 'Benjamin Šeško', 'Amer Gojak',
    'Strahinja Pavlović', 'Nikola Stanković', 'Ermin Bičakčić', 'Rusmir Šabanadžović',
    'Smail Prevljak', 'Jusuf Gazibegović',
  ]),

  QAT: team('Qatar', '🇶🇦', '#8D153A', 'B', [
    'Meshaal Barsham', 'Pedro Miguel', 'Boualem Khoukhi', 'Bassam Al-Rawi',
    'Homam Ahmed', 'Karim Boudiaf', 'Abdelaziz Hatim', 'Akram Afif',
    'Almoez Ali', 'Hassan Al-Haydos', 'Ismail Mohamad', 'Ahmed Alaaeldin',
    'Assim Madibo', 'Yusuf Abdurisag', 'Abdulaziz Hatem', 'Salem Al-Hajri',
    'Ahmed Suhail', 'Mohammed Muntari',
  ]),

  SUI: team('Suiza', '🇨🇭', '#FF0000', 'B', [
    'Yann Sommer', 'Silvan Widmer', 'Manuel Akanji', 'Nico Elvedi',
    'Ricardo Rodríguez', 'Granit Xhaka', 'Remo Freuler', 'Xherdan Shaqiri',
    'Haris Seferović', 'Breel Embolo', 'Ruben Vargas', 'Fabian Rieder',
    'Dan Ndoye', 'Michel Aebischer', 'Edimilson Fernandes', 'Christian Fassnacht',
    'Zeki Amdouni', 'Gregor Kobel',
  ]),

  // ══════════════════════════════════
  // GRUPO C
  // ══════════════════════════════════
  BRA: team('Brasil', '🇧🇷', '#009C3B', 'C', [
    'Alisson Becker', 'Danilo', 'Marquinhos', 'Gabriel Magalhães',
    'Alex Telles', 'Casemiro', 'Lucas Paquetá', 'Bruno Guimarães',
    'Raphinha', 'Neymar Jr.', 'Vinicius Jr.', 'Richarlison',
    'Rodrygo', 'Endrick', 'Gabriel Martinelli', 'Éder Militão',
    'Antony', 'Gabriel Jesus',
  ]),

  MAR: team('Marruecos', '🇲🇦', '#006233', 'C', [
    'Yassine Bounou', 'Achraf Hakimi', 'Romain Saïss', 'Nayef Aguerd',
    'Noussair Mazraoui', 'Azzedine Ounahi', 'Sofyan Amrabat', 'Selim Amallah',
    'Hakim Ziyech', 'Youssef En-Nesyri', 'Sofiane Boufal', 'Abde Ezzalzouli',
    'Bilal El Khannous', 'Brahim Díaz', 'Anass Zaroury', 'Zakaria Aboukhlal',
    'Youssef Sabiri', 'Abderrazak Hamdallah',
  ]),

  HAI: team('Haití', '🇭🇹', '#00209F', 'C', [
    'Josué Duverger', 'Andrew Jean-Baptiste', 'Mechack Jérôme', 'Zidane Issa',
    'Matteo Jacobs', 'James Léandre', 'Steeven Saba', 'Ronaldo Querino',
    'Frantzdy Pierrot', 'Duckens Nazon', 'Nicolas Janvier', 'Etzer Villard',
    'Derrick Etienne Jr.', 'Luckenson Jean', 'James Jean-Baptiste', 'Fabrice Ngah',
    'Nazon Junior', 'Gerson Rodrigue',
  ]),

  SCO: team('Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '#003F89', 'C', [
    'Angus Gunn', 'Anthony Ralston', 'Grant Hanley', 'Scott McKenna',
    'Andy Robertson', 'Billy Gilmour', 'John McGinn', 'Callum McGregor',
    'Ryan Christie', 'Lyndon Dykes', 'Che Adams', 'Ryan Jack',
    'Stuart Armstrong', 'Scott McTominay', 'Kenny McLean', 'Lawrence Shankland',
    'Ben Doak', 'Ryan Porteous',
  ]),

  // ══════════════════════════════════
  // GRUPO D
  // ══════════════════════════════════
  USA: team('Estados Unidos', '🇺🇸', '#B22234', 'D', [
    'Matt Turner', 'Sergiño Dest', 'Walker Zimmermann', 'Tim Ream',
    'Antonee Robinson', 'Tyler Adams', 'Weston McKennie', 'Yunus Musah',
    'Christian Pulisic', 'Gio Reyna', 'Josh Sargent', 'Folarin Balogun',
    'Brenden Aaronson', 'Ricardo Pepi', 'Malik Tillman', 'Cameron Carter-Vickers',
    'Caden Clark', 'Patrick Schulte',
  ]),

  PAR: team('Paraguay', '🇵🇾', '#D52B1E', 'D', [
    'Antony Silva', 'Robert Rojas', 'Gustavo Gómez', 'Júnior Alonso',
    'Blas Riveros', 'Andrés Cubas', 'Mathías Villasanti', 'Ángel Cardozo',
    'Miguel Almirón', 'Ángel Romero', 'Óscar Romero', 'Ramón Sosa',
    'Diego Gómez', 'Carlos González', 'Santiago Arzamendia', 'Richard Sánchez',
    'Antonio Sanabria', 'Jorge Morel',
  ]),

  AUS: team('Australia', '🇦🇺', '#00843D', 'D', [
    'Mathew Ryan', 'Nathaniel Atkinson', 'Harry Souttar', 'Miloš Degenek',
    'Aziz Behich', 'Jackson Irvine', 'Aaron Mooy', 'Riley McGree',
    'Mathew Leckie', 'Mitchell Duke', 'Martin Boyle', 'Ajdin Hrustic',
    'Garang Kuol', 'Craig Goodwin', 'Keanu Baccus', 'Denis Genreau',
    'Cameron Devlin', 'Marco Tilio',
  ]),

  TUR: team('Turquía', '🇹🇷', '#E30A17', 'D', [
    'Altay Bayındır', 'Zeki Çelik', 'Merih Demiral', 'Kaan Ayhan',
    'Ferdi Kadıoğlu', 'Hakan Çalhanoğlu', 'Salih Özcan', 'Orkun Kökçü',
    'Arda Güler', 'Kerem Aktürkoğlu', 'Cenk Tosun', 'Yusuf Yazıcı',
    'Barış Alper Yılmaz', 'Irfan Can Kahveci', 'Yunus Akgün', 'Serdar Dursun',
    'Güven Yalçın', 'Halil Dervişoğlu',
  ]),

  // ══════════════════════════════════
  // GRUPO E
  // ══════════════════════════════════
  GER: team('Alemania', '🇩🇪', '#000000', 'E', [
    'Manuel Neuer', 'Joshua Kimmich', 'Antonio Rüdiger', 'Niklas Süle',
    'David Raum', 'Leon Goretzka', 'İlkay Gündoğan', 'Thomas Müller',
    'Serge Gnabry', 'Kai Havertz', 'Leroy Sané', 'Jamal Musiala',
    'Florian Wirtz', 'Christopher Nkunku', 'Niclas Füllkrug', 'Timo Werner',
    'Jonas Hofmann', 'Robert Andrich',
  ]),

  // CUW usa numeración con cero: CUW01–CUW20
  CUW: team('Curazao', '🇨🇼', '#003DA5', 'E', [
    'Eloy Room', 'Ethan Sandoval', 'Cuco Martina', 'Darryl Lachman',
    'Rajiv van den Berg', 'Leandro Bacuna', 'Celino Leijdekkers', 'Giliano Wijnaldum',
    'Jarchinio Antonia', 'Gevaro Nepomuceno', 'Cody Cooke', 'Tyronne Ebuehi',
    'Luciano Narsingh', 'Eljero Elia', 'Quentin Trebels', 'Vurnon Anita',
    'Jurickson Profar', 'Riechedly Bazoer',
  ]),

  CIV: team('Costa de Marfil', '🇨🇮', '#F77F00', 'E', [
    'Yahia Fofana', 'Serge Aurier', 'Willy Boly', 'Odilon Kossounou',
    'Ghislain Konan', 'Jean Michaël Seri', 'Franck Kessié', 'Ibrahim Sangaré',
    'Nicolas Pépé', 'Sébastien Haller', 'Wilfried Zaha', 'Simon Adingra',
    'Oumar Diakité', 'Tino Kadewere', 'Jonathan Bamba', 'Evan Ndicka',
    'Emmanuel Gradel', 'Maxwell Cornet',
  ]),

  ECU: team('Ecuador', '🇪🇨', '#FFD100', 'E', [
    'Hernán Galíndez', 'Ángelo Preciado', 'Piero Hincapié', 'Robert Arboleda',
    'Pervis Estupiñán', 'Carlos Gruezo', 'Moisés Caicedo', 'Jhegson Méndez',
    'Ángel Mena', 'Enner Valencia', 'Michael Estrada', 'Jeremy Sarmiento',
    'Kendry Páez', 'Djorkaeff Reasco', 'Stiven Plaza', 'Leonardo Campana',
    'Gonzalo Plata', 'Kevin Rodríguez',
  ]),

  // ══════════════════════════════════
  // GRUPO F
  // ══════════════════════════════════
  NED: team('Países Bajos', '🇳🇱', '#FF6600', 'F', [
    'Remko Pasveer', 'Denzel Dumfries', 'Virgil van Dijk', 'Matthijs de Ligt',
    'Daley Blind', 'Frenkie de Jong', 'Teun Koopmeiners', 'Steven Bergwijn',
    'Memphis Depay', 'Cody Gakpo', 'Wout Weghorst', 'Xavi Simons',
    'Ryan Gravenberch', 'Brian Brobbey', 'Jurrien Timber', 'Nathan Aké',
    'Stefan de Vrij', 'Bart Verbruggen',
  ]),

  // JPN usa numeración con cero: JPN01–JPN20
  JPN: team('Japón', '🇯🇵', '#BC002D', 'F', [
    'Shuichi Gonda', 'Hiroki Sakai', 'Maya Yoshida', 'Ko Itakura',
    'Yuto Nagatomo', 'Wataru Endo', 'Hidemasa Morita', 'Junya Ito',
    'Daichi Kamada', 'Ritsu Doan', 'Takumi Minamino', 'Kaoru Mitoma',
    'Takefusa Kubo', 'Ayase Ueda', 'Ao Tanaka', 'Yukinari Sugawara',
    'Keito Nakamura', 'Mao Hosoya',
  ]),

  SWE: team('Suecia', '🇸🇪', '#006AA7', 'F', [
    'Robin Olsen', 'Mikael Lustig', 'Victor Lindelöf', 'Marcus Danielson',
    'Ludwig Augustinsson', 'Albin Ekdal', 'Kristoffer Olsson', 'Emil Forsberg',
    'Alexander Isak', 'Dejan Kulusevski', 'Jordan Larsson', 'Anthony Elanga',
    'Viktor Claesson', 'Mattias Svanberg', 'Robin Quaison', 'Pontus Jansson',
    'Zlatan Ibrahimovic', 'Sam Lammers',
  ]),

  TUN: team('Túnez', '🇹🇳', '#E70013', 'F', [
    'Aymen Dahmen', 'Mohamed Drager', 'Dylan Bronn', 'Yassine Meriah',
    'Ali Maaloul', 'Ellyes Skhiri', 'Anis Ben Slimane', 'Naim Sliti',
    'Wahbi Khazri', 'Seifeddine Jaziri', 'Hannibal Mejbri', 'Youssef Msakni',
    'Mohamed Ben Romdhane', 'Sayfallah Ltaief', 'Montassar Talbi', 'Wajdi Kechrida',
    'Issam Jebali', 'Ghaylen Chaalali',
  ]),

  // ══════════════════════════════════
  // GRUPO G
  // ══════════════════════════════════
  BEL: team('Bélgica', '🇧🇪', '#000000', 'G', [
    'Thibaut Courtois', 'Timothy Castagne', 'Toby Alderweireld', 'Jan Vertonghen',
    'Yannick Carrasco', 'Axel Witsel', 'Kevin De Bruyne', 'Youri Tielemans',
    'Eden Hazard', 'Romelu Lukaku', 'Dries Mertens', 'Lois Openda',
    'Charles De Ketelaere', 'Jeremy Doku', 'Johan Bakayoko', 'Arthur Theate',
    'Leandro Trossard', 'Amadou Onana',
  ]),

  EGY: team('Egipto', '🇪🇬', '#CE1126', 'G', [
    'Mohamed El-Shenawy', 'Ahmed Fatouh', 'Ahmed Hegazi', 'Mohamed Abdel-Shafy',
    'Ahmed Sayed Zizo', 'Tarek Hamed', 'Amr El-Sulaya', 'Hamdi Fathi',
    'Mohamed Salah', 'Omar Marmoush', 'Mostafa Mohamed', 'Trezeguet',
    'Ramadan Sobhi', 'Ahmed Sami', 'Akram Tawfik', 'Mohamed Sherif',
    'Ahmed Abou El Yazid', 'Amr Warda',
  ]),

  IRN: team('Irán', '🇮🇷', '#239F40', 'G', [
    'Alireza Beiranvand', 'Sadegh Moharrami', 'Majid Hosseini', 'Shoja Khalilzadeh',
    'Milad Mohammadi', 'Ahmad Noorollahi', 'Saeid Ezatolahi', 'Ali Gholizadeh',
    'Mehdi Taremi', 'Sardar Azmoun', 'Karim Ansarifard', 'Ramin Rezaeian',
    'Ehsan Hajsafi', 'Saman Ghoddos', 'Allahyar Sayyadmanesh', 'Morteza Pouraliganji',
    'Ali Karimi', 'Alireza Jahanbakhsh',
  ]),

  NZL: team('Nueva Zelanda', '🇳🇿', '#000000', 'G', [
    'Stefan Marinovic', 'Liberato Cacace', 'Tommy Smith', 'Michael Boxall',
    'Niko Kirwan', 'Clayton Lewis', 'Joe Bell', 'Marko Grgić',
    'Chris Wood', 'Elijah Just', 'Dane Ingham', 'Matthew Garbett',
    'Tim Payne', 'Ben Old', 'Sarpreet Singh', 'Finn Surman',
    'Louis Fenton', 'Alex Rufer',
  ]),

  // ══════════════════════════════════
  // GRUPO H
  // ══════════════════════════════════
  ESP: team('España', '🇪🇸', '#AA151B', 'H', [
    'Unai Simón', 'Dani Carvajal', 'Pau Torres', 'Aymeric Laporte',
    'Jordi Alba', 'Pedri', 'Gavi', 'Rodrigo Morata',
    'Ferran Torres', 'Álvaro Morata', 'Ansu Fati', 'Dani Olmo',
    'Lamine Yamal', 'Nico Williams', 'Mikel Oyarzabal', 'Martín Zubimendi',
    'Alejandro Grimaldo', 'Fabián Ruiz',
  ]),

  CPV: team('Cabo Verde', '🇨🇻', '#003893', 'H', [
    'Vozinha', 'Stopira', 'Roberto Lopes', 'Marco Soares',
    'Diney', 'Jamiro Monteiro', 'Steven Fortes', 'Ryan Mendes',
    'Garry Rodrigues', 'Gilson Tavares', 'Djaniny', 'Julio Tavares',
    'Willy Semedo', 'Yanis Antunes', 'Elves Baldé', 'Kenny Rocha Santos',
    'Steven Soares', 'Patrick Andrade',
  ]),

  KSA: team('Arabia Saudita', '🇸🇦', '#006C35', 'H', [
    'Mohammed Al-Owais', 'Saud Abdulhamid', 'Ali Al-Bulaihi', 'Abdulelah Al-Amri',
    'Yasser Al-Shahrani', 'Salman Al-Faraj', 'Abdulrahman Al-Malki', 'Sami Al-Najei',
    'Salem Al-Dawsari', 'Firas Al-Buraikan', 'Hattan Bahebri', 'Mohammed Al-Burayk',
    'Abdullah Al-Hamdan', 'Fahad Al-Muwallad', 'Riyadh Sharahili', 'Turki Al-Ammar',
    'Nasser Al-Dawsari', 'Sultan Al-Ghannam',
  ]),

  URU: team('Uruguay', '🇺🇾', '#5EB6E4', 'H', [
    'Sergio Rochet', 'Nahitan Nández', 'José María Giménez', 'Ronald Araújo',
    'Mathías Olivera', 'Federico Valverde', 'Rodrigo Bentancur', 'Lucas Torreira',
    'Darwin Núñez', 'Luis Suárez', 'Facundo Torres', 'Maximiliano Araújo',
    'Giorgian De Arrascaeta', 'Nicolás De La Cruz', 'Agustín Canobbio', 'Brian Rodríguez',
    'Sebastián Coates', 'Santiago Bueno',
  ]),

  // ══════════════════════════════════
  // GRUPO I
  // ══════════════════════════════════
  FRA: team('Francia', '🇫🇷', '#003189', 'I', [
    'Hugo Lloris', 'Benjamin Pavard', 'Raphaël Varane', 'Dayot Upamecano',
    'Théo Hernández', 'Aurélien Tchouaméni', 'Antoine Griezmann', 'Adrien Rabiot',
    'Ousmane Dembélé', 'Kylian Mbappé', 'Marcus Thuram', 'Randal Kolo Muani',
    'Eduardo Camavinga', 'Warren Zaïre-Emery', 'Bradley Barcola', 'William Saliba',
    'Ibrahima Konaté', 'Mike Maignan',
  ]),

  SEN: team('Senegal', '🇸🇳', '#00853F', 'I', [
    'Édouard Mendy', 'Bouna Sarr', 'Kalidou Koulibaly', 'Abdou Diallo',
    'Fodé Ballo-Touré', 'Cheikhou Kouyaté', 'Idrissa Gueye', 'Nampalys Mendy',
    'Sadio Mané', 'Ismaïla Sarr', 'Boulaye Dia', 'Nicolas Jackson',
    'Habib Diallo', 'Iliman Ndiaye', 'Pape Gueye', 'Lamine Camara',
    'Krepin Diatta', 'Alfred Gomis',
  ]),

  IRQ: team('Irak', '🇮🇶', '#007A3D', 'I', [
    'Jalal Hassan', 'Ali Adnan', 'Mustafa Nadhim', 'Saman Shokor',
    'Ahmed Ibrahim', 'Amjed Attwan', 'Bashar Resan', 'Aymen Hussein',
    'Mohanad Ali', 'Alaa Abbas', 'Emad Mohammed', 'Manaf Yousif',
    'Mazin Fayyadh', 'Hussein Ali', 'Saif Ghalib', 'Osama Rashid',
    'Karrar Jassim', 'Humam Tariq',
  ]),

  NOR: team('Noruega', '🇳🇴', '#EF2B2D', 'I', [
    'Ørjan Nyland', 'Omar Elabdellaoui', 'Leo Skiri Østigård', 'Andreas Hanche-Olsen',
    'Birger Meling', 'Sander Berge', 'Morten Thorsby', 'Martin Ødegaard',
    'Erling Haaland', 'Mohamed Elyounoussi', 'Alexander Sørloth', 'Ola Solbakken',
    'Antonio Nusa', 'Jens Petter Hauge', 'Fredrik Aursnes', 'Håkon Evjen',
    'Tobias Børkeeiet', 'Patrick Berg',
  ]),

  // ══════════════════════════════════
  // GRUPO J
  // ══════════════════════════════════
  ARG: team('Argentina', '🇦🇷', '#74ACDF', 'J', [
    'Emiliano Martínez', 'Nahuel Molina', 'Cristian Romero', 'Lisandro Martínez',
    'Marcos Acuña', 'Rodrigo De Paul', 'Alexis Mac Allister', 'Enzo Fernández',
    'Ángel Di María', 'Lautaro Martínez', 'Julian Álvarez', 'Lionel Messi',
    'Thiago Almada', 'Alejandro Garnacho', 'Nicolás González', 'Paulo Dybala',
    'Germán Pezzella', 'Geronimo Rulli',
  ]),

  ALG: team('Argelia', '🇩🇿', '#006233', 'J', [
    'Raïs M\'Bolhi', 'Aïssa Mandi', 'Djamel Benlamri', 'Ramy Bensebaini',
    'Youcef Atal', 'Adlène Guedioura', 'Nabil Bentaleb', 'Sofiane Feghouli',
    'Riyad Mahrez', 'Islam Slimani', 'Baghdad Bounedjah', 'Yacine Brahimi',
    'Andy Delort', 'Said Benrahma', 'Houssem Aouar', 'Mohamed Benyahia',
    'Oussama Idris', 'Adem Zorgane',
  ]),

  AUT: team('Austria', '🇦🇹', '#ED2939', 'J', [
    'Patrick Pentz', 'Stefan Lainer', 'Martin Hinteregger', 'Aleksandar Dragovic',
    'Philipp Mwene', 'Florian Grillitsch', 'Konrad Laimer', 'Marcel Sabitzer',
    'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautovic', 'David Alaba',
    'Nicolas Seiwald', 'Patrick Wimmer', 'Romano Schmid', 'Florian Kainz',
    'Stefan Schwab', 'Kevin Danso',
  ]),

  JOR: team('Jordania', '🇯🇴', '#007A3D', 'J', [
    'Yazeed Abulaila', 'Baha Faisal', 'Badr Natheer', 'Ahmad Hardan',
    'Khaled Hafez', 'Yazan Naimat', 'Moath Al-Hiyasat', 'Musa Al-Taamari',
    'Besar Halimi', 'Ibrahim Saad', 'Hamza Al-Dardour', 'Odai Al-Saify',
    'Yazan Al-Naimat', 'Motaz Al-Talafha', 'Mohammad Al-Rawabdeh', 'Zaid Al-Hamad',
    'Ahmad Abu Zema', 'Ehsan Haddad',
  ]),

  // ══════════════════════════════════
  // GRUPO K
  // ══════════════════════════════════
  POR: team('Portugal', '🇵🇹', '#006600', 'K', [
    'Diogo Costa', 'Diogo Dalot', 'Rúben Dias', 'Pepe',
    'Nuno Mendes', 'Rúben Neves', 'William Carvalho', 'Bruno Fernandes',
    'Bernardo Silva', 'Cristiano Ronaldo', 'João Félix', 'Rafael Leão',
    'Vitinha', 'Otávio', 'Pedro Neto', 'Gonçalo Ramos',
    'João Cancelo', 'Mário Rui',
  ]),

  COD: team('RD Congo', '🇨🇩', '#007FFF', 'K', [
    'Joël Kiassumbua', 'Marcel Tisserand', 'Chancel Mbemba', 'Jean-Fernand Nsimba',
    'Arthur Masuaku', 'Cédric Bakambu', 'Yoane Wissa', 'Nathan Nzola',
    'Théo Bongonda', 'Silas Katompa Mvumpa', 'Firmin Mubele', 'Merveille Bito',
    'Neeskens Kebano', 'Donat Ndong', 'Jonathan Bolingi', 'Issamba Ndombele',
    'Héritier Luvumbu', 'Gaël Kakuta',
  ]),

  UZB: team('Uzbekistán', '🇺🇿', '#1EB53A', 'K', [
    'Otabek Shukurov', 'Khojiakbar Alijonov', 'Jasurbek Yakhshiboev', 'Eldor Shomurodov',
    'Abbosbek Fayzullaev', 'Otabek Yusupov', 'Javokhir Sidikov', 'Khurshid Tursunov',
    'Akbar Bafoev', 'Bobir Abdikholikov', 'Azizbek Turgunboev', 'Sherzod Nasrullayev',
    'Jasur Yakhshiboev', 'Umid Abdurahimov', 'Husan Kholmatov', 'Sardor Rashidov',
    'Dostonbek Khamdamov', 'Bekhruz Tursunov',
  ]),

  COL: team('Colombia', '🇨🇴', '#FCD116', 'K', [
    'David Ospina', 'Daniel Muñoz', 'Yerry Mina', 'Davinson Sánchez',
    'Johan Mojica', 'Wilmar Barrios', 'Mateus Uribe', 'Juan Cuadrado',
    'James Rodríguez', 'Luis Díaz', 'Rafael Santos Borré', 'Jhon Jáder Durán',
    'Richard Ríos', 'John Córdoba', 'Jhon Arias', 'Óscar Cortés',
    'Camilo Vargas', 'Carlos Cuesta',
  ]),

  // ══════════════════════════════════
  // GRUPO L
  // ══════════════════════════════════
  ENG: team('Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '#CF081F', 'L', [
    'Jordan Pickford', 'Trent Alexander-Arnold', 'Harry Maguire', 'John Stones',
    'Luke Shaw', 'Declan Rice', 'Jude Bellingham', 'Phil Foden',
    'Bukayo Saka', 'Harry Kane', 'Marcus Rashford', 'Raheem Sterling',
    'Cole Palmer', 'Anthony Gordon', 'Morgan Gibbs-White', 'Levi Colwill',
    'Conor Gallagher', 'Nick Pope',
  ]),

  CRO: team('Croacia', '🇭🇷', '#FF0000', 'L', [
    'Dominik Livaković', 'Josip Juranović', 'Dejan Lovren', 'Joško Gvardiol',
    'Borna Sosa', 'Marcelo Brozović', 'Luka Modrić', 'Mateo Kovačić',
    'Ivan Perišić', 'Andrej Kramarić', 'Marko Livaja', 'Bruno Petković',
    'Luka Sučić', 'Martin Baturina', 'Josip Šutalo', 'Marin Pongračič',
    'Nikola Vlašić', 'Borna Barisic',
  ]),

  GHA: team('Ghana', '🇬🇭', '#006B3F', 'L', [
    'Lawrence Ati-Zigi', 'Tariqe Fosu', 'Daniel Amartey', 'Alexander Djiku',
    'Gideon Mensah', 'Thomas Partey', 'Mubarak Wakaso', 'Mohammed Kudus',
    'Joseph Paintsil', 'Inaki Williams', 'Jordan Ayew', 'Antoine Semenyo',
    'Osman Bukari', 'Felix Afena-Gyan', 'Daniel Kofi Kyereh', 'Richmond Boakye',
    'Ernest Nuamah', 'Kamaldeen Sulemana',
  ]),

  PAN: team('Panamá', '🇵🇦', '#DA121A', 'L', [
    'Luis Mejía', 'Michael Amir Murillo', 'Fidel Escobar', 'Harold Cummings',
    'Édgar Bárcenas', 'Adalberto Carrasquilla', 'Anibal Godoy', 'Rolando Blackburn',
    'Ismael Díaz', 'Cecilio Waterman', 'José Fajardo', 'Alfredo Stephens',
    'Alberto Quintero', 'Freddy Góndola', 'Éric Davis', 'Andrés Andrade',
    'Jiovanny Ramos', 'Aníbal Cisneros',
  ]),
};

export const ORDER = [
  'FWC',
  // Grupo A
  'MEX', 'RSA', 'KOR', 'CZE',
  // Grupo B
  'CAN', 'BIH', 'QAT', 'SUI',
  // Grupo C
  'BRA', 'MAR', 'HAI', 'SCO',
  // Grupo D
  'USA', 'PAR', 'AUS', 'TUR',
  // Grupo E
  'GER', 'CUW', 'CIV', 'ECU',
  // Grupo F
  'NED', 'JPN', 'SWE', 'TUN',
  // Grupo G
  'BEL', 'EGY', 'IRN', 'NZL',
  // Grupo H
  'ESP', 'CPV', 'KSA', 'URU',
  // Grupo I
  'FRA', 'SEN', 'IRQ', 'NOR',
  // Grupo J
  'ARG', 'ALG', 'AUT', 'JOR',
  // Grupo K
  'POR', 'COD', 'UZB', 'COL',
  // Grupo L
  'ENG', 'CRO', 'GHA', 'PAN',
];

export function buildStickerMap() {
  const map = {};
  for (const [code, team] of Object.entries(TEAMS)) {
    for (const sticker of team.stickers) {
      const key = stickerKey(code, sticker.num);
      map[key] = {
        key,
        teamCode: code,
        teamName: team.name,
        flag: team.flag,
        color: team.color,
        group: team.group || null,
        num: sticker.num,
        type: sticker.type,
        label: sticker.label,
      };
    }
  }
  return map;
}

export const STICKER_MAP = buildStickerMap();

export function getTotalStickers() {
  return Object.values(TEAMS).reduce((s, t) => s + t.stickers.length, 0);
}

export function getTotalShiny() {
  return Object.values(TEAMS).reduce(
    (s, t) => s + t.stickers.filter(st => st.type === 'brillo').length, 0
  );
}
