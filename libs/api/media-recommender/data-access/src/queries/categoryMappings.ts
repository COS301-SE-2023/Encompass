interface CategoryMapping {
  movies: string[];
  novels: string[];
  podcasts: string[];
}

export const categoryMappings: { [key: string]: CategoryMapping } = {
  "Action": { movies: ["Action"], novels: ["Action"], podcasts: [] },
  "Adventure": { movies: ["Adventure"], novels: ["Adventure"], podcasts: ["Places & Travel","Regional","Hobbies","Games & Hobbies","Outdoor", "Sports & Recreation"] },
  "Animation": { movies: ["Animation"], novels: ["Picture Books", "Kids", "Childrens"], podcasts: ["Other Games"] },
  "Anime": { movies: ["Animation"], novels: ["Anime", "Manga", "Comics Manga", "Japan"], podcasts: [] },
  "Arts": { movies: [""], novels: ["Art"], podcasts: ["Performing Arts", "Visual Arts", "Arts","Literature","Design"] },
  "Business": { movies: [""], novels: ["Business", "Economics"], podcasts: ["Professional", "Management & Marketing", "Government & Organizations", "Self-Help", "Business", "Business News", "Careers","News & Politics","Training","Investing","Non-Profit"] },
  "Comedy": { movies: ["Comedy"], novels: ["Comedy", "Humor"], podcasts: ["Comedy"] },
  "Documentary": { movies: ["Documentary"], novels: ["Nonfiction", "Biography", "Memoir", "Biography Memoir", "Autobiography"], podcasts: ["History", "Podcasting","Higher Education","News & Politics"] },
  "Drama": { movies: ["Drama"], novels: ["Drama"], podcasts: ["College & High School", "Society & Culture"] },
  "Fantasy": { movies: ["Fantasy"], novels: ["Fantasy", "High Fantasy", "Magic"], podcasts: ["Educational Technology","Literature"] },
  "Geography": { movies: [""], novels: ["Geography"], podcasts: [] },
  "History": { movies: ["History"], novels: ["History", "Historical", "Biography", "Memoir", "Biography Memoir", "Autobiography"], podcasts: ["History"] },
  "Horror": { movies: ["Horror"], novels: ["Horror", "Thriller", "Suspense"], podcasts: [] },
  "Hospitality": { movies: [""], novels: ["Food", "Cooking"], podcasts: ["Food"] },
  "Life-Science": { movies: ["Science Fiction"], novels: ["Biology", "Evolution"], podcasts: ["Science & Medicine", "Natural Sciences","Medicine"] }, // Group similar categories together
  "Mathematics": { movies: ["Science Fiction"], novels: ["Mathematics"], podcasts: ["Educational Technology","Higher Education"] },
  "Musical": { movies: ["Music"], novels: ["Music"], podcasts: ["Music"] },
  "Mystery": { movies: ["Mystery", "Thriller", "Crime"], novels: ["Mystery", "Thriller", "Crime", "Suspense"], podcasts: [] },
  "Physics": { movies: ["Science Fiction"], novels: ["Science"], podcasts: ["Tech News", "Educational Technology","Higher Education", "Technology", "Gadgets"] },
  "Romance": { movies: ["Romance"], novels: ["Romance", "Love"], podcasts: [] },
  "Science-Fiction": { movies: ["Science Fiction"], novels: ["Science Fiction", "Science Fiction Fantasy", "Dystopia"], podcasts: ["Tech News", "Gadgets" ,"Technology","Educational Technology","Software How-To"] },
  "Western": { movies: ["Western"], novels: ["Western", "Westerns"], podcasts: [] },
  "War": { movies: ["War"], novels: ["War", "World War II", "Holocaust"], podcasts: [] },
};
