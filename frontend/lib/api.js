const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendMessage(message, chatHistory = []) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      chat_history: chatHistory,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return await response.json();
}
