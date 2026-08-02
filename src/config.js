export const VIEW = { width: 1280, height: 720 };
export const WORLD_WIDTH = 7200;

export const regions = [
  { id: "meadow", from: 0, to: 780, title: "Campo de flores", subtitle: "o vento sabe os nomes", kind: "meadow", music: [62, 66, 69], weather: "petals" },
  { id: "lake", from: 780, to: 1560, title: "Lago iluminado", subtitle: "onde a água aprende a guardar luz", kind: "lake", music: [57, 61, 64], weather: "mist" },
  { id: "forest", from: 1560, to: 2380, title: "Floresta dos vaga-lumes", subtitle: "toda noite tem um pequeno segredo", kind: "forest", music: [55, 59, 62], weather: "fireflies" },
  { id: "train", from: 2380, to: 3200, title: "Montanhas em movimento", subtitle: "um trem leva os dias devagar", kind: "train", music: [50, 54, 57], weather: "wind" },
  { id: "library", from: 3200, to: 3980, title: "Biblioteca silenciosa", subtitle: "páginas que respiram junto", kind: "library", music: [59, 62, 66], weather: "dust" },
  { id: "garden", from: 3980, to: 4820, title: "Jardim das estrelas", subtitle: "a noite floresce devagar", kind: "garden", music: [57, 60, 64], weather: "stars" },
  { id: "observatory", from: 4820, to: 5550, title: "Observatório", subtitle: "perto o bastante para escutar o céu", kind: "observatory", music: [54, 57, 61], weather: "stars" },
  { id: "hill", from: 5550, to: 6350, title: "Colina do pôr do sol", subtitle: "o mundo aprende a ficar dourado", kind: "hill", music: [64, 67, 71], weather: "leaves" },
  { id: "beach", from: 6350, to: 7200, title: "Praia da manhã", subtitle: "o dia começa antes de tudo", kind: "beach", music: [60, 64, 67], weather: "birds" },
];

export const memories = [
  { id: "first-flower", x: 470, y: 510, region: "meadow", icon: "✿", title: "uma flor guardada", text: "Ela se inclina com o vento. Algumas delicadezas não pedem para ser lembradas — elas apenas ficam." },
  { id: "paper-boat", x: 1250, y: 535, region: "lake", icon: "⌁", title: "um barquinho de papel", text: "Nas suas dobras: a promessa de descobrir paisagens novas, mesmo quando o lugar é só ao lado de alguém." },
  { id: "firefly-jar", x: 1990, y: 485, region: "forest", icon: "✦", title: "luz que não se apaga", text: "Um vaga-lume pousa na mão dela. Por um segundo, a floresta inteira parece respirar junto." },
  { id: "train-ticket", x: 2815, y: 535, region: "train", icon: "◇", title: "bilhete sem destino", text: "Há viagens que importam menos pelo lugar onde terminam do que por quem olha a janela com a gente." },
  { id: "pressed-page", x: 3560, y: 500, region: "library", icon: "▤", title: "uma página dobrada", text: "Entre duas páginas, uma flor seca ainda guarda uma cor que só existe na lembrança." },
  { id: "star-seed", x: 4380, y: 475, region: "garden", icon: "✧", title: "semente de estrela", text: "Ela brilha na palma da mão. O céu parece reconhecer quem teve coragem de continuar suave." },
  { id: "lens", x: 5155, y: 510, region: "observatory", icon: "◌", title: "lente voltada ao infinito", text: "No vidro do telescópio, a distância deixa de assustar. Tudo aquilo que importa encontra um jeito de ficar perto." },
  { id: "sunset-ribbon", x: 5940, y: 485, region: "hill", icon: "≈", title: "fita cor de pôr do sol", text: "O vento a leva só um pouco, como se o tempo soubesse que não precisa correr." },
  { id: "shell", x: 6800, y: 545, region: "beach", icon: "◒", title: "concha da manhã", text: "Ao encostar no ouvido, ela não escuta o mar. Escuta uma casa, uma risada, um futuro possível." },
];

export const quietPlaces = [
  { x: 260, y: 545, label: "sentar entre as flores", title: "um banco sob o céu", text: "Ela se senta. Por um instante, não há nada a resolver." },
  { x: 1440, y: 540, label: "observar o reflexo", title: "água tranquila", text: "O lago devolve um céu que parece ainda maior." },
  { x: 2250, y: 535, label: "ouvir a floresta", title: "um intervalo de silêncio", text: "O silêncio não está vazio. Ele está cheio de coisas gentis." },
  { x: 3730, y: 520, label: "tocar uma nota no piano", title: "uma nota só", text: "A última nota fica no ar, leve o bastante para não precisar de resposta." },
  { x: 5450, y: 520, label: "olhar pelo telescópio", title: "muito longe, muito perto", text: "Uma estrela acende e, de algum modo, parece que estava esperando por ela." },
];

export function regionAt(x) { return regions.find((region) => x >= region.from && x < region.to) || regions[regions.length - 1]; }
