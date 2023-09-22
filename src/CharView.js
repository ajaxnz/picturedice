import React, { useState, useEffect } from 'react';





export default function CharView({ charID }) {
  const encodedValue = encodeURIComponent(charID);
  const [character, setCharacter] = useState(0);
  useEffect(() => {
    fetch(`/character/${charID}`).then(res => res.json()).then(data => {
      setCharacter(data);
    });
  }, []);


  return (
    <h2>
      objid {character.id}
      rawid {charID}
      name {character.name}
    </h2>
  );


}




function UserName() {

  const [user, setUser] = useState(0);
  useEffect(() => {
    fetch('/character').then(res => res.json()).then(data => {
      setUser(data);
    });
  }, []);

  return (
    <h1>
      Fish
      {user.name}
    </h1>
  );
}


