import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditTodo({ userId }) {
  //ProjectState
  const { id } = useParams();
  const navigate = useNavigate();
  const [project_name, setProjname] = useState("");
  const [description, setDesc] = useState("");
  const [start_date, setS_Date] = useState("");
  const [due_date, setD_Date] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  //SubTaskState
  const [SubTasks, setSubTasks] = useState([]);
  const [t_name, setTask_name] = useState("");
  const [s_due_date, setSubdueDate] = useState("");
  const [s_description, setS_Desc] = useState("");
  const [editSubtasks, setEditSubtasks] = useState({});

  // TeamMemberState
  const [teamMembers, setTeamMembers] = useState([]); 
  const [newTMName, setNewTMName] = useState("");
  const [newTMRole, setNewTMRole] = useState("");
  const [editTeam, setEditTeam] = useState({});
  const [TeamUserID, setTeamUserID] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  const getTeamMembers = async () => {
    const res = await fetch(`http://localhost:5050/team/project/${id}`);
    const all = await res.json();
    setTeamMembers(all);

    const edits = {};
    all.forEach((m) => {
      edits[m.team_member_id] = {
        name: m.team_member_name,
        role: m.role,
        isEditing: false
      };
    });
    setEditTeam(edits);
  };

  useEffect(() => {
    getTodo();
    getSubTasks();
    getTeamMembers();
  }, [id]);

  const UpdateName = async (e) => {
    e.preventDefault();
    try {
      const body = {
        project_name,
        description,
        start_date,
        due_date
      };

      await fetch(`http://localhost:5050/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      navigate(`/edit/${id}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const newSubtask = {
        t_name,
        due_date: s_due_date,
        project_id: id,
        s_description
      };

      await fetch("http://localhost:5050/sub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubtask),
      });

      getSubTasks();
      setTask_name("");
      setSubdueDate("");
      setS_Desc("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteSub = async (task_id) => {
    try {
      await fetch(`http://localhost:5050/sub/${task_id}`, {
        method: "DELETE",
      });
      setSubTasks(SubTasks.filter((task) => task.task_id !== task_id));
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditChange = (task_id, field, value) => {
    setEditSubtasks((prev) => ({
      ...prev,
      [task_id]: {
        ...prev[task_id],
        [field]: value,
      },
    }));
  };

  const handleEditSubmit = async (e, task_id) => {
    e.preventDefault();
    const edited = editSubtasks[task_id];
    try {
      await fetch(`http://localhost:5050/sub/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t_name: edited.t_name,
          s_description: edited.s_description,
          due_date: edited.due_date,
        }),
      });
      getSubTasks();
    } catch (error) {
      console.log(error.message);
    }
  };

  const markStatusComplete = async (task_id, currentStatus) => {
    try {
      await fetch(`http://localhost:5050/sub/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: !currentStatus,
        }),
      });
      getSubTasks();
    } catch (error) {
      console.log(error.message);
    }
  };

  const markTypeGroup = async (task_id, currentType) => {
    try {
      await fetch(`http://localhost:5050/sub/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_type: !currentType }),
      });

      // Update local state manually to avoid full re-fetch
      setSubTasks(prev =>
        prev.map(sub =>
          sub.task_id === task_id
            ? { ...sub, task_type: !currentType }
            : sub
        )
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTodo = async () => {
    try {
      const response = await fetch(`http://localhost:5050/todos/${id}`);
      const jsonData = await response.json();
      const todoItem = Array.isArray(jsonData) ? jsonData[0] : jsonData;
      setProjname(todoItem.project_name);
      setDesc(todoItem.description);
      setS_Date(todoItem.start_date.slice(0, 10));
      setD_Date(todoItem.due_date.slice(0, 10));
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSubTasks = async () => {
    try {
      const response = await fetch(`http://localhost:5050/sub`);
      const jsonData = await response.json();
      const filtered = jsonData.filter((task) => task.project_id == id);
      setSubTasks(filtered);

      const initialEdits = {};
      filtered.forEach((task) => {
        initialEdits[task.task_id] = {
          t_name: task.t_name,
          s_description: task.s_description,
          due_date: task.s_due_date,
          isEditing: false,
        };
      });
      setEditSubtasks(initialEdits);
    } catch (error) {
      console.log(error.message);
    }
  };


    // fetch on mount
    useEffect(() => { getTeamMembers(); }, [id]);

  const GetNameByID = async (TeamUserID) => {
    try {
      const response  = await fetch(`http://localhost:5050/user/${TeamUserID}`);
      const data = await response.json();
      if (!data || data.length === 0) {
      throw new Error("User not found");
    }
    return data[0].user_fname;
    } catch (error) {
      console.log(error.message);
    }
  }

  const addTeamMember = async (e) => {
    e.preventDefault();
    try {
      const userName = await GetNameByID(TeamUserID);

      await fetch("http://localhost:5050/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: TeamUserID,
          project_id: id,
          team_member_name: userName,
          role: newTMRole
        })
      });
      setNewTMName("");
      setNewTMRole("");
      getTeamMembers();
    } catch (error) {
      console.log(error.message);
    }
  };

  

  const deleteTeamMember = async (mid) => {
    await fetch(`http://localhost:5050/team/${mid}`, {
       method: "DELETE" 
      });
    getTeamMembers();
  };

  const startTeamEdit = (m) => {
    setEditTeam((et) => ({
      ...et,
      [m.team_member_id]: { ...et[m.team_member_id], isEditing: true }
    }));
  };

  const handleTeamChange = (mid, field, val) => {
    setEditTeam((et) => ({
      ...et,
      [mid]: { ...et[mid], [field]: val }
    }));
  };

  const handleTeamSubmit = async (e, mid) => {
    e.preventDefault();
    const ed = editTeam[mid];
    await fetch(`http://localhost:5050/team/${mid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        team_member_name: ed.name,
        role: ed.role
      })
    });
    getTeamMembers();
  };


  return (
    <div className="project-detail-container">
      {/* PROJECT INFO */}
      {!isEditing ? (
        <>
          <h1><strong>{project_name}</strong></h1>
          <h2>Description</h2>
          <p>{description}</p>
          <p>Start: {start_date}</p>
          <p>Due: {due_date}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      ) : (
        <form onSubmit={UpdateName} className="Edit-form">
          <input value={project_name} onChange={(e) => setProjname(e.target.value)} />
          <input value={description} onChange={(e) => setDesc(e.target.value)} />
          <input type="date" value={start_date} onChange={(e) => setS_Date(e.target.value)} />
          <input type="date" value={due_date} onChange={(e) => setD_Date(e.target.value)} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      )}

      <hr className="section-divider" />

      {/* ─── TEAM MEMBERS ─────────────────────────────────────────────── */}
<h3>Team Members</h3>

{/* Add Member Form */}
<form className="form-inline" onSubmit={addTeamMember}>
  <input
    type="text"
    className="form-control"
    placeholder="UserId"
    value={TeamUserID}
    onChange={(e) => setTeamUserID(e.target.value)}
  />
  <input
    type="text"
    className="form-control"
    placeholder="Role"
    value={newTMRole}
    onChange={(e) => setNewTMRole(e.target.value)}
  />
  <button className="Add-sub" type="submit">Add Member</button>
</form>

{/* List of Members */}
<ol>
  {teamMembers.map((m) => {
    const editing = editTeam[m.team_member_id]?.isEditing;
    return (
      <li key={m.team_member_id} className="team-member-item">
        {!editing ? (
          <div className="member-view">
            <div className="member-info">
              <p><strong>Name:</strong> {m.team_member_name}</p>
              <p><strong>Role:</strong> {m.role}</p>
            </div>
            <div className="member-actions">
              <button className="delete" onClick={() => deleteTeamMember(m.team_member_id)}>
                Delete
              </button>
              <button onClick={() => startTeamEdit(m)}>✏️ Edit</button>
            </div>
          </div>
        ) : (
          <form className="member-view" onSubmit={(e) => {
            handleTeamSubmit(e, m.team_member_id);
            setEditTeam(et => ({
              ...et,
              [m.team_member_id]: {
                ...et[m.team_member_id],
                isEditing: false
              }
            }));
          }}>
            <div className="member-info">
              <label><strong>Name:</strong></label>
              <input
                className="form-control"
                value={editTeam[m.team_member_id]?.name || ""}
                onChange={(e) => handleTeamChange(m.team_member_id, "name", e.target.value)}
              />
              <label><strong>Role:</strong></label>
              <input
                className="form-control"
                value={editTeam[m.team_member_id]?.role || ""}
                onChange={(e) => handleTeamChange(m.team_member_id, "role", e.target.value)}
              />
            </div>
            <div className="member-actions">
              <button type="submit">💾 Save</button>
              <button type="button" onClick={() => {
                setEditTeam(et => ({
                  ...et,
                  [m.team_member_id]: {
                    ...et[m.team_member_id],
                    isEditing: false
                  }
                }));
              }}>❌ Cancel</button>
            </div>
          </form>
        )}
      </li>
    );
  })}
</ol>


      <hr className="section-divider" />

      {/* ADD SUBTASK */}
      <h3>Sub tasks</h3>
      <form className="form-inline" onSubmit={onSubmitForm}>
        <input type="text" className="form-control" placeholder="Task name" value={t_name} onChange={(e) => setTask_name(e.target.value)} />
        <input type="text" className="form-control" placeholder="Description" value={s_description} onChange={(e) => setS_Desc(e.target.value)} />
        <input className="form-control" type="date" value={s_due_date} onChange={(e) => setSubdueDate(e.target.value)} />
        <button className="Add-sub" type="submit">Add</button>
      </form>

      <ol>
        {SubTasks.map((sub) => {
          const isEditingSub = editSubtasks[sub.task_id]?.isEditing;
          return (
            <li key={sub.task_id}>
              {!isEditingSub ? (
                <>
                  <p><strong>{sub.t_name}</strong></p>
                  <p>{sub.s_description}</p>
                  <p><h7>Due date: </h7>{formatDate(sub.s_due_date)}</p>
                  <button className="delete" onClick={() => deleteSub(sub.task_id)}>Delete</button>
                  <button className={sub.status ? "complete" : ""} 
                          onClick={() => markStatusComplete(sub.task_id, sub.status)}>
                          {sub.status ? "✔ Complete" : "❌ Incomplete"}
                  </button>
                  <button className={sub.task_type ? "group" : ""} 
                          onClick={() => markTypeGroup(sub.task_id, sub.task_type)}>
                          {sub.task_type ? "👥 Group" : "👤 Individual"}
                  </button>
                  <button onClick={() => {
                      setEditSubtasks((prev) => ({
                          ...prev,
                          [sub.task_id]: {
                              ...prev[sub.task_id],
                              isEditing: true,
                          }
                      }));
                  }}>✏ Edit</button>
                </>
              ) : (
                <form onSubmit={(e) => {
                    handleEditSubmit(e, sub.task_id);
                    setEditSubtasks((prev) => ({
                        ...prev,
                        [sub.task_id]: {
                            ...prev[sub.task_id],
                            isEditing: false
                        }
                    }));
                }}>
                  <input type="text" className="form-control" value={editSubtasks[sub.task_id]?.t_name || ""} onChange={(e) => handleEditChange(sub.task_id, "t_name", e.target.value)} />
                  <input type="text" className="form-control" value={editSubtasks[sub.task_id]?.s_description || ""} onChange={(e) => handleEditChange(sub.task_id, "s_description", e.target.value)} />
                  <input type="date" className="form-control" value={editSubtasks[sub.task_id]?.due_date?.slice(0, 10) || ""} onChange={(e) => handleEditChange(sub.task_id, "due_date", e.target.value)} />
                  <button type="submit">💾 Save</button>
                  <button type="button" onClick={() => {
                      setEditSubtasks((prev) => ({
                          ...prev,
                          [sub.task_id]: {
                              ...prev[sub.task_id],
                              isEditing: false
                          }
                      }));
                  }}>❌ Cancel</button>
                </form>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default EditTodo;
