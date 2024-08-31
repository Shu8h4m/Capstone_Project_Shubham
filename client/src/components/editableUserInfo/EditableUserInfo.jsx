import React, { useState } from "react";

const EditableUserInfo = ({ user, onSave }) => {
  const [city, setCity] = useState(user.city || "");
  const [from, setFrom] = useState(user.from || "");
  const [relationship, setRelationship] = useState(user.relationship || "");

  const handleCityChange = (e) => setCity(e.target.value);
  const handleFromChange = (e) => setFrom(e.target.value);
  const handleRelationshipChange = (e) => setRelationship(e.target.value);

  const handleSaveClick = () => {
    onSave({ city, from, relationship });
  };

  return (
    <>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">City:</span>
        <input
          type="text"
          className="rightbarInfoInput"
          value={city}
          onChange={handleCityChange}
        />
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">From:</span>
        <input
          type="text"
          className="rightbarInfoInput"
          value={from}
          onChange={handleFromChange}
        />
      </div>
      <div className="rightbarInfoItem">
        <span className="rightbarInfoKey">Relationship:</span>
        <input
          type="text"
          className="rightbarInfoInput"
          value={relationship}
          onChange={handleRelationshipChange}
        />
      </div>
      <button className="rightbarSaveButton" onClick={handleSaveClick}>
        Save
      </button>
    </>
  );
};

export default EditableUserInfo;