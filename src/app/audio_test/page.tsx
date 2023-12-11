"use client";

// Web audio APIを用いて音を鳴らす

export default function SoundPlayer() {
    const sound = (frequency: number, duration: number) => {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.start();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        oscillator.stop(audioContext.currentTime + duration);
    };

    const code2freq = (code: string) => {
        const note = code.slice(0, 1) as "C" | "D" | "E" | "F" | "G" | "A" | "B";
        const sharp = code.slice(1, 2) as "#" | "_";
        const octave = parseInt(code.slice(2, 3));
        const freq = 440 * Math.pow(2, octave - 4);
        console.log(note, sharp, octave, freq)
        switch (note) {
            case "C":
                return sharp === "#" ? freq * Math.pow(2, 1 / 12) : freq;
            case "D":
                return sharp === "#" ? freq * Math.pow(2, 3 / 12) : freq * Math.pow(2, 2 / 12);
            case "E":
                return sharp === "#" ? freq * Math.pow(2, 5 / 12) : freq * Math.pow(2, 4 / 12);
            case "F":
                return sharp === "#" ? freq * Math.pow(2, 6 / 12) : freq * Math.pow(2, 5 / 12);
            case "G":
                return sharp === "#" ? freq * Math.pow(2, 8 / 12) : freq * Math.pow(2, 7 / 12);
            case "A":
                return sharp === "#" ? freq * Math.pow(2, 10 / 12) : freq * Math.pow(2, 9 / 12);
            case "B":
                return sharp === "#" ? freq * Math.pow(2, 12 / 12) : freq * Math.pow(2, 11 / 12);
            default:
                break;
        }
        return 0;
    }

    const playSound = () => {
        const bpm = 120;
        const duration = 0.5;

        // カノンコード
        const chord = [
            ["G_3", "C_4", "E_4"],
            ["G_3", "B_3", "D_4"],
            ["A_3", "C_4", "E_4"],
            ["G_3", "B_3", "E_4"],
            ["F_3", "A_3", "C_4"],
            ["G_3", "C_4", "E_4"],
            ["F_3", "A_3", "C_4"],
            ["G_3", "B_3", "D_4"],
        ];

        // 1小節の時間
        const beat = 60 / bpm;
        const bar = beat * 2;

        let currentTime = 0;

        // 音を鳴らす
        for (let i = 0; i < chord.length; i++) {
            setTimeout(() => {
                for (let j = 0; j < chord[i].length; j++) {
                    sound(code2freq(chord[i][j]), duration);
                }
            }, currentTime * 1000);
            currentTime += bar;
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2">
            <button onClick={playSound}>カノンコードを鳴らす</button>
        </main>
    );
}