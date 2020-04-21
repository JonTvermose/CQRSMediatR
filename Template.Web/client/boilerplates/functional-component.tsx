import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/loading-spinner/loading-spinner';

// This are the properties we can pass down from a parent. They can be made nullable or be callbacks
interface CounterProps {
    initialValue?: number; // nullable - can be set at the parent component
    onCounterChanged?(newValue: number): void; // nullable callback to the parent component
}

export const Counter: FunctionComponent<CounterProps> = (props) => {

    const [counter, setCounter] = useState(props.initialValue ? props.initialValue : 0); // set initial value to 0 if no initial value has been provided
    const [changeNumber, setChangeNumber] = useState(3);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("Counter initiated.")
    }, []) // using an empty array means the code will be executed when the component is mounted (initiated)

    useEffect(() => {
        console.log("Counter changed: " + counter);
    }, [counter]) // Code executes each time counter changes

    function handleIncreaseCounter(increment: number) {
        setCounter(counter + increment);
        handlePropsCallback();
    }

    function handleDecreaseCounter(decrease: number) {
        setCounter(counter - decrease);
        handlePropsCallback();
    }

    function handlePropsCallback() {
        if (props.onCounterChanged) {
            props.onCounterChanged(counter);
        }
    }

    function handleChangeNumberChanged(e: React.ChangeEvent<HTMLInputElement>) { // we could also write e: any, or just e unless we enforce stricter rules using tslint
        let value = e.target.value;
        setChangeNumber(parseInt(value));
    }

    function handleLoadingStart() {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 3000);
    }

    return (
        <div className="container">

            <h1 className="mt-5">Counter: {counter}</h1>

            <div className="form-group mt-5">
                <button className="btn btn-primary mr-3" onClick={() => handleIncreaseCounter(1)}>+ 1</button>
                <button className="btn btn-secondary" onClick={() => handleDecreaseCounter(1) /* We can write the code directly */}>- 1</button> 
            </div>

            <div className="form-group mt-5">
                <label>Enter a number and increase/decrease the counter with said number</label>
                <input type="number" className="form-control" onChange={handleChangeNumberChanged /* We can bind onChange, onClick etc to a method. They will be passed the corrosponding event (changeEvent, clickEvent, etc)*/} value={changeNumber} />
            </div>

            <div className="form-group">
                <button className="btn btn-primary mr-3" onClick={() => handleIncreaseCounter(changeNumber)}>+ {changeNumber}</button>
                <button className="btn btn-secondary" onClick={() => handleDecreaseCounter(changeNumber)}>- {changeNumber}</button>
            </div>

            <div className="form-group mt-5">
                <button className="btn btn-outline-primary mr-3" onClick={handleLoadingStart}>Show loading spinner</button>
            </div>

            <LoadingSpinner isLoading={isLoading} loadingText={"The loading will dissapear soon..."} /> {/* Here we are using a component and giving it some properties */}
        </div>)
}