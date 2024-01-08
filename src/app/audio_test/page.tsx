"use client";
import { Freq, xylophone, randomNormal, useAudioContext, kickDrum, NoteInfo } from "./ac";
import { useState, useEffect, useRef } from "react";

const CircleNode = (props: { x: number, y: number, r: number, c: string, key: number; }) => {
    const { x, y, r, c } = props;
    // const circleRef = useRef<HTMLDivElement>(null);
    return (
        <div
            // ref={circleRef}
            className="absolute w-0 h-0 rounded-full animate-expand-circle"
            style={{
                left: x - r / 2,
                top: y - r / 2,
                height: r,
                width: r,
                transform: `scale(0)`,
                backgroundColor: c,
            }}
        />
    );
};

export default function SoundPlayer() {
    const [windowSize, setWindowSize] = useState<{ width: number, height: number; }>({ width: typeof window !== "undefined" ? window.innerWidth : 0, height: typeof window !== "undefined" ? window.innerHeight : 0 });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [circles, setCircles] = useState<Array<{ x: number, y: number, r: number, c: string, key: number; }>>([]);

    // const handleScreenClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //     const newCircle = {
    //         x: e.clientX,
    //         y: e.clientY,
    //         c: "#60A5FA",
    //         key: Math.random(), // ユニークなキー
    //     };
    //    
    //     setCircles([...circles, newCircle]);
    // };

    const audioContext = useAudioContext();
    const count = 16;
    const bpm = 120;
    const p = 2 / 3;
    const mean = 45;
    const d_mean = 4;
    const sigma = 6;
    const [notes_A1, setNotes_A1] = useState<Array<NoteInfo>>([]);
    const [notes_A2, setNotes_A2] = useState<Array<NoteInfo>>([]);
    const [notes_A3, setNotes_A3] = useState<Array<NoteInfo>>([]);
    const [notes_B1, setNotes_B1] = useState<Array<NoteInfo>>([]);
    const [notes_B2, setNotes_B2] = useState<Array<NoteInfo>>([]);
    const [notes_B3, setNotes_B3] = useState<Array<NoteInfo>>([]);

    const [isPlaying, setIsPlaying] = useState(false);
    const [pointer, setPointer] = useState(0);

    enum NoteSet {
        A = 0,
        B = 1,
    }
    const [notesSet, setNotesSet] = useState<NoteSet>(NoteSet.A);
    const [currentNotesSet, setCurrentNotesSet] = useState<NoteSet>(NoteSet.A);

    const generateRandomNotes = (p: number, m: number, s: number) => Array(count).fill(0).map(() => ({ pitch: (Math.random() < p ? 0 : 1) * Math.floor(randomNormal(m, s)), x: Math.random(), y: Math.random() }));

    // generate notes when component is mounted
    useEffect(() => {
        setNotes_A1(generateRandomNotes(p, mean - d_mean, sigma));
        setNotes_A2(generateRandomNotes(p, mean, sigma));
        setNotes_A3(generateRandomNotes(p, mean + d_mean, sigma));
        setNotes_B1(generateRandomNotes(p, mean - d_mean, sigma));
        setNotes_B2(generateRandomNotes(p, mean, sigma));
        setNotes_B3(generateRandomNotes(p, mean + d_mean, sigma));
    }, [p, mean, d_mean, sigma]);

    // regenerate notes when notesSet is changed
    const regenerateNotes = () => {
        if (currentNotesSet === NoteSet.A) {
            setNotes_B1(generateRandomNotes(p, mean - d_mean, sigma));
            // setNotes_B2(generateRandomNotes(p, mean, sigma));
            // setNotes_B3(generateRandomNotes(p, mean + d_mean, sigma));
        }
        else if (currentNotesSet === NoteSet.B) {
            setNotes_A1(generateRandomNotes(p, mean - d_mean, sigma));
            // setNotes_A2(generateRandomNotes(p, mean, sigma));
            // setNotes_A3(generateRandomNotes(p, mean + d_mean, sigma));
        }
    };

    const getColor = (pitch: number) => {
        const hue = (pitch % 12) * 30;
        const saturation = '100%';
        const lightness = '50%';
        return `hsl(${hue}, ${saturation}, ${lightness})`;
    };

    const AnimateXylophone = (note: NoteInfo, duration: number) => {
        if (!note.pitch) return;
        if (!audioContext) return;
        xylophone(audioContext, Freq(note.pitch), duration, note.x, note.y);
        const newCircle = {
            x: note.x * windowSize.width,
            y: note.y * windowSize.height,
            r: 200,
            c: getColor(note.pitch),
            key: Math.random(),
        };
        setCircles(prevCircles => [...prevCircles, newCircle]);
    };

    const AnimateKickDrum = (duration: number) => {
        if (!audioContext) return;
        kickDrum(audioContext, duration);
        const newCircle = {
            x: windowSize.width / 2,
            y: windowSize.height / 2,
            r: Math.min(windowSize.width, windowSize.height) / 3 * 2,
            c: "white",
            key: Math.random(),
        };
        setCircles(prevCircles => [...prevCircles, newCircle]);
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (isPlaying) {
            const playNote = () => {
                if (pointer % 4 === 0) {
                    AnimateKickDrum(0.5);
                }
                if (currentNotesSet === NoteSet.A) {
                    AnimateXylophone(notes_A1[pointer], 0.5);
                    AnimateXylophone(notes_A2[pointer], 0.5);
                    AnimateXylophone(notes_A3[pointer], 0.5);
                }
                else if (currentNotesSet === NoteSet.B) {
                    AnimateXylophone(notes_B1[pointer], 0.5);
                    AnimateXylophone(notes_B2[pointer], 0.5);
                    AnimateXylophone(notes_B3[pointer], 0.5);
                }
            };

            intervalId = setInterval(() => {
                playNote();
                if (pointer % count === 0 && notesSet !== currentNotesSet) {
                    setCurrentNotesSet((currentNotesSet + 1) % 2);
                }
                setPointer((pointer + 1) % count);
            }, 1000 * 60 / bpm / 4);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [
        audioContext,
        isPlaying, pointer,
        notes_A1, notes_A2, notes_A3,
        notes_B1, notes_B2, notes_B3,
        currentNotesSet, NoteSet.A, NoteSet.B,
        AnimateXylophone, AnimateKickDrum,
    ]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleNotesSet = () => {
        regenerateNotes();
        setNotesSet((notesSet + 1) % 2);
    };

    return (
        <>
            <main>
                <div
                    className="absolute w-full h-full overflow-hidden"
                // onClick={handleScreenClick}
                >
                    {circles.map((circle) => (
                        <CircleNode x={circle.x} y={circle.y} r={circle.r} c={circle.c} key={circle.key} />
                    ))}
                </div>
                <div className="absolute top-0 left-0">
                    <button className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={togglePlay}>{isPlaying ? "停止" : "再生"}</button>
                    <button className="m-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={toggleNotesSet}>再生成</button>
                </div>
            </main>
        </>
    );
}