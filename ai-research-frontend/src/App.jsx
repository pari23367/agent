import { useState } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';


import { marked } from 'marked';
import DOMPurify from 'dompurify';


// ... inside your component
function createMarkup(text) {
  // Strip unwanted <think> tags
  const cleanText = text.replace(/<\/?think>/g, '');
  // Convert Markdown to HTML, sanitize it
  const html = marked(cleanText);
  return { __html: DOMPurify.sanitize(html) };
}


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
      <h1>Ask Agent anything</h1>
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
     

                    <div
                style={{
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid #333',
                  maxWidth: '80%',
                  margin: '20px auto',
                  fontFamily: 'sans-serif',
                  lineHeight: 1.6,
                }}  //for ugly fonts and weird hashs 
                dangerouslySetInnerHTML={createMarkup(responseText)}
              ></div>


    </div>
  );
}

export default App;
