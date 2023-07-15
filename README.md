# 🦚 Find AI
A host, couple of players and a secret AI enter one chat room. Each player (and also the AI) asks one prompt. Everybody answers each prompt. Players try to analyze the answers and find out which one is the AI. At the end, each player votes for another user in the room. If majority votes for the AI, players win. Otherwise, AI wins.

Read [fun facts](fun-facts.md) if you are interested in :)

## Technologies
* Tailwind CSS
* Framer Motion for animations.
* Next.js with TypeScript
* Firebase as Realtime Database.
* ChatGPT as the AI.

## Development
* Clone the repo.
```bash
$ git clone https://github.com/orhanemree/findai.git
$ cd findai
```
* Set up your Firebase project. And make sure you have ChatGPT API key.
* Set up environment variables. Rename `.env.example` to `.env.local` and fill the variables.
* Install dependencies and run the development server.
```bash
$ yarn
$ yarn dev
```

## License
* Licensed under the [MIT License](LICENSE).