"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
    min: number;
    max: number;
    step?: number;
    defaultValue?: [number, number];
    onValueChange?: (value: [number, number]) => void;
    className?: string;
    formatLabel?: (value: number) => string;
}

export function Slider({
    min,
    max,
    step = 1,
    defaultValue = [min, max],
    onValueChange,
    className,
    formatLabel
}: SliderProps) {
    const [minVal, setMinVal] = useState(defaultValue[0]);
    const [maxVal, setMaxVal] = useState(defaultValue[1]);
    const minValRef = useRef(minVal);
    const maxValRef = useRef(maxVal);
    const range = useRef<HTMLDivElement>(null);

    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    return (
        <div className={cn("relative w-full h-12 flex items-center", className)}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
                    setMinVal(value);
                    minValRef.current = value;
                    onValueChange?.([value, maxVal]);
                }}
                className="thumb thumb--left z-[3] absolute w-full h-0 outline-none pointer-events-none appearance-none"
                style={{ zIndex: minVal > max - 100 ? "5" : "3" }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={(event) => {
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                    onValueChange?.([minVal, value]);
                }}
                className="thumb thumb--right z-[4] absolute w-full h-0 outline-none pointer-events-none appearance-none"
            />

            <div className="relative w-full">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10 rounded-full z-[1]" />
                <div
                    ref={range}
                    className="absolute top-0 h-1.5 bg-snow-accent rounded-full z-[2]"
                />

                {/* Labels below */}
                <div className="absolute top-4 left-0 text-xs text-snow-gray mt-1">
                    {formatLabel ? formatLabel(minVal) : minVal}
                </div>
                <div className="absolute top-4 right-0 text-xs text-snow-gray mt-1">
                    {formatLabel ? formatLabel(maxVal) : maxVal}
                </div>
            </div>

            <style jsx>{`
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          -webkit-tap-highlight-color: transparent;
          pointer-events: auto;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background-color: #f8fafc;
          border: 2px solid #3b82f6;
          box-shadow: 0 0 10px rgba(59,130,246,0.3);
          cursor: pointer;
          margin-top: 1px;
        } 
        .thumb::-moz-range-thumb {
          -webkit-appearance: none;
          pointer-events: auto;
           height: 18px;
          width: 18px;
          border-radius: 50%;
          background-color: #f8fafc;
          border: 2px solid #3b82f6;
          box-shadow: 0 0 10px rgba(59,130,246,0.3);
          cursor: pointer;
        }
      `}</style>
        </div>
    );
}
