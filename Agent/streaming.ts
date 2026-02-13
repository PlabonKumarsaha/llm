import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import { z } from 'zod';


const agent = new Agent({
  name: 'Storyteller',
  instructions:
    'You are a storyteller. You will be given a topic and you will tell a story about it.',
});


async function main(q: string) {
  const result = await run(agent, q,{stream:true});
const stream = result.toTextStream({compatibleWithNodeStreams: true})
.pipe(process.stdout);
  for await (const event of stream) {
    console.log(event);
  }
}
main('Tell me a story about a cat.').catch((error) => {
  console.error(error);
  process.exit(1);
});