
interface ButtonElementProps {
    text: string
}


const mark = {
    student: 'Максим',
    arrMass: [
        {
            el: 1,
            status: true
        },
        {
            el: 2,
            status: true
        },
        {
            el: 3,
            status: false
        }
    ],
    car: {
        model: {
            name: 'Лада'
        },
        counter: 1
    }
}

const weather = [
    {
        gr: 5
    },
    {
        gr: 3
    }
]

const ButtonElement = (props: ButtonElementProps) => {
    console.log(mark.arrMass[2].status);
    console.log(mark.car.model.name);

    for (let i = 0; i < weather.length; i++){
        console.log(weather[i].gr);
    }

    return <button>
        {props.text}
    </button>
}

export default ButtonElement;