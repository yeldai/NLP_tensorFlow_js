import React, { useEffect, useRef, useState } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "./Screen.css";
import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { Fragment } from "react";

function Screen() {
  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);
  const [input, setInput] = useState();

  const loadModel = async () => {
    const loadedModel = await qna.load();
    setModel(loadedModel);
    console.log("Model Loaded");
  };

  useEffect(() => {
    loadModel();
  }, []);

  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) {
      console.log("Question submitted");
      const passage = passageRef.current.value;
      const question = questionRef.current.value;

      const answers = await model.findAnswers(question, passage);
      setAnswer(answers);
      console.log(answers);
    }
  };
  return (
    <div
      className="
    screen"
    >
      {model == null ? (
        <div>
          <div styles={{ color: "#7C00F7" }}>Model Loading</div>
          <Loader
            type="Circles"
            color="#7C00F7"
            height={100}
            width={100}
            timeout={3000}
          />
        </div>
      ) : (
        <Fragment>
          <p className="screen__passage">Passage</p>
          <textarea
            className="screen_text"
            ref={passageRef}
            rows="30"
            cols="30"
          ></textarea>
          <p className="screen__question">Ask a Question </p>
          <div className="screen__input">
            <input
              ref={questionRef}
              onKeyPress={answerQuestion}
              placeholder="Your question here..."
            ></input>
          </div>
          <br></br>
          <p className="screen__answer">Answers </p>
          {answer
            ? answer.map((ans, idx) => (
                <div className="screen__answers">
                  <b>Answer {idx + 1} - </b>
                  {ans.text} {Math.floor(ans.score * 100) / 100}
                </div>
              ))
            : ""}
        </Fragment>
      )}
    </div>
  );
}

export default Screen;
