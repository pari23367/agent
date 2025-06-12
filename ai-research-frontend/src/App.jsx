import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  async function generateAnswer() {
    if (!prompt.trim()) {
      alert("Please enter a prompt first.");
      return;
    }

    setLoading(true);
    console.log("TOGETHER KEY →", import.meta.env.VITE_TOGETHER_API_KEY);

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.together.xyz/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`, // Make sure .env uses VITE_
          'Content-Type': 'application/json',
        },
        data: {
          model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
          messages: [
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 512,
        },
      });

      setResponseText(response.data.choices[0].message.content);
        console.log("Model replied:", response.data.choices[0].message.content);
        console.log("API Key:", import.meta.env.VITE_TOGETHER_API_KEY);

    } catch (err) {
      console.error('Error generating response:', err.response?.data || err.message);
      setResponseText('Failed to get response.');
    }
    setLoading(false);
  }

  return (
    <div className="App">
      <h1>Ask DeepSeek Anything</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Write your prompt here"
        style={{ width: '60%', padding: '10px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={generateAnswer} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Answer'}
      </button>
     

      <div style={{
  marginTop: '20px',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  backgroundColor: '#1e1e1e',
  color: 'white',
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  maxWidth: '80%',
  marginLeft: 'auto',
  marginRight: 'auto'
}}>
  {responseText}
</div>

    </div>
  );
}

export default App;
