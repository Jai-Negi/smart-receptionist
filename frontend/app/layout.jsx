import './globals.css';

export const metadata = {
  title: 'AI Receptionist Chatbot',
  description: 'RAG-powered AI receptionist',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
