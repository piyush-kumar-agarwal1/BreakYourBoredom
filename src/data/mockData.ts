import { Movie, Anime, Book, Series } from '@/types/media';

// Movies
export const mockMovies: Movie[] = [
  {
    id: 'movie-1',
    title: 'Inception',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception',
    rating: 8.8,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    year: 2010,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    director: 'Christopher Nolan',
    duration: 148,
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page']
  },
  {
    id: 'movie-2',
    title: 'The Dark Knight',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Dark+Knight',
    rating: 9.0,
    genres: ['Action', 'Crime', 'Drama'],
    year: 2008,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    duration: 152,
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart']
  },
  {
    id: 'movie-3',
    title: 'Parasite',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Parasite',
    rating: 8.6,
    genres: ['Thriller', 'Drama', 'Comedy'],
    year: 2019,
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    director: 'Bong Joon Ho',
    duration: 132,
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong']
  },
  {
    id: 'movie-4',
    title: 'Pulp Fiction',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Pulp+Fiction',
    rating: 8.9,
    genres: ['Crime', 'Drama'],
    year: 1994,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    director: 'Quentin Tarantino',
    duration: 154,
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson']
  },
  {
    id: 'movie-5',
    title: 'The Shawshank Redemption',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Shawshank+Redemption',
    rating: 9.3,
    genres: ['Drama'],
    year: 1994,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    director: 'Frank Darabont',
    duration: 142,
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
  },
  {
    id: 'movie-6',
    title: 'Interstellar',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Interstellar',
    rating: 8.6,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    year: 2014,
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    director: 'Christopher Nolan',
    duration: 169,
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain']
  },
];

// Anime
export const mockAnime: Anime[] = [
  {
    id: 'anime-1',
    title: 'Attack on Titan',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Attack+on+Titan',
    rating: 9.0,
    genres: ['Action', 'Drama', 'Fantasy'],
    year: 2013,
    description: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    episodes: 75,
    studio: 'Wit Studio',
    status: 'completed'
  },
  {
    id: 'anime-2',
    title: 'Fullmetal Alchemist: Brotherhood',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Fullmetal+Alchemist',
    rating: 9.1,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    year: 2009,
    description: 'Two brothers search for a Philosopher\'s Stone after an attempt to revive their deceased mother goes wrong, leaving them in damaged physical forms.',
    episodes: 64,
    studio: 'Bones',
    status: 'completed'
  },
  {
    id: 'anime-3',
    title: 'Death Note',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Death+Note',
    rating: 8.6,
    genres: ['Mystery', 'Psychological', 'Supernatural', 'Thriller'],
    year: 2006,
    description: 'An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.',
    episodes: 37,
    studio: 'Madhouse',
    status: 'completed'
  },
  {
    id: 'anime-4',
    title: 'Demon Slayer',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Demon+Slayer',
    rating: 8.7,
    genres: ['Action', 'Adventure', 'Fantasy'],
    year: 2019,
    description: 'A young man begins a journey of revenge against the demon who slaughtered his family.',
    episodes: 44,
    studio: 'Ufotable',
    status: 'ongoing'
  },
  {
    id: 'anime-5',
    title: 'One Punch Man',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=One+Punch+Man',
    rating: 8.8,
    genres: ['Action', 'Comedy', 'Superhero'],
    year: 2015,
    description: 'The story of Saitama, a hero who can defeat any opponent with a single punch but seeks to find a worthy opponent after growing bored by a lack of challenge.',
    episodes: 24,
    studio: 'Madhouse',
    status: 'ongoing'
  },
  {
    id: 'anime-6',
    title: 'My Hero Academia',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=My+Hero+Academia',
    rating: 8.4,
    genres: ['Action', 'Comedy', 'Superhero'],
    year: 2016,
    description: 'A superhero-loving boy without any powers is determined to enroll in a prestigious hero academy and learn what it really means to be a hero.',
    episodes: 113,
    studio: 'Bones',
    status: 'ongoing'
  },
];

