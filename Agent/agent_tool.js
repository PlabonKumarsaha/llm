import 'dotenv/config';
import { Agent, run,tool } from '@openai/agents';
import { z } from 'zod';

const getWeatherTool = tool({
 name: 'getWeather',
 description: 'useful for when you want to get the current weather in a given location',
 parameters: z.object({
   location: z.string().describe('name of the city'),
 }),
 execute: async ({ city }) => {
   return `The current weather in ${city} is okay`;
 },
})
const agent = new Agent({
  name: 'Weather agent',
  instructions: 'You are a weather assistant. Provide weather information for a given location.',
  tools: [getWeatherTool],
});

async function main(query = '') {
  const result = await run(
    agent,
    query,
  );
  console.log('Result:', result.finalOutput);
}
main('Dhaka');