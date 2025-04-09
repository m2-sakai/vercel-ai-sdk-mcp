'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } =
    useChat();
  return (
    <div className='flex flex-col items-center w-full min-h-screen bg-gray-100 dark:bg-gray-900'>
      <div className='flex flex-col w-full max-w-5xl p-6 mt-12 bg-white rounded-lg shadow-lg dark:bg-gray-800'>
        <h1 className='text-2xl font-bold text-center text-gray-800 dark:text-gray-100'>
          Chat with Open AI
        </h1>
        <div className='flex flex-col gap-4 mt-4 overflow-y-auto max-h-[40rem]'>
          {messages
            .filter((message) =>
              message.parts.some((part) => part.type === 'text' && part.text.trim() !== '')
            )
            .map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-blue-900 self-end'
                    : 'bg-gray-200 text-gray-900 self-start'
                }`}
              >
                <span className='font-semibold'>
                  {message.role === 'user' ? 'User: ' : 'AI: '}
                </span>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <span key={`${message.id}-${i}`} className='block'>
                          {part.text}
                        </span>
                      );
                  }
                })}
              </div>
            ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-2 mt-4'
        >
          <input
            type='text'
            value={input}
            onChange={handleInputChange}
            className='w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600'
            placeholder='メッセージを入力してください'
            disabled={status !== 'ready'}
          />
          <button
            type='submit'
            className='px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
            disabled={status !== 'ready'}
          >
            {status !== 'ready' ? '・・・' : '送信'}
          </button>
        </form>
      </div>
    </div>
  );
}
