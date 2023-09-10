export class CreateEventRequest {
  name!: string | null;
  host!: string | null;
  community!: string | null;
  description!: string | null;
  startDate!: Date | null;
  endDate!: Date | null;
  members!: string[];
  prompt!: string[] | null;
  categories!: string[] | null;
  numberOfQuestions!: number;
  quizDescription!: string;
}
