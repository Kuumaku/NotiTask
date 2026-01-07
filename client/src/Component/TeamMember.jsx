import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function TeamMember() {
  const { userId } = useParams(); // Get the userId from URL params
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editMemberId, setEditMemberId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");

  // Fetch team members for the specific userId
  const getMembers = async () => {
    try {
      const response = await fetch(`http://localhost:5050/team/${userId}`);
      const jsonData = await response.json();
      setMembers(jsonData);
    } catch (err) {
      console.error("Error fetching team members:", err.message);
    }
  };

  // Add a new team member
  const addMember = async (e) => {
    e.preventDefault();
    try {
      const newMember = { name, role, user_id: userId }; // userId is being passed from the URL
      await fetch("http://localhost:5050/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      setName(""); // Clear form
      setRole(""); // Clear form
      getMembers(); // Refresh the list of members
    } catch (err) {
      console.error("Error adding team member:", err.message);
    }
  };

  // Delete a team member
  const deleteMember = async (id) => {
    try {
      await fetch(`http://localhost:5050/team/${id}`, {
        method: "DELETE",
      });
      setMembers(members.filter((m) => m.id !== id)); // Remove from state
    } catch (err) {
      console.error("Error deleting team member:", err.message);
    }
  };

  // Start editing a team member
  const startEditing = (member) => {
    setIsEditing(true);
    setEditMemberId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditMemberId(null);
    setEditName("");
    setEditRole("");
  };

  // Edit team member
  const editMember = async (e) => {
    e.preventDefault();
    try {
      const updatedMember = { name: editName, role: editRole };
      await fetch(`http://localhost:5050/team/${editMemberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMember),
      });
      getMembers(); // Refresh the list of members
      cancelEditing(); // Cancel editing mode
    } catch (err) {
      console.error("Error updating team member:", err.message);
    }
  };

  useEffect(() => {
    getMembers();
  }, [userId]);

  return (
    <div>
      <h2>Team Members for User {userId}</h2>
      {/* Add Team Member Form */}
      <form onSubmit={addMember}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <button type="submit">Add Member</button>
      </form>

      {/* Edit Team Member Form */}
      {isEditing && (
        <form onSubmit={editMember}>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <input
            type="text"
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={cancelEditing}>Cancel</button>
        </form>
      )}

      {/* List of team members */}
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            {member.name} – {member.role}
            <button onClick={() => deleteMember(member.id)}>🗑</button>
            <button onClick={() => startEditing(member)}>✏️ Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamMember;

