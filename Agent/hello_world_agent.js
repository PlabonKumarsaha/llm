import 'dotenv/config';
import { Agent, run } from '@openai/agents';

const agent = new Agent({
  name: 'Hello agent',
  instructions: 'You are an jokester . say different jokes',
});

const result = await run(
  agent,
  'I am Plabon. tell me a joke',
);
console.log(result.finalOutput);

// Code within the code,
// Functions calling themselves,
// Infinite loop's dance.