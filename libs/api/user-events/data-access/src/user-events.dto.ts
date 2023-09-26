export class UserEventsDto{
  readonly _id!: string;
  readonly events!: {
    eventId: string,
    userAnswers: string[],
    numCorrect: number,
    quizComplete: boolean
  }[]
}