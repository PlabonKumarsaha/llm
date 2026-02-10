// diverts the whole agent with regard to the worokflow

import 'dotenv/config';
import { Agent, tool,run } from '@openai/agents';
import { z } from 'zod';
import fs from 'node:fs/promises'

// refund agent
const processRefund = tool({
  name: 'process_refund',
  description: 'processes the refund request',
  parameters: z.object({
    customerId: z.string().describe('id of the customer'),
    planId: z.string().describe('id of the plan'),
    reason: z.string().describe('reason for the refund'),
  }),
  execute: async function ({customerId, planId, reason }) {
    console.log('Processing refund for plan:', planId);
    fs.appendFile('./refund.txt', `Processing refund for customer ${customerId} and plan ${planId}\n. The reason for the refund is ${reason}\n`);
    return `Refund issued!`;
  },
});

const refundAgent = new Agent({
  name: 'Refund Agent',
  instructions: `
        You are an expert refund agent for internal company.
        Talk to the user to help them with their refund inquiries.
    `,
    tools: [processRefund]
});

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

//sales agent
const salesAgent = new Agent({
  name: 'Sales Agent',
  instructions: `
        You are an expert sales agent for internal company.
        Talk to the user to help them with their sales inquiries.
    `,
    tools: [fetchAvailablePlans,refundAgent.asTool({
        toolName: 'refund_expert',
        toolDescription: 'refund expert tool',
    })],
},
)

const receptionAgent = new Agent({
  name: 'Reception Agent',
  instructions: `
        You are a customer facing agent expert.
        You are expert in customer needs and hadoff them to the respective 
        expert agent   `,
handoffDescription:`You have two agents available :
Sales agent : Expert in handling queries like all plans and pricing available
Good for new customer
refund agent : Expert in handling refund requests
Good for returning customers
`,
handoffs:[salesAgent,refundAgent]
});


async function main(query = '') {
  const result = await run(receptionAgent, query);
  console.log('Result:', result.finalOutput);
}

main('I am Plabon. what are the best available plans for internet?');