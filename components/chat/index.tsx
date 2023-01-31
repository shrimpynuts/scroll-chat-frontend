import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Message from "./Message";
import moment, { Moment } from "moment";
import useIntersectionObserver from "@/lib/hooks/use-intersection-observer";

const mockMessages: IMessage[] = [
  {
    text: "What is Scroll?",
    isUser: true,
    created_at: moment(),
    id: "1",
  },
  {
    text: "Scroll is a test network consisting of Scroll L1 and Scroll L2, a fork of Ethereum utilizing a PoA-based consensus, and a zero-knowledge rollup testnet deployed on top of the former.\nSOURCES: https://guide.scroll.io/",
    isUser: false,
    created_at: moment(),
    id: "1",
  },
];

export interface IMessage {
  created_at: Moment;
  id: string;
  text: string;
  isUser: boolean;
}

export default function Search() {
  const [textArea, setTextArea] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>(mockMessages);

  // Some ref's to manipulate scroll position
  const messageEndRef = useRef<HTMLInputElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  const scrollIsTyping = messages.length % 2 === 1;
  const entry = useIntersectionObserver(messageEndRef, {});

  useEffect(() => {
    inputEl.current && inputEl.current?.focus();
  }, [inputEl]);

  useEffect(() => {
    inputEl.current && inputEl.current?.focus();
    scrollToBottom();
  }, [messages]);

  const onTextAreaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextArea(event.target.value);
  };

  const getAnswer = async (question: string) => {
    const response = await fetch("/api/get_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: data.answer,
        isUser: false,
        created_at: moment(),
        id: "1",
      },
    ]);
  };

  const triggerCall = async () => {
    setMessages((oldMessages) => [
      ...oldMessages,
      {
        text: textArea,
        isUser: true,
        created_at: moment(),
        id: "1",
      },
    ]);
    getAnswer(textArea);
    setTextArea("");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") triggerCall();
  };

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full rounded-xl border border-gray-200 bg-white p-8 shadow-md">
      <div className="relative flex w-full flex-col justify-between">
        <div className="-mr-4 flex h-[36rem] flex-col space-y-2 overflow-y-scroll scrollbar-hide">
          {messages.map((message, index) => (
            <div key={index}>
              <Message message={message} />
            </div>
          ))}
          <div
            className={`absolute bottom-[4.8rem] -right-[0.5rem] cursor-pointer rounded-full border border-gray-600 bg-white ${
              entry?.isIntersecting ? "hidden" : "visible"
            }`}
            onClick={scrollToBottom}
          >
            <ChevronDownIcon className="h-6 w-6  text-gray-600" />
          </div>
          <div ref={messageEndRef}></div>
        </div>
        <div className="mt-8 flex items-center justify-end space-x-2">
          <input
            type="text"
            onKeyDown={onKeyDown}
            disabled={scrollIsTyping}
            className="w-2/3 whitespace-nowrap rounded-xl border-gray-300 focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-500"
            value={textArea}
            onChange={onTextAreaChange}
            autoFocus
            placeholder="Ask a question about Scroll..."
            ref={inputEl}
          />
          <button
            onClick={triggerCall}
            disabled={scrollIsTyping}
            className="rounded-xl border border-gray-300 p-2 hover:border-blue-600 disabled:cursor-not-allowed disabled:text-gray-500"
          >
            <ArrowRightIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
