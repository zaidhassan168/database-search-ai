import { useCompletion } from 'ai/react';

export default function MainChat() {
  const { completion, complete } = useCompletion({
    api: '/api/new_assistant',
  });

  return (
    <div>
      <div
        onClick={async () => {
          await complete('Why is the sky blue?');
        }}
      >
        Generate
      </div>

      {completion}
    </div>
  );
}