
interface BtnCalculateProps {
    n: number,
    onChange: (b: number) => void;
}

const BtnCalculate = ({ n, onChange }: BtnCalculateProps) => {
    
    const changeHandler = () => {
        onChange(n);
    }

    return <button
        onClick={changeHandler}
    >
        {n}
    </button>
}

export default BtnCalculate;