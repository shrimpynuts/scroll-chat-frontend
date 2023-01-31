import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useProvider } from "wagmi";

const parseTextArea = (text: string) => {
  const lines = text.split("\n");
  const noWhitespaceLines = lines.map((line) => line.replace(/\s/g, ""));
  const dotEthAppended = noWhitespaceLines.map((line) =>
    line.length >= 3 ? `${line}.eth` : "",
  );
  return dotEthAppended;
};

export default function Search() {
  const provider = useProvider();
  const [textArea, setTextArea] = useState<string>("vitalik\n");
  const [queriedNames, setQueriedNames] = useState<{ [name: string]: string }>({
    "vitalik.eth": "Unavailable",
  });
  const queryNames = parseTextArea(textArea);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        if (isTyping) {
          setIsTyping(false);
          if (!provider) return console.error("Could not get provider!");
          resolveNames(queryNames);
        }
      }, 100);
      console.log({ timer });
    }
  }, [isTyping]);

  const isValidName = (name: string) => name.length >= 3;

  const resolveNames = async (names: string[]) => {
    const namesToFetch = names
      .filter((name) => !(name in queriedNames))
      .filter(isValidName);
    console.log(`Fetching ${namesToFetch.length} names!`);
    return await Promise.all(
      namesToFetch.map((name) =>
        provider.resolveName(name).then((result) => {
          setQueriedNames((prev) => {
            const status = isValidName(name)
              ? result
                ? "Unavailable"
                : "Available"
              : "Invalid";
            const obj = { ...prev, [name]: status };
            return obj;
          });
        }),
      ),
    );
  };

  const onTextAreaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextArea(event.target.value);
    if (!isTyping) setIsTyping(true);
  };

  const textAreaInput = useCallback((inputElement: any) => {
    if (inputElement) {
      inputElement.focus();
      inputElement.selectionStart = inputElement.value.length;
    }
  }, []);

  return (
    <div className="relative w-full rounded-xl border border-gray-200 bg-white p-8 shadow-md">
      <div className="mx-8 h-[30rem] w-full">
        <input
          type="text"
          className="whitespace-nowrap rounded-xl border-gray-300 focus:ring-0 focus:ring-offset-0"
          value={textArea}
          onChange={onTextAreaChange}
          autoFocus
          ref={textAreaInput}
        />
      </div>
    </div>
  );
}
