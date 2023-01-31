import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Message from "./Message";
import moment, { Moment } from "moment";

const mockMessages: IMessage[] = [
  {
    text: "What is Scroll?\n",
    isUser: true,
    created_at: moment(),
    id: "1",
  },
  {
    text: " Scroll is a test network consisting of Scroll L1 and Scroll L2, a fork of Ethereum utilizing a PoA-based consensus, and a zero-knowledge rollup testnet deployed on top of the former. It consists of pre-deployed demo applications such as a faucet, a bridge, a fork of Uniswap V2, block explorers, and a rollup explorer. The suggested workflow to explore the Testnet includes adding the Pre-Alpha Testnet configurations to a wallet, receiving test tokens in the Scroll L1 network from the Faucet app, transferring test tokens from Scroll L1 to Scroll L2 through the Bridge app, and transferring tokens to other wallets on Scroll L2 using a wallet.\nSOURCES: https://guide.scroll.io/",
    isUser: false,
    created_at: moment(),
    id: "1",
  },
  {
    text: "What is Scroll?\n",
    isUser: true,
    created_at: moment(),
    id: "1",
  },
  {
    text: " Scroll is a test network consisting.\nSOURCES: https://guide.scroll.io/",
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
  const [textArea, setTextArea] = useState<string>("What is Scroll?\n");
  const [messages, setMessages] = useState<IMessage[]>(mockMessages);

  const onTextAreaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextArea(event.target.value);
  };

  const textAreaInput = useCallback((inputElement: any) => {
    if (inputElement) {
      inputElement.focus();
      inputElement.selectionStart = inputElement.value.length;
    }
  }, []);

  console.log({ messages });

  const getAnswer = async (question: string) => {
    const response = await fetch("/api/get_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setMessages([
      ...messages,
      {
        text: data.answer,
        isUser: false,
        created_at: moment(),
        id: "1",
      },
    ]);
  };

  const triggerCall = async () => {
    setMessages([
      ...messages,
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

  return (
    <div className="relative w-full rounded-xl border border-gray-200 bg-white p-8 shadow-md">
      <div className="flex h-[36rem] w-full flex-col justify-between">
        <div className="flex flex-col space-y-2">
          {messages.map((message, index) => (
            <div key={index}>
              <Message message={message} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end space-x-2">
          <input
            type="text"
            onKeyDown={onKeyDown}
            className="w-2/3 whitespace-nowrap rounded-xl border-gray-300 focus:ring-0 focus:ring-offset-0"
            value={textArea}
            onChange={onTextAreaChange}
            autoFocus
            ref={textAreaInput}
          />
          <button
            onClick={() => getAnswer(textArea)}
            className="rounded-xl border border-gray-300 p-2"
          >
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
