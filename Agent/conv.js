import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

const executeSql = tool({
  name: 'execute_sql',
  description: 'This executes the given sql query',
  parameters: z.object({
    sqlQuery: z.string().describe('sql query'),
  }),
  execute: async function ({ sqlQuery }) {
    console.log('Executing SQL query:', sqlQuery);
    return `SQL query executed successfully`;
  },
});

const sqlAgent = new Agent({
  name: 'SQL Expert Agent',
  instructions: `
        You are an expert SQL Agent that is specialized in generating SQL queries as per user request.

        Postgres Schema:
    -- users table
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- comments table
    CREATE TABLE comments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      comment_text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    `,
  outputType: z.object({
    sqlQuery: z.string().optional().describe('sql query'),
  })
});

async function main(q = '') {
  const result = await run(sqlAgent, q);
  console.log(`Result history`, result.history);
  console.log(`Query`, result.finalOutput.sqlQuery);
}
await main("my name is PKS")

console.log(`break`);
await main('get me all the comments with my name');