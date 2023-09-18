import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

export class GetQuestions {
  async getMockQuestions(): Promise<
    {
      question: string;
      options: string[];
      answer: string;
    }[]
  > {
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
        options: [
          'Atlantic Ocean',
          'Indian Ocean',
          'Arctic Ocean',
          'Pacific Ocean',
        ],
        answer: 'Pacific Ocean',
      },
      {
        question: 'Which famous scientist developed the theory of relativity?',
        options: [
          'Isaac Newton',
          'Albert Einstein',
          'Galileo Galilei',
          'Nikola Tesla',
        ],
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
        options: [
          'Vincent van Gogh',
          'Leonardo da Vinci',
          'Pablo Picasso',
          'Michelangelo',
        ],
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
    ];
    return questions;
  }

  async getQuestions(
    topic: string[],
    categories: string[],
    numQuestions: number
  ): Promise<
    {
      question: string;
      options: string[];
      answer: string;
    }[]
  > {
    if (process.env['NX_ENVIRONMENT'] === 'development') {
      const questions = await this.getMockQuestions();
      return questions;
    } else {
      const generatedQuestions = await this.generateQuestions(
        topic,
        categories,
        numQuestions
      );

      console.log('Generated Questions:\n' + generatedQuestions);

      // Check if generatedQuestions is a string
    if (typeof generatedQuestions !== 'string') {
      throw new Error('Unexpected response format: generatedQuestions is not a string.');
    }

    // Define a regular expression pattern to match JSON objects
    const jsonPattern = /{[^{}]*}/g;

    // Extract JSON objects from the response
    const jsonMatches = generatedQuestions.match(jsonPattern);

    if (!jsonMatches) {
      throw new Error('No JSON objects found in the response.');
    }

    // Parse the extracted JSON objects
    const formattedQuestions = jsonMatches.map((match) => JSON.parse(match));

      return formattedQuestions;
    }
  }

  async generateQuestions(
    topic: string[],
    categories: string[],
    numQuestions: number
  ): Promise<string> {
    const apiKey = process.env['OPENAI_API_KEY'];

    // const prompt = `Generate ${numQuestions} questions based on ${topic}. Only give the output in the JSON format {"question": string, "options": string[4], "answer": string}. Do not provide anything else.`;

    const prompt = `Act as a JSON Object Generate ${numQuestions} quesions based on ${topic} and ${categories} as the categories with the following format: {"question": string, "options": string[4], "answer": string}.`

    console.log('Prompt:\n' + prompt);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt,
          max_tokens: 1500,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response);
      console.log(response.data);
      console.log(response.data.choices[0]);
      console.log(response.data.choices[0].text);
      const generatedQuestions = await response.data.choices[0].text;
      const lines = generatedQuestions.split('\n').filter(Boolean);

      return generatedQuestions;
    } catch (error: any) {
      throw new Error(`Failed to generate questions: ${error.message}`);
    }
  }
}
