export class UpdateEventRequest{
  eventId!: string;
  userAnswers!: string[];
  numCorrect!: number;
  quizComplete!: boolean;
}