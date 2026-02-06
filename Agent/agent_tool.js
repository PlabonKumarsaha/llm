import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';

const getWeatherResultSchema = z.object({
  city: z.string().describe('name of the city'),
  degrees: z.number().describe('temperature in degrees Celsius'),
  description: z.string().describe('description of the weather'),
});

const getWeatherTool = tool({
  name: 'get_weather',
  description: 'returns the current weather information for the given city',
  parameters: z.object({
    city: z.string().describe('name of the city'),
  }),
  execute: async function ({ city }) {
    console.log('Searching for city:', city);
    const url = `https://wttr.in/${city.toLowerCase()}?format=%C+%t`;
    const response = await axios.get(url, { responseType: 'text' });
    return `The weather of ${city} is ${response.data}`;
  },
});

const sendEmailTool = tool({
  name: 'send_email',
  description: 'sends an email to the given email address',
  parameters: z.object({
    email: z.string().describe('email address of the recipient'),
    subject: z.string().describe('subject of the email'),
    body: z.string().describe('body of the email'),
  }),
  execute: async function ({ body, subject, email }) {
    console.log('Sending email to:', email);
    console.log('Subject:', subject);
    console.log('Body:', body);
    return `Email sent to ${email}`;
  },
});

const agent = new Agent({
  name: 'Weather agent',
  instructions: `
        You are an expert weather agent that helps user to tell weather report
    `,
  tools: [getWeatherTool,sendEmailTool],
  outputType:getWeatherResultSchema,
});

async function main(query = '') {
  const result = await run(agent, query);
  console.log('Result:', result.finalOutput.city,result.finalOutput.degrees,result.finalOutput.description);
}

main('What is the weather of Narayanganj, Sydney , Dhaka? send an email to pks@gmail.com. Add a subject "Weather Report" and body "The weather is nice. Prepare a nice body summarizing the data"');