// Books
export const mockBooks: Book[] = [
  {
    id: 'book-1',
    title: '1984',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=1984',
    rating: 8.5,
    genres: ['Dystopian', 'Sci-Fi', 'Political'],
    year: 1949,
    description: 'A dystopian social science fiction novel that examines the consequences of totalitarianism, mass surveillance, and repressive regimentation.',
    author: 'George Orwell',
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    id: 'book-2',
    title: 'To Kill a Mockingbird',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=To+Kill+a+Mockingbird',
    rating: 8.8,
    genres: ['Fiction', 'Coming-of-age', 'Legal'],
    year: 1960,
    description: 'The story of young Scout Finch, her brother Jem, and their father Atticus, a lawyer who defends a black man accused of raping a white woman in the racially charged 1930s South.',
    author: 'Harper Lee',
    pages: 281,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    id: 'book-3',
    title: 'The Lord of the Rings',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Lord+of+the+Rings',
    rating: 9.0,
    genres: ['Fantasy', 'Adventure', 'Epic'],
    year: 1954,
    description: 'An epic high-fantasy novel that follows the quest to destroy the One Ring, which was created by the Dark Lord Sauron.',
    author: 'J.R.R. Tolkien',
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    id: 'book-4',
    title: 'The Great Gatsby',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Great+Gatsby',
    rating: 8.2,
    genres: ['Fiction', 'Tragedy', 'Social Criticism'],
    year: 1925,
    description: 'The tragic story of Jay Gatsby\'s pursuit of his old flame, Daisy Buchanan, against the backdrop of the roaring 1920s.',
    author: 'F. Scott Fitzgerald',
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    id: 'book-5',
    title: 'Pride and Prejudice',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Pride+and+Prejudice',
    rating: 8.3,
    genres: ['Romance', 'Fiction', 'Classic'],
    year: 1813,
    description: 'The story follows the main character, Elizabeth Bennet, as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry.',
    author: 'Jane Austen',
    pages: 432,
    publisher: 'T. Egerton'
  },
  {
    id: 'book-6',
    title: 'Harry Potter and the Philosopher\'s Stone',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Harry+Potter',
    rating: 8.7,
    genres: ['Fantasy', 'Young Adult', 'Adventure'],
    year: 1997,
    description: 'The first novel in the Harry Potter series, which follows a young wizard, Harry Potter, as he discovers his magical heritage and battles the dark wizard Voldemort.',
    author: 'J.K. Rowling',
    pages: 223,
    publisher: 'Bloomsbury'
  },
];

// Series
export const mockSeries: Series[] = [
  {
    id: 'series-1',
    title: 'Breaking Bad',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Breaking+Bad',
    rating: 9.5,
    genres: ['Crime', 'Drama', 'Thriller'],
    year: 2008,
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    seasons: 5,
    episodes: 62,
    network: 'AMC',
    status: 'completed'
  },
  {
    id: 'series-2',
    title: 'Game of Thrones',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Game+of+Thrones',
    rating: 9.2,
    genres: ['Fantasy', 'Adventure', 'Drama'],
    year: 2011,
    description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
    seasons: 8,
    episodes: 73,
    network: 'HBO',
    status: 'completed'
  },
  {
    id: 'series-3',
    title: 'Stranger Things',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Stranger+Things',
    rating: 8.7,
    genres: ['Sci-Fi', 'Horror', 'Drama'],
    year: 2016,
    description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    seasons: 4,
    episodes: 34,
    network: 'Netflix',
    status: 'ongoing'
  },
  {
    id: 'series-4',
    title: 'The Office',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Office',
    rating: 8.9,
    genres: ['Comedy'],
    year: 2005,
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    seasons: 9,
    episodes: 201,
    network: 'NBC',
    status: 'completed'
  },
  {
    id: 'series-5',
    title: 'The Mandalorian',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Mandalorian',
    rating: 8.8,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    year: 2019,
    description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
    seasons: 3,
    episodes: 24,
    network: 'Disney+',
    status: 'ongoing'
  },
  {
    id: 'series-6',
    title: 'The Crown',
    coverImage: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Crown',
    rating: 8.7,
    genres: ['Drama', 'Historical', 'Biography'],
    year: 2016,
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
    seasons: 5,
    episodes: 50,
    network: 'Netflix',
    status: 'ongoing'
  },
];

