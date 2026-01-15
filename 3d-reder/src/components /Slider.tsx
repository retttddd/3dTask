import React from 'react';

interface SliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value, min = -1, max = 20, step = 0.01, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
            />
            <span style={{ textAlign: 'center' }}>{value}</span>
        </div>
    );
};

export default Slider;
