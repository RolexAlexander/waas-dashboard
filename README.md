# WaaS 2.0 - Workforce as a Service

WaaS 2.0 is a platform for creating, managing, and simulating autonomous agent workforces. It allows you to design organizational structures with hierarchical agents, define their roles and permissions, and run simulations to see how they collaborate to accomplish goals.

## Features

- **Organization Builder**: Design custom organizations with hierarchical agent structures
- **Agent Management**: Create and configure agents with specific roles and permissions
- **Tool Library**: Access a wide range of tools that agents can use to accomplish tasks
- **Simulation**: Run simulations to see how your organization performs on specific goals
- **Analytics**: Track performance metrics, costs, and efficiency
- **Playground**: Experiment with different configurations in isolated environments

## Getting Started

### Prerequisites

- Node.js 16+
- A Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file by copying `.env.local.example` and adding your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Demo Organizations

WaaS 2.0 comes with several pre-built demo organizations:

- **Storybook Studio**: A creative team that produces children's books
- **Agile Innovators**: A software development team using agile methodologies
- **Creative Ad Agency**: A team that creates advertising campaigns
- **Market Insights Inc.**: A market research organization
- **The Blog Farm**: A content creation team for blog articles

## Key Concepts

### Agents

Agents are the core building blocks of your organization. Each agent has:
- A name and role
- A set of permissions (delegate, assign roles, hire, call meetings)
- Access to specific tools based on their environment

### Environments

Environments define the context in which agents operate, including:
- Available tools
- Initial state
- Permission rules for tool access

### Tools

Tools are the capabilities that agents can use to accomplish tasks:
- Research tools (web search)
- Content creation tools (write articles, create illustrations)
- Analysis tools (analyze data, summarize findings)
- Collaboration tools (start conversations, request human input)

### Standard Operating Procedures (SOPs)

SOPs define standardized workflows for common tasks, specifying:
- Steps to be taken
- Roles responsible for each step
- Dependencies between steps

## Usage

1. **Create or select an organization**: Use the Organizations page to create a new organization or select from demo organizations
2. **Configure your organization**: Add agents, define their roles, and set up environments
3. **Run a simulation**: Go to the Simulate page, enter a goal, and start the simulation
4. **Monitor progress**: Watch as agents collaborate, communicate, and complete tasks
5. **Review results**: Analyze performance metrics and task outcomes

## Development

### Project Structure

- `/src/components`: UI components
- `/src/views`: Page views
- `/src/store`: State management
- `/src/services`: Core services including LLM integration
- `/src/demos`: Pre-built demo organizations
- `/src/types`: TypeScript type definitions

### Key Technologies

- React with TypeScript
- Zustand for state management
- Google Generative AI SDK
- Tailwind CSS for styling
- Lucide React for icons

## Important Note

**Don't forget to create a `.env.local` file by copying `.env.local.example` and adding your Gemini API key!**

Without a valid API key, the simulation features will not work.

## License

This project is licensed under the MIT License.