export const trendingItems = [
  ...mockMovies.slice(0, 2),
  ...mockAnime.slice(0, 2),
  ...mockBooks.slice(0, 1),
  ...mockSeries.slice(0, 1),
].sort(() => Math.random() - 0.5);

export const featuredItem = {
  id: 'movie-7',
  title: 'Dune',
  coverImage: 'https://via.placeholder.com/1200x600/1a1a1a/ffffff?text=Dune',
  rating: 8.7,
  genres: ['Sci-Fi', 'Adventure', 'Epic'],
  year: 2021,
  description: 'Feature adaptation of Frank Herbert\'s science fiction novel about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.',
  link: '/movie/movie-7',
  buttonText: 'Explore Now',
};

// Adding Indian content
export const indianMovies = [
  {
    id: "in-movie-1",
    title: "Pathaan",
    coverImage: "https://i.imgur.com/mUwbQyW.jpg",
    rating: 7.2,
    genres: ["Action", "Thriller"],
    year: 2023,
    description: "An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.",
    director: "Siddharth Anand",
    duration: 146,
    cast: ["Shah Rukh Khan", "Deepika Padukone", "John Abraham"]
  },
  {
    id: "in-movie-2",
    title: "RRR",
    coverImage: "https://i.imgur.com/t2C5CjA.jpg",
    rating: 8.7,
    genres: ["Action", "Drama", "Historical"],
    year: 2022,
    description: "A fictional story about two Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, and their fight against the British Raj.",
    director: "S.S. Rajamouli",
    duration: 187,
    cast: ["N.T. Rama Rao Jr.", "Ram Charan", "Alia Bhatt"]
  },
  {
    id: "in-movie-3",
    title: "3 Idiots",
    coverImage: "https://i.imgur.com/LnRoMrL.jpg",
    rating: 8.4,
    genres: ["Comedy", "Drama"],
    year: 2009,
    description: "Two friends search for their third companion, who was once an optimistic and successful student. In the process, they recall their college days and remember the lessons that their friend taught them.",
    director: "Rajkumar Hirani",
    duration: 170,
    cast: ["Aamir Khan", "Madhavan", "Sharman Joshi"]
  },
  {
    id: "in-movie-4",
    title: "Dangal",
    coverImage: "https://i.imgur.com/VuSWbk5.jpg",
    rating: 8.3,
    genres: ["Biography", "Drama", "Sports"],
    year: 2016,
    description: "Former wrestler Mahavir Singh Phogat trains his daughters Geeta and Babita to be world-class wrestlers.",
    director: "Nitesh Tiwari",
    duration: 161,
    cast: ["Aamir Khan", "Fatima Sana Shaikh", "Sanya Malhotra"]
  },
  {
    id: "in-movie-5",
    title: "Baahubali: The Beginning",
    coverImage: "https://i.imgur.com/OsGW7pw.jpg",
    rating: 8.1,
    genres: ["Action", "Drama", "Fantasy"],
    year: 2015,
    description: "In ancient India, an adventurous and daring man becomes involved in a decades-old feud between warring cousins.",
    director: "S.S. Rajamouli",
    duration: 159,
    cast: ["Prabhas", "Rana Daggubati", "Anushka Shetty"]
  }
];

export const indianAnime = [
  {
    id: "in-anime-1",
    title: "Chota Bheem",
    coverImage: "https://i.imgur.com/Hkv5GTs.jpg",
    rating: 7.4,
    genres: ["Animation", "Adventure", "Comedy"],
    year: 2008,
    description: "The adventures of a strong boy named Bheem, set in the fictional kingdom of Dholakpur.",
    episodes: 500,
    studio: "Green Gold Animation",
    status: "ongoing"
  },
  {
    id: "in-anime-2",
    title: "Naruto (Hindi Dub)",
    coverImage: "https://i.imgur.com/QL9cXa3.jpg",
    rating: 8.4,
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2002,
    description: "Naruto Uzumaki, a mischievous adolescent ninja, struggles as he searches for recognition and dreams of becoming the Hokage, the village's leader and strongest ninja.",
    episodes: 220,
    studio: "Pierrot",
    status: "completed"
  },
  {
    id: "in-anime-3",
    title: "Dragon Ball Z (Hindi Dub)",
    coverImage: "https://i.imgur.com/4t1Iyfz.jpg", 
    rating: 8.7,
    genres: ["Action", "Adventure", "Fantasy"],
    year: 1989,
    description: "After learning that he is from another planet, a warrior named Goku and his friends are prompted to defend it from an onslaught of extraterrestrial enemies.",
    episodes: 291,
    studio: "Toei Animation",
    status: "completed"
  },
  {
    id: "in-anime-4",
    title: "Motu Patlu",
    coverImage: "https://i.imgur.com/K3j0vJ4.jpg",
    rating: 6.8,
    genres: ["Animation", "Comedy"],
    year: 2012,
    description: "Two friends, Motu and Patlu, living in a fictional town called Furfuri Nagar, always get into trouble and adventure.",
    episodes: 1000,
    studio: "Cosmos-Maya",
    status: "ongoing"
  },
  {
    id: "in-anime-5",
    title: "One Piece (Hindi Dub)",
    coverImage: "https://i.imgur.com/h0fFQfq.jpg",
    rating: 8.9,
    genres: ["Action", "Adventure", "Fantasy"],
    year: 1999,
    description: "Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger.",
    episodes: 1000,
    studio: "Toei Animation",
    status: "ongoing"
  }
];

export const indianBooks = [
  {
    id: "in-book-1",
    title: "The White Tiger",
    coverImage: "https://i.imgur.com/EGJUwNt.jpg",
    rating: 8.1,
    genres: ["Fiction", "Drama", "Crime"],
    year: 2008,
    description: "A darkly humorous perspective of India's class struggle through a retrospective narration from Balram Halwai, a village boy.",
    author: "Aravind Adiga",
    pages: 304,
    publisher: "Free Press"
  },
  {
    id: "in-book-2",
    title: "The God of Small Things",
    coverImage: "https://i.imgur.com/uF1LlR3.jpg",
    rating: 8.3,
    genres: ["Fiction", "Drama", "Coming-of-Age"],
    year: 1997,
    description: "The story of the tragic decline of an Indian family whose members suffer the terrible consequences of forbidden love.",
    author: "Arundhati Roy",
    pages: 321,
    publisher: "Harper Collins"
  },
  {
    id: "in-book-3",
    title: "The Palace of Illusions",
    coverImage: "https://i.imgur.com/7jN8RNN.jpg",
    rating: 7.9,
    genres: ["Fiction", "Mythology", "Historical"],
    year: 2008,
    description: "A reimagining of the world-famous Indian epic, the Mahabharata, told from the point of view of an amazing woman—Panchaali.",
    author: "Chitra Banerjee Divakaruni",
    pages: 360,
    publisher: "Doubleday"
  },
  {
    id: "in-book-4",
    title: "Midnight's Children",
    coverImage: "https://i.imgur.com/LG59OPZ.jpg",
    rating: 8.7,
    genres: ["Fiction", "Magical Realism", "Historical"],
    year: 1981,
    description: "Born at the stroke of midnight on August 15, 1947, the day of India's independence, Saleem Sinai finds himself mysteriously 'handcuffed to history'.",
    author: "Salman Rushdie",
    pages: 647,
    publisher: "Jonathan Cape"
  },
  {
    id: "in-book-5",
    title: "Train to Pakistan",
    coverImage: "https://i.imgur.com/SRlnlL0.jpg",
    rating: 8.0,
    genres: ["Fiction", "Historical", "Drama"],
    year: 1956,
    description: "The story takes place during the Partition of India in 1947, and follows the impact of this event on the fictional village of Mano Majra.",
    author: "Khushwant Singh",
    pages: 181,
    publisher: "Chatto & Windus"
  }
];

