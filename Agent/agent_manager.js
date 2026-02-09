import 'dotenv/config';
import { Agent, tool,run } from '@openai/agents';
import { z } from 'zod';


const fetchAvailablePlans = tool({
    name: 'fetch_available_plans',
    description: 'returns the list of available plans for internet',
    parameters: z.object({}),
    execute: async function () {
      console.log('Fetching available plans');
      return [{
        plan_id: '1',
        plan_name: 'Basic',
        plan_price: 9.99,
        plan_features: ['100GB data', '50 emails', '100 contacts'],
      },
      {
        plan_id: '2',
        plan_name: 'Standard',
        plan_price: 19.99,
        plan_features: ['500GB data', '200 emails', '500 contacts'],
      },
      {
        plan_id: '3',
        plan_name: 'Premium',
        plan_price: 29.99,
        plan_features: ['1TB data', '500 emails', '1000 contacts'],
      }
    ]
    },
})
const salesAgent = new Agent({
  name: 'Sales Agent',
  instructions: `
        You are an expert sales agent for internal company.
        Talk to the user to help them with their sales inquiries.
    `,
    tools: [fetchAvailablePlans],
},
)


async function runSalesAgent(query = '') {
  const result = await run(salesAgent, query);
  console.log('Result:', result.finalOutput);
}

runSalesAgent('I am Plabon. what are the available plans for internet?');