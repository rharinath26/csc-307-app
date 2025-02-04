// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);
  function removeOneCharacter(index) {
    const characterToDelete = characters[index];
    return fetch(`http://localhost:8000/users/${characterToDelete._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setCharacters(prevCharacters => prevCharacters.filter((_, i) => i !== index));

    })
    .catch(error => console.log("Error deleting character:", error));
  }
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    }).then((response) => {
      if (response.status === 201) {
        return response.json();
      }
    });
    return promise;
  }
  function updateList(person) {
    postUser(person)
      .then((user) => setCharacters([...characters, user]))
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>

  );
}
export default MyApp;