export const indianSeries = [
  {
    id: "in-series-1",
    title: "Sacred Games",
    coverImage: "https://i.imgur.com/VQDGpTD.jpg",
    rating: 8.7,
    genres: ["Crime", "Drama", "Thriller"],
    year: 2018,
    description: "A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.",
    seasons: 2,
    episodes: 16,
    network: "Netflix",
    status: "completed"
  },
  {
    id: "in-series-2",
    title: "Mirzapur",
    coverImage: "https://i.imgur.com/aSfRmsZ.jpg",
    rating: 8.5,
    genres: ["Action", "Crime", "Thriller"],
    year: 2018,
    description: "A shocking incident at a wedding procession ignites a series of events entangling the lives of two families in the lawless city of Mirzapur.",
    seasons: 2,
    episodes: 19,
    network: "Amazon Prime Video",
    status: "ongoing"
  },
  {
    id: "in-series-3",
    title: "The Family Man",
    coverImage: "https://i.imgur.com/EkYJZh4.jpg",
    rating: 8.7,
    genres: ["Action", "Comedy", "Drama"],
    year: 2019,
    description: "A middle-class man working for India's National Investigation Agency as undercover agent while bearing his personal life struggles.",
    seasons: 2,
    episodes: 19,
    network: "Amazon Prime Video",
    status: "ongoing"
  },
  {
    id: "in-series-4",
    title: "Scam 1992: The Harshad Mehta Story",
    coverImage: "https://i.imgur.com/EWMtd9E.jpg",
    rating: 9.5,
    genres: ["Biography", "Crime", "Drama"],
    year: 2020,
    description: "The story of Harshad Mehta, a stockbroker who took the stock market to dizzying heights and his catastrophic downfall.",
    seasons: 1,
    episodes: 10,
    network: "SonyLIV",
    status: "completed"
  },
  {
    id: "in-series-5",
    title: "Delhi Crime",
    coverImage: "https://i.imgur.com/8Q5Ptt1.jpg",
    rating: 8.5,
    genres: ["Crime", "Drama", "Thriller"],
    year: 2019,
    description: "Based on the Nirbhaya case, Delhi Police investigates the case of the brutal gang rape and murder.",
    seasons: 2,
    episodes: 14,
    network: "Netflix",
    status: "ongoing"
  }
];

export const indianTrendingItems = [
  {
    id: "in-trend-1",
    title: "Animal",
    coverImage: "https://i.imgur.com/4KNs9vV.jpg",
    rating: 8.4,
    genres: ["Action", "Crime", "Drama"],
    year: 2023,
    description: "A father, who is hardly at home during his son's childhood, expects his unwavering love and devotion after he grows up."
  },
  {
    id: "in-trend-2",
    title: "Heeramandi",
    coverImage: "https://i.imgur.com/eX1pHAt.jpg",
    rating: 8.2,
    genres: ["Drama", "Historical"],
    year: 2024,
    description: "The lives of courtesans in the red-light district of Heera Mandi during the Indian Independence movement against the British Raj."
  },
  {
    id: "in-trend-3",
    title: "Munjya",
    coverImage: "https://i.imgur.com/4zWvdRr.jpg",
    rating: 7.5,
    genres: ["Horror", "Comedy"],
    year: 2024,
    description: "A vengeful spirit comes back to wreak havoc on the living who disturbed his peace."
  },
  {
    id: "in-trend-4",
    title: "Panchayat",
    coverImage: "https://i.imgur.com/8Rnfk9N.jpg",
    rating: 8.9,
    genres: ["Comedy", "Drama"],
    year: 2020,
    description: "An engineering graduate takes up a job as secretary of a Panchayat office in a remote village in Uttar Pradesh."
  },
  {
    id: "in-trend-5",
    title: "Shrimad Ramayan",
    coverImage: "https://i.imgur.com/LYhFJUQ.jpg",
    rating: 8.6,
    genres: ["Mythology", "Drama", "Historical"],
    year: 2023,
    description: "The epic story of Lord Ram, his exile, and the battle against evil king Ravana."
  },
  {
    id: "in-trend-6",
    title: "Kalki 2898 AD",
    coverImage: "https://i.imgur.com/kbXxzxB.jpg",
    rating: 8.3,
    genres: ["Sci-Fi", "Action", "Fantasy"],
    year: 2024,
    description: "Set in the year 2898 AD in a post-apocalyptic world, this film blends mythology with futuristic elements."
  }
];

export const indianFeaturedItem = {
  title: "Jawan",
  description: "A prison warden recruits inmates to commit outrageous crimes that target the wealthy and corrupt.",
  coverImage: "https://i.imgur.com/AsdpTQb.jpg",
  link: "/movie/in-movie-jawan",
  buttonText: "Watch Now"
};
