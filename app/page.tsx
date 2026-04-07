import { WelcomeHero } from "./components/dashboard/WlcomeHero";
import SubStats from "./components/dashboard/SubStats";
import TeacherRating from "./components/dashboard/TeacherRating";
import TeacherStudentsStats from "./components/dashboard/TeacherStudentsStats";
import TeacherQuizzesStats from "./components/dashboard/TeacherQuizzesStats";
import TeacherNotesStats from "./components/dashboard/TeacherNotesStats";
 
export default function Home() {
  return (
    <main>
      <WelcomeHero />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <TeacherStudentsStats />
        <SubStats />
        <TeacherRating />
        <TeacherQuizzesStats />
        <TeacherNotesStats />
       
      </div>
    </main>
  );
}
