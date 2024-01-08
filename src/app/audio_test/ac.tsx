import { useEffect, useState } from "react";

export enum Note {
    A = 0,
    B = 2,
    C = 3,
    D = 5,
    E = 7,
    F = 8,
    G = 10,
}

export enum Sharp {
    S = 1,
    N = 0,
    F = -1,
}

export interface NoteInfo {
    pitch: number;
    x: number;
    y: number;
}

export function Freq(num: number): number {
    return num ? 440 * Math.pow(2, num / 12 - 4) : 0;
}

export function Num2freq(num: number, octave: number): number {
    return Freq(num + octave * 12);
}

export function Note2Freq(note: Note, sharp: Sharp, octave: number): number {
    return Num2freq(note + sharp, octave);
}

export function useAudioContext(): AudioContext | null {
    const [context, setContext] = useState<AudioContext | null>(typeof AudioContext !== 'undefined' ? new AudioContext() : null);
    useEffect(() => {
        setContext(new AudioContext());
    }, []);
    return context;
}

export function xylophone(context: AudioContext, freq: number, duration: number, x: number, y: number): void {
    if (!freq) return;
    const osc = context.createOscillator();
    const gainNode = context.createGain();
    const panner = context.createPanner();
    panner.positionX.setValueAtTime(x * 2 - 1, context.currentTime);
    panner.positionY.setValueAtTime(0, context.currentTime);
    panner.positionZ.setValueAtTime(y * 2 - 1, context.currentTime);
    osc.connect(gainNode).connect(panner).connect(context.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.start();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    osc.stop(context.currentTime + duration);
}

export function kickDrum(context: AudioContext, duration: number): void {
    const osc = context.createOscillator();
    const gainNode = context.createGain();

    osc.connect(gainNode);
    gainNode.connect(context.destination);

    // キックドラムの特性を模倣するためにピッチとゲインを設定
    osc.frequency.setValueAtTime(150, context.currentTime); // スタートは高い周波数
    osc.frequency.exponentialRampToValueAtTime(50, context.currentTime + 0.05); // すぐに低い周波数に落ち込む

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, context.currentTime + 0.01); // アタック
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration); // ディケイ

    osc.start();
    osc.stop(context.currentTime + duration);
}

export function sound(freq: number, duration: number): void {
    const context = new AudioContext();
    const osc = context.createOscillator();
    const gainNode = context.createGain();
    osc.connect(gainNode);
    gainNode.connect(context.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.start();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    osc.stop(context.currentTime + duration);
}

export function randomNormal(m: number, s: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const x = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    return m + s * x;
}
