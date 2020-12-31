import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './App.css';

const App = (props) => {
  const [counter, setCounter] = useState(0);
  const exercises = Array(3).fill("a").map((v, idx) => `Exercise ${idx + 1}`);
  const [activeExercise, setActiveExercise] = useState(-1);
  const [isCounterActive, setCounterActive] = useState(false);
  const [isCounterPaused, setCounterPaused] = useState(false);
  const [workoutState, setWorkoutState] = useState("INACTIVE"); // ACTIVE/REST/INACTIVE
  const completedExercises = useRef(new Set());
  const timeout = useRef(null);
  // START COUNTDOWN ON BUTTON CLICK
  // ON END CHANGE START COUNTER
  // RESTART COUNTER
  useEffect(() => {
    if(isCounterPaused) return clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if(counter < 2){
        setCounterActive(false);
        return;
      };
      setCounter(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout.current);
  }, [counter, isCounterPaused]);

  useEffect(() => {
    if(!isCounterActive) {
      clearTimeout(timeout.current);
      if(workoutState === "INACTIVE") return;
      if(workoutState === "ACTIVE"){
        completedExercises.current.add(exercises[activeExercise]);
        if (completedExercises.current.size === exercises.length) {
          setCounter(0);
          setWorkoutState("INACTIVE");
          return;
        }
        setCounter(props.restTime);
        setWorkoutState("REST");
      } else {
        // switches to active session; change exercise name
        setActiveExercise(prev => prev + 1);
        setCounter(props.workoutTime);
        setWorkoutState("ACTIVE");
      }
      setCounterActive(true);
    };
  }, [isCounterActive, workoutState]);

  const handleStartCounter = e => {
    setActiveExercise(0);
    setCounter(props.workoutTime);
    setCounterActive(true);
    completedExercises.current.clear();
    setWorkoutState("ACTIVE");
  };
  return (
    <div>
      {workoutState === "REST" ? (<p>Next Exercise: {exercises[activeExercise + 1]}</p>) : (<p>Active Exercise: {activeExercise === -1 ? "NONE" : exercises[activeExercise]} </p>)}
      <div>{counter}</div>
      {workoutState === "INACTIVE" && <button onClick={handleStartCounter}>Start WorkOut</button>}
      <button onClick={e => setCounterPaused(prev => !prev)}>{isCounterPaused ? "PLAY" : "PAUSE"}</button>
      <div>WorkoutState: {workoutState}</div>
      <div>Completed Exercises: {Array.from(completedExercises.current).map(v => `${v},`)}</div>
    </div>
    
  );
};

App.defaultProps = {
  restTime: 10,
  workoutTime: 5
};

App.propTypes = {
  restTime: PropTypes.number.isRequired,
  workoutTime: PropTypes.number.isRequired
}

export default App;
