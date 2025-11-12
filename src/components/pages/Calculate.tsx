import { useState } from "react";
import BtnCalculate from "../components/BtnCalculate";

const btnEl = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9
]

const Calculate = () => {
    const [result, setResult] = useState(0);

    const changeResult = (value: number) => {
        setResult(value);
    }

    return <div>
        <div>
            {result}
        </div>
        <button
            onClick={() => setResult(result + 1)}
        >
            ++
        </button>
        {btnEl.map((el) => (
            <BtnCalculate n={el} onChange={changeResult} /> 
        ))}
    </div>
}

export default Calculate;