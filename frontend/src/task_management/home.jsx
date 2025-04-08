import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [taskData, setData] = useState([])
  const [message, setMessage] = useState("")
  const [deletionMessage, setDeletionMessage] = useState("")
  const [error, setError] = useState("")
  const [user,setUser]=useState("")
  const navigate=useNavigate()

  //fetching user tasks
  const fetchData = async () => {

    const res = await fetch("http://localhost:8000/api/tasks/list",
      {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })

    const result = await res.json()
    setData(result.tasks)
    setUser(result.user)
    console.log(result)

  }



  const deleteTask = async (task_id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/delete/${task_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const result = await res.json();
      console.log(result)
      if (result.message) {
        setDeletionMessage("Task Deleted Successfully")
      }
      else {
        setError("Couldnt delete task")
      }
    }
    catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add the task.');

    }
  }


  //add tasks
  const addTask = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get("title"))

    //check empty task title
    if (data.get("title").trim() === '' && data.get("description").trim() === '') {
      setError('Enter both fields');
      return;
    }
    //api call
    try {
      const res = await fetch('http://localhost:8000/api/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title: data.get("title"), description: data.get("description") }),
      });
      const result = await res.json();
      console.log(result)
      if (result.message) {
        setMessage("Task Added Successfully")
        setDeletionMessage("")
        setData([])
        
        // setData(taskData=>[...taskData,{
        //     // Make sure the result contains the new task data
        //   id:result.task.id,
        //   title: result.task.title,
        //   description: result.task.description,
        //   created_at: result.task.created_at,
        //   updated_at: result.task.updated_at}])
        
      }
      else {
        setError("Couldnt add task")
      }
    }
    catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add the task.');

    }
  }


  //logout function
  const logout=()=>{
    localStorage.removeItem("token")
    navigate("/")
  }

    //to update data on component load
    useEffect(() => {
      fetchData()
    }, [taskData]) //should remount when new task is added
  
  return (
    <>



      <h1>Tasks for email <p className='text-info'>{user}</p> </h1>
      <p className='text-danger'>{deletionMessage}</p>
      <table class="table">

        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope='col'>Desc</th>
            <th scope="col">Created on</th>
            <th scope="col">Updated on </th>
            <th scope='col'>Action</th>
          </tr>
        </thead>
        <tbody>
          
          {taskData?taskData.map((item, index) =>
            <tr key={item.id} >
              <th scope="row">{index + 1}</th>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
              <td>{new Date(item.updated_at).toLocaleString()}</td>
              <td> <button className='btn btn-danger' onClick={() => deleteTask(item.id)}>X</button></td>
            </tr>
          ):""}
          {taskData? "":"No Task set by User"}
          


        </tbody>
      </table>

      <form id='addForm' onSubmit={addTask} className='bg-info-subtle'>
        <h3>Add Task</h3>
        <p className='text-success'> {message}</p> <br />
        <label htmlFor="title" className='mx-2 my-2'>Title </label>
        <input type="text" name='title' id='title' /> <br />
        <label htmlFor="description" className='mx-2 my-2'>Description </label>
        <textarea id='description' name='description'></textarea> <br />
        <button type='submit' className='btn btn-primary'>Add Task</button>
      </form>
<br />
      <button className='btn btn-danger' onClick={logout}>Logout</button>
    </>
  )
}

export default Home;