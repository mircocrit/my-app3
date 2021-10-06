import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'


const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState('')
  const [day, setDay] = useState('')
  const [reminder, setReminder] = useState('false')

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  //FETCH tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    console.log(data)
    return data
  }

  //FETCH tasks
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    console.log(data)
    return data
  }

  //ADD task
  const addTask = async (task) => {
    const res = await fetch(
      'http://localhost:5000/tasks',
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
      })
    const data = await res.json()
    setTasks([...tasks, data])
  }

  //DELETE task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,
      {
        method: 'DELETE'
      })
    setTasks(tasks.filter(
      (task) => task.id !== id
    ))
  }

  //UPDATE (toggle reminder)
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder
    }

    const res = await fetch(
      `http://localhost:5000/tasks/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updTask)
      }
    )
    const data = await res.json()

    setTasks(
      tasks.map((task) =>
        task.id === id ?
          {
            ...task,
            reminder: data.reminder
          }
          : task
      )
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!text) {
      alert('Please add text')
      return
    }
    addTask({ text, day, reminder })

    setText('')
    setDay('')
    setReminder(false)
  }





  return (
    <div className="container">
      <header className='header'>
        <h1>Task Tracker</h1>
      </header>

      <button
        onClick={() => setShowAddTask(!showAddTask)}
        style={{ backgroundColor: (showAddTask ? 'red' : 'green') }}
        className='btn'
      > {showAddTask ? 'Close' : 'Add'}
      </button>

      {showAddTask &&

        <form className='add-form' onSubmit={onSubmit}>
          <div className='form-control'>
            <label>Task </label>
            <input type='text' placeholder='Add Task' value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className='form-control'>
            <label>Day & Time </label>
            <input type='text' placeholder='Add Day & Time' value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>

          <div className='form-control form-control-check'>
            <label>Set Reminder </label>
            <input type='checkbox' value={reminder}
              onChange={(e) => setReminder(e.currentTarget.checked)}
            />
          </div>

          <input type='submit' value='Save Task' className='btn btn-block' />
        </form>

      }


      {tasks.length > 0 ?
        <>
          {tasks.map(
            (task, index) => (
              //key = { index }
              <div className={`task ${task.reminder ? 'reminder' : ''}`}
                onDoubleClick={() => toggleReminder(task.id)}>

                <h3>
                  {task.text}
                  <FaTimes
                    style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => deleteTask(task.id)}
                  />
                </h3>
                <p>{task.day}</p>
              </div>
            ))
          }
        </>
        : 'No tasks to show'
      }

      <footer>
        <p>Copypight &copy; 2021</p>
        <a href='/about'> About</a>
      </footer>

    </div>

  )
}

export default App;

