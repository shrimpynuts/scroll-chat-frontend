import { IMessage } from "@/components/chat";

interface IMessageProps {
  message: IMessage;
  isThreadContinuation?: boolean;
}

const ScrollMessage = ({ text }: { text: string }) => {
  const [first, rest] = text.split("SOURCES: ");
  const sources = rest.split(", ");
  return (
    <div>
      <p>{first}</p>
      <div>
        Source{sources.length > 1 ? "s" : ""}:{" "}
        <span className="space-x-1">
          {sources.map((source, index) => {
            return (
              <a
                href={source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
                key={index}
              >
                {source}
              </a>
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default function Message({
  message: { text, isUser },
  isThreadContinuation,
}: IMessageProps) {
  return (
    <div
      className={`flex space-x-4 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      <div className="shrink-0 items-start">
        {!isThreadContinuation && (
          <img
            className={`mt-4 h-10 w-10 self-end rounded-full border-2`}
            src={
              isUser
                ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                : "/scroll-logo.png"
            }
          />
        )}
      </div>

      <div className="flex max-w-xl flex-col text-sm">
        {!isThreadContinuation && (
          <span className={`font-semibold ${isUser ? "self-end" : ""}`}>
            {isUser ? "User" : "Scroll"}
          </span>
        )}
        <div className="rounded-xl border border-gray-300 px-4 py-2 ">
          {isUser ? <p className="">{text}</p> : <ScrollMessage text={text} />}
        </div>
      </div>
    </div>
  );
}
