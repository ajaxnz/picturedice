import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import CharView from './CharView.js';



export default function MyApp() {
  const [currentChar, setCurrentChar] = useState(0);

  return (
    <div>
      {currentChar ? <CharView charID={currentChar.id} /> : <CharacterList />}


      {currentChar ? <BackButton /> : <></>}

    </div>
  )


  function BackButton() {
    function onClick() {
      setCurrentChar(0)
    };

    return (
      <button onClick={onClick}>
        Back to the List
      </button>
    )
  }



  function CharButton({ char, onClick }) {
    function onClick() {
      if (char.id !== undefined) {
        setCurrentChar(char)
      } else {
        setCurrentChar(0)
      }

    };

    return (
      <button onClick={onClick}>
        {char.name}
      </button>
    );
  }




  function CharacterList() {
    const [characters, setCharacters] = useState([]);
    useEffect(() => {
      fetch('/characterlist').then(res => res.json()).then(data => {
        setCharacters(data);
      });
    }, [])

    const listItems = characters.map(char =>
      <li key={char.id}>
        <CharButton char={char} onClick />
      </li>
    )

    return (
      <>
        <h1> Select A Character </h1>
        <ul>{listItems}
        </ul>
        <AddCharacterBox />
      </>
    );


    function AddCharacterBox() {
      const [isAdding, setIsAdding] = useState(false);
      const [text, setText] = useState('');
      let addContent;
      if (!isAdding) {
        function onClick() {
          setIsAdding(true)
        }


        addContent = (
          <button onClick={onClick}>
            Add Character
          </button>
        );
      } else {

        addContent = (
          <>
            <input
              placeholder="Character Name"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={() => {
                setIsAdding(false);
                const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: { text } })
                };
                if (text) {
                  fetch('/character', requestOptions)
                    .then(res => res.json())
                    .then(data => {
                      setCharacters([...characters, data]);
                    });
                }
              }}>
              Add
            </button>
          </>
        );


      }
      return addContent


      function AddCharacter({ onAddCharacter }) {


      }




    }
  }
}








