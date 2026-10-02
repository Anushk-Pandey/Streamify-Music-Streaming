export interface Song {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number; // in seconds
  albumId?: string;
  plays?: number;
  genre?: string;
  createdAt?: string;
}

export interface Album {
  _id: string;
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: number;
  songs: Song[];
}

export interface Playlist {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  userName: string;
  songs: Song[];
  isPublic: boolean;
  createdAt?: string;
}

export interface User {
  _id?: string;
  clerkId: string;
  fullName: string;
  imageUrl: string;
  email?: string;
  role?: string;
}

export interface Stats {
  totalSongs: number;
  totalAlbums: number;
  totalUsers: number;
  totalArtists: number;
  totalStreams: number;
}
