## Messenger with AI Automation

**Messenger with AI Automation** is a simple chat-style UI that connects to a local Ollama model (`llama3.2`) via the `/api/ollama` route. Users can type questions about full‑stack development and get concise answers from an AI assistant.

### Prerequisites

- **Node.js** (LTS recommended)
- **Ollama** installed and running on the same machine  
  - Download Ollama from the official site and install it.  
  - Make sure the `llama3.2` model is available, for example:

```bash
ollama pull llama3.2
```

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Run the development server**

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser.

### How to Use the App

- **Start chatting**
  - In your browser, go to `http://localhost:3000`.
  - You’ll see a messenger-style interface with a short welcome message.
  - Type your question or prompt in the text area at the bottom (max 300 characters).
  - Press **Enter** (without Shift) or click the **Send** button.

- **What happens behind the scenes**
  - The frontend sends your `prompt` to the API route: `POST /api/ollama`.
  - The API calls `ollama.chat` with the `llama3.2` model and a friendly system instruction.
  - The AI’s reply is returned and rendered as a chat bubble in the conversation.

- **Best way to use it**
  - Ask specific questions about **frontend, backend, databases, or deployment**.
  - You can send multiple messages; the UI will show your messages on the right and AI replies on the left.

### API Details (for developers)

- **Endpoint**: `POST /api/ollama`
- **Request body (JSON)**:

```json
{
  "prompt": "Your question here"
}
```

- **Successful response (JSON)**:

```json
{
  "success": true,
  "prompt": "Your original prompt",
  "response": "AI response text"
}
```

- **Error response (JSON)**:

```json
{
  "success": false
}
```

### Production Use

- Set up **Ollama** on your server and ensure the model `llama3.2` is available.
- Build and start the Next.js app:

```bash
npm run build
npm start
```

Then point users to your deployed URL; they can use the app exactly as described above.
