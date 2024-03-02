// components/Chatbot.tsx

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';


import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
import { Spinner } from '@/components/spinner';
import { Separator } from '@/components/ui/separator';
import remarkGfm from 'remark-gfm';


const Chatbot: React.FC = () => {

    const [inputValue, setInputValue] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [resultLink, setResultLink] = useState<string | null>(null);
    const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
    const [responses, setResponses] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatbotRef = useRef<HTMLDivElement | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // Focus on the input box when the component is mounted or isExpanded state changes
        if (isExpanded && inputRef.current) {
          inputRef.current.focus();
        }
      }, [isExpanded]);
    

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleCopyToClipboard = () => {
        const coachResult = responses.join('\n\n');
        navigator.clipboard.writeText(coachResult)
          .then(() => {
            alert('Coach result copied to clipboard!');
          })
          .catch((error) => {
            console.error('Clipboard write failed:', error);
            alert('Failed to copy coach result to clipboard');
          });
      };
    

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        
        // Do something with the input locally, for example, store it in state
        setReceivedMessage(inputValue);

        setIsLoading(true);

        const MODEL_NAME = "gemini-1.0-pro";
        const API_KEY = "AIzaSyB5W2pUunlE3xkXLqTYinbR858NSk4Iz-U";
        
        async function runChat(inputValue: string) {
          const genAI = new GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        
          const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          };
        
          const safetySettings = [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
          ];
        
          const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
            ],
          });
        
          const result = await chat.sendMessage(inputValue);
          const response = result.response;
          console.log(result);
          const markdownResponse = response.text();
          setResponses(prevResponses => [...prevResponses,`${inputValue}`, markdownResponse]);
        }
        
        try{
            await runChat(inputValue);
        }
        finally{
            setIsLoading(false);
        }
        // Optionally, you can clear the input value if needed
        setInputValue('');
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
          if (chatbotRef.current && !chatbotRef.current.contains(e.target as Node)) {
            // Clicked outside the chatbot interface
            setIsExpanded(false);
            setResultLink(null);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

    useEffect(() => {
        // This effect will run whenever receivedMessage changes
    }, [receivedMessage]);

    const toggleExpansion = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
        setResultLink(null);
        
    };
    
    

    return (
        
        <div 
            ref={chatbotRef}
            className={`fixed bottom-4 right-4 ${isExpanded ? 'w-1/2 max-w-screen-md' : 'w-12'}`}>
            <Button
                onClick={toggleExpansion}
                className={`dark:hidden bg-[#1F1F1F] text-white rounded-full p-2 ${
                    isExpanded ? 'w-12 h-12' : 'w-12 h-12'
                } transition-all duration-300`    
            }
                size="sm"
                variant="outline"
            >
                {isExpanded ? (<Image
                    src="/chatbot.png"
                    height="30"
                    width="30"
                    alt='Close'
                />) : (<Image
                    src="/chatbot.png"
                    height="30"
                    width="30"
                    alt='Chat'
                />)}
            </Button>
            <Button
                onClick={toggleExpansion}
                className={`hidden dark:block bg-white text-white rounded-full p-2 ${
                    isExpanded ? 'w-12 h-12' : 'w-12 h-12'
                } transition-all duration-300`    
            }
                size="sm"
                variant="outline"
            >
                {isExpanded ? (<Image
                    src="/chatbot-dark.png"
                    height="30"
                    width="30"
                    alt='Close'
                />) : (<Image
                    src="/chatbot-dark.png"
                    height="30"
                    width="30"
                    alt='Chat'
                />)}
            </Button>
            {isExpanded && (
                <div className="bg-white dark:bg-gray-600 p-4 rounded shadow-md mt-2 max-h-96 overflow-y-auto">
                    {responses.map((response, index) => (
                        <div key={index} className="mt-2">
                            { index % 2 === 0 ? (
                                <span className="text-gray-600 dark:text-gray-400">Me:<br /></span>
                            ):(
                        <span className="text-gray-600 dark:text-gray-400">Coach:</span>
                        
                            )}
                        <p className="text-gray-800 dark:text-white break-words p-2">
                            
                           
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            >{response}
                        </ReactMarkdown>
                        </p>
                        <div key={index} className="flex justify-end mt-1 mb-2">
                            { index % 2 !== 0 &&
                            <Button onClick={handleCopyToClipboard} className="bg-[#1F1F1F] text-white px-4 py-2 rounded" variant="ghost">
                                Copy Coach Result
                            </Button>
                            }
                        </div>
                        <Separator className='font-bold mb-5' />
                 </div>
                ))}
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Questions ready? Fire away! 🚀"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="dark:hidden flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:border-gray-600 focus:ring-gray-600 transition"
                        />
                    
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Questions ready? Fire away! 🚀"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="hidden dark:block flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:border-gray-100 focus:ring-gray-100 transition"
                        />

                        <Button type="submit" className="dark:hidden bg-[#1F1F1F] text-white px-4 py-2 rounded" variant="ghost">
                            Send
                        </Button>

                        <Button type="submit" className="hidden dark:block bg-white text-gray-600 px-4 py-2 rounded" variant="ghost">
                            Send
                        </Button>
                    </form>
                    {isLoading && (
                     <div className="flex items-center justify-center mt-3">
                        <Spinner />
                     </div>
                    )}
                    
                </div>
            )}
        </div>

        
    );
};

export default Chatbot;
