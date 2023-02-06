import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Column = styled.div`
  flex: 1;
  padding: 1rem;
`;

const SelectionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const SelectionItem = styled.li`
  margin: 1rem 0;
`;

const SaveButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

function Selections({ selections }) {
  return (
    <SelectionList>
      {selections.map((selection, index) => {
        return <SelectionItem key={index}>{selection}</SelectionItem>;
      })}
    </SelectionList>
  );
}

const SaveSelectedText = ({ children }) => {
  const [selectedText, setSelectedText] = useState("");
  const [selections, setSelections] = useState([]);

  useEffect(() => {
    document.addEventListener("mouseup", handleSelection);
    return () => {
      document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  const handleSelection = () => {
    let selection = window.getSelection().toString();
    if (selection) {
      setSelectedText(selection);
      setSelections((prevState) => [...prevState, selection]);
    }
  };

  const handleSaveNote = async () => {
    selections.forEach(async (selection) => {
      const response = await fetch("http://localhost:1337/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: { text: selection } }),
      });

      const result = await response.json();
      setSelectedText("");  
      setSelections([]);
      console.log(result);
    });
  };

  return (
    <Container>
      <Column>
        <p>Current Selection: {selectedText}</p>
        <div>{children && children}</div>
      </Column>
      <Column>
        <Selections selections={selections} />
        <SaveButton onClick={handleSaveNote}>Save Note</SaveButton>
      </Column>
    </Container>
  );
};

export default SaveSelectedText;
