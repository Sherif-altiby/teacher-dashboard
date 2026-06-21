import { Suspense } from "react";
import CreateQuiz from "@/app/components/quiz/CreateQuiz";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateQuiz />
    </Suspense>
  );
};

export default Page;