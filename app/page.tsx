'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } =
    useChat();
  return (
    <div className='flex flex-col w-full max-w-md py-24 mx-auto gap-4'>
      <h1 className='text-2xl font-bold'>Chat with Gemini</h1>
      {messages.map((message) => (
        <div key={message.id} className='whitespace-pre-wrap'>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <input
          type='text'
          value={input}
          onChange={handleInputChange}
          className='w-full p-2 border border-gray-300 rounded dark:disabled:bg-gray-700'
          placeholder='Type your message...'
          disabled={status !== 'ready'}
        />
        <button
          type='submit'
          className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-700'
          disabled={status !== 'ready'}
        >
          {status !== 'ready' ? '🤔' : 'Send'}
        </button>
      </form>
    </div>
  );
}
