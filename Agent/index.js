import 'dotenv/config';
import { Agent, run } from '@openai/agents';

const location= 'AUS'
const agent = new Agent({
  name: 'Hello agent',
  instructions: function(){
    if (location === 'BD'){
      return 'You are an jokester . say different jokes in  Bangla'
    }else{
      return 'You are an jokester . say different jokes in  English'
    }
  }
});

const result = await run(
  agent,
  'I am Plabon. tell me a joke',
);
console.log(result.finalOutput);

// Code within the code,
// Functions calling themselves,
// Infinite loop's dance.