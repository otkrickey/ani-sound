"use client";
import { useState } from 'react';
import Link from 'next/link';

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
        <Link href="/audio_test">
          {"Let's Start"}
        </Link>
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-12 flex justify-center">
          <div className="rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-300 p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white">Ani Soundとは</h2>
                  <p className="mt-1 text-xl text-white">Web Audio APIを用いて音が鳴ったと同時に図形を用いたアニメーションをリアルタイムで表現することを目標として作成されたWebApplicationである。</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold">製作理由</h3>
              <p className="mt-2 text-xl">ここに文章が入りますここに文章が入りますここに文章が入ります</p>
              <h3 className="text-2xl font-bold mt-4">使用技術</h3>
              <p className="mt-2 text-xl">開発時に利用したライブラリ等は以下の通りです</p>
              <ul className="list-disc pl-5 mt-2 text-xl">
                <li>Nextjs</li>
                <li>WebAudioContext</li>
                <li>Typescript</li>
                <li>Tailwind CSS</li>
                <li>Framer motion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-12 flex justify-center">
          <div className="rounded-lg shadow-lg overflow-hidden w-full max-w-3xl">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-300 p-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white">Ani Soundの実行例</h2>
                  <p className="mt-1 text-xl text-white">実行ボタンを押すと以下の様にアニメーションと音が作動します</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <img src="" alt="" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
