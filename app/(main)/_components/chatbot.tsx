// components/Chatbot.tsx

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


const Chatbot: React.FC = () => {

    const [inputValue, setInputValue] = useState<string>('');
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [resultLink, setResultLink] = useState<string | null>(null);
    const [receivedMessage, setReceivedMessage] = useState<string | null>(null);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        
        // Do something with the input locally, for example, store it in state
        setReceivedMessage(inputValue);

        const corsProxyUrl = 'https://api.allorigins.win/get?';
        const apiUrl = `https://utilapi.geeksforgeeks.org/api/gfgsearch/?page=1&sort=relevance&type=premium&query=${inputValue}&search_type=google`;

        fetch(corsProxyUrl + apiUrl)
        .then(response => response.json())
        .then(data => {
            // Check if 'items' key exists and has at least one item
            if (data.response && data.response.items && data.response.items.length > 0) {
                // Access the formattedUrl of the first item
                const formattedUrl = data.response.items[0].formattedUrl;

                // Open the URL in a new window
                window.open(formattedUrl);
            } else {
                console.error('No relevant items found in the response.');
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    

        // Optionally, you can clear the input value if needed
        setInputValue('');
    };


    useEffect(() => {
        // This effect will run whenever receivedMessage changes
    }, [receivedMessage]);

    const toggleExpansion = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
        setResultLink(null);
        
    };
    
    

    return (
        <div className="fixed bottom-4 right-4">
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
            {isExpanded && (
                <div className="bg-white dark:bg-gray-600 p-4 rounded shadow-md mt-2">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Ask me anything!"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="dark:hidden flex-1 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:border-gray-600 focus:ring-gray-600 transition"
                        />
                    
                    <input
                        type="text"
                        placeholder="Ask me anything!"
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
                    
                    
                </div>
            )}
        </div>

        
    );
};

export default Chatbot;
