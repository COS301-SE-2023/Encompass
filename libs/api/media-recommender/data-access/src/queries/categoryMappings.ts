interface CategoryMapping {
    movies: string;
    novels: string;
}

export const categoryMappings: { [key: string]: CategoryMapping } = {
    "Adventure": { movies: "Adventure", novels: "Adventure" },
    "Animation": { movies: "Animation", novels: "Picture Books, Kids, Childrens" },
    "Anime": { movies: "-", novels: "Anime, Manga, Comics Manga, Japan" },
    "Arts": { movies: "-", novels: "Art" },
    "Business": { movies: "-", novels: "Business, Economics" },
    "Comedy": { movies: "Comedy", novels: "Comedy, Humor" },
    "Documentary": { movies: "Documentary", novels: "Nonfiction, Biography, Memoir, Biography Memoir, Autobiography" },
    "Drama": { movies: "Drama", novels: "Drama" },
    "Fantasy": { movies: "Fantasy", novels: "Fantasy, High Fantasy, Magic" },
    "Geography": { movies: "-", novels: "Geography" },
    "History": { movies: "History", novels: "History, Historical, Biography, Memoir, Biography Memoir, Autobiography" },
    "Hospitality": { movies: "-", novels: "Food, Cooking" },
    "Life-Science": { movies: "Science-Fiction", novels: "Biology, Evolution" },
    "Mathematics": { movies: "Science-Fiction", novels: "Mathematics" },
    "Musical": { movies: "Music", novels: "Music" },
    "Mystery": { movies: "Mystery, Thriller, Crime", novels: "Mystery, Thriller, Crime, Suspense" },
    "Physics": { movies: "Science-Fiction", novels: "Science" },
    "Romance": { movies: "Romance, Love", novels: "Romance, Love" },
};