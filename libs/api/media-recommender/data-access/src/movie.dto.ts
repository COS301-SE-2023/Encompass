export class MovieDto {
    readonly _id!: string;
    readonly Release_Date!: string; // Assuming the original value is a string in ISO 8601 format
    readonly Title!: string;
    readonly Overview!: string;
    readonly Popularity!: number;
    readonly Vote_Count!: number;
    readonly Vote_Average!: number;
    readonly Original_Language!: string;
    readonly Genre!: string;
    readonly Poster_Url!: string;
}