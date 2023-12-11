// export default function Home() {

//   return (
//     <main className="flex flex-col items-center justify-center min-h-screen py-2">
//       <h1 className="text-4xl md:text-6xl font-bold text-center mx-4">
//         Ani Sound
//       </h1>
//       <p className="mt-4 text-xl md:text-2xl text-center mx-6">
//         Web Audio APIによって作られた音とアニメーションを合わせたマルチメディアコンテンツ
//       </p>
//       <button
//         className="mt-8 px-6 py-3 text-xl md:px-10 md:py-4 md:text-3xl bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition duration-300"
//       >
//         {"Let's Start"}
//       </button>
//     </main>
//   );
// }

"use client";
import { useState } from 'react';

export default function Home() {
  const [isTouched, setIsTouched] = useState(false);

  // Function to handle touch start
  const handleTouchStart = () => {
    setIsTouched(true);
  };

  // Function to handle touch end
  const handleTouchEnd = () => {
    setIsTouched(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl md:text-6xl font-bold text-center mx-4">
        Ani Sound
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-center mx-6">
        Web Audio APIによって作られた音とアニメーションを合わせたマルチメディアコンテンツ
      </p>
      <button
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`mt-8 px-6 py-3 text-xl md:px-10 md:py-4 md:text-3xl bg-gradient-to-r from-green-400 to-blue-500 rounded-full text-white shadow-lg ${isTouched ? 'scale-110' : 'hover:scale-110'
          } transform transition duration-300`}
      >
        {"Let's Start"}
      </button>
    </main>
  );
}
