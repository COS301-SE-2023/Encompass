export class GetQuestions{
  async getQuestions(): Promise<{
    question: string,
    options: string[],
    answer: string,
  }[]>{
    const questions = [
      {
        question: 'What is the capital of Italy?',
        options: ['Paris', 'London', 'Rome', 'Madrid'],
        answer: 'Rome',
      },
      {
        question: 'Which planet is known as the Red Planet?',
        options: ['Mars', 'Jupiter', 'Venus', 'Neptune'],
        answer: 'Mars',
      },
      {
        question: 'What is the largest mammal?',
        options: ['Elephant', 'Blue Whale', 'Giraffe', 'Lion'],
        answer: 'Blue Whale',
      },
      {
        question: 'What is the smallest prime number?',
        options: ['1', '2', '3', '5'],
        answer: '2',
      },
      {
        question: 'Which gas do plants use for photosynthesis?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        answer: 'Carbon Dioxide',
      },
      {
        question: 'What is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        answer: 'Pacific Ocean',
      },
      {
        question: 'Which famous scientist developed the theory of relativity?',
        options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Nikola Tesla'],
        answer: 'Albert Einstein',
      },
      {
        question: 'What is the chemical symbol for gold?',
        options: ['Au', 'Ag', 'Fe', 'Hg'],
        answer: 'Au',
      },
      {
        question: 'Which country is known as the Land of the Rising Sun?',
        options: ['China', 'South Korea', 'Japan', 'Vietnam'],
        answer: 'Japan',
      },
      {
        question: 'Which element is essential for human bones?',
        options: ['Iron', 'Calcium', 'Potassium', 'Sodium'],
        answer: 'Calcium',
      },
      {
        question: 'Who painted the Mona Lisa?',
        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
        answer: 'Leonardo da Vinci',
      },
      {
        question: 'What is the largest planet in our solar system?',
        options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
        answer: 'Jupiter',
      },
      {
        question: 'Which gas do plants release during photosynthesis?',
        options: ['Carbon Dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'],
        answer: 'Oxygen',
      },
      {
        question: 'Which instrument is used to measure temperature?',
        options: ['Barometer', 'Thermometer', 'Hygrometer', 'Anemometer'],
        answer: 'Thermometer',
      },
      {
        question: 'What is the chemical symbol for water?',
        options: ['W', 'O', 'H2', 'H2O'],
        answer: 'H2O',
      },
    ]
    return questions;
  }
}