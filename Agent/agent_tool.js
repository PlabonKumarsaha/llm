import 'dotenv/config';
import { Agent, run } from '@openai/agents';

const agent = new Agent({
  name: 'Weather agent',
  instructions: 'You are a weather assistant. Provide weather information for a given location.',
});

async function main(query = '') {
  const result = await run(
    agent,
    query,
  );
  console.log('Result:', result.finalOutput);
}
main('I am Plabon. tell me the weather in Narayanganj');