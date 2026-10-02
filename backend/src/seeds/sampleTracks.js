export const sampleSongs = [
  {
    _id: "65b900010000000000000001",
    title: "Midnight City Lights",
    artist: "Neon Dreamer",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372,
    genre: "Synthwave",
    plays: 14250,
  },
  {
    _id: "65b900010000000000000002",
    title: "Sunset Chords & Coffee",
    artist: "Aura Lo-Fi",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 423,
    genre: "Lo-Fi",
    plays: 28910,
  },
  {
    _id: "65b900010000000000000003",
    title: "Cosmic Odyssey",
    artist: "Solar Horizon",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 348,
    genre: "Electronic",
    plays: 35120,
  },
  {
    _id: "65b900010000000000000004",
    title: "Rainy Kyoto Cafe",
    artist: "Yuki Tanaka",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    duration: 302,
    genre: "Ambient",
    plays: 19800,
  },
  {
    _id: "65b900010000000000000005",
    title: "Cybernetic Pulse",
    artist: "Vortex 88",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    duration: 354,
    genre: "Synthwave",
    plays: 42100,
  },
  {
    _id: "65b900010000000000000006",
    title: "Golden Hour Glow",
    artist: "Luna Sol",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    duration: 410,
    genre: "Indie Pop",
    plays: 53200,
  },
  {
    _id: "65b900010000000000000007",
    title: "Tokyo Driftline",
    artist: "Kuro Beat",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 326,
    genre: "Hip-Hop",
    plays: 61400,
  },
  {
    _id: "65b900010000000000000008",
    title: "Deep Ocean Echoes",
    artist: "Blue Abyss",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    duration: 390,
    genre: "Chillout",
    plays: 18700,
  }
];

export const sampleAlbums = [
  {
    _id: "65b900020000000000000001",
    title: "Retrograde Odyssey",
    artist: "Neon Dreamer",
    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2024,
    songs: [
      "65b900010000000000000001",
      "65b900010000000000000005"
    ]
  },
  {
    _id: "65b900020000000000000002",
    title: "Lo-Fi Coffee Sanctuary",
    artist: "Aura Lo-Fi",
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2023,
    songs: [
      "65b900010000000000000002",
      "65b900010000000000000004"
    ]
  },
  {
    _id: "65b900020000000000000003",
    title: "Starlight Horizons",
    artist: "Solar Horizon & Luna Sol",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    releaseYear: 2024,
    songs: [
      "65b900010000000000000003",
      "65b900010000000000000006"
    ]
  }
];

export const samplePlaylists = [
  {
    _id: "65b900030000000000000001",
    title: "Chill Deep Coding Sessions",
    description: "Atmospheric beats and lo-fi rhythms to enter deep flow state.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    userId: "streamify_editorial",
    userName: "Streamify Editorial",
    songs: [
      "65b900010000000000000002",
      "65b900010000000000000004",
      "65b900010000000000000008"
    ],
    isPublic: true
  },
  {
    _id: "65b900030000000000000002",
    title: "Cyberpunk Night Drive",
    description: "High-octane synths and neon basslines for midnight speed runs.",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
    userId: "streamify_editorial",
    userName: "Streamify Editorial",
    songs: [
      "65b900010000000000000001",
      "65b900010000000000000005",
      "65b900010000000000000007"
    ],
    isPublic: true
  }
];
