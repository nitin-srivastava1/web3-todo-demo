import { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';
import { TODOLIST_ADDRESS, TODOLIST_ABI } from './config';
import addList from './assets/add-list.png';

function App() {
  const [task, setTask] = useState("")
  const [contract, setContract] = useState()
  const [tasks, setTasks] = useState([])
  const [account, setAccount] = useState('Not connected');

  useEffect(() => {

    loadBlockchainData()

  }, [])



  async function loadBlockchainData() {

    // load smart contract instance
    let web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const contractInstance = new web3.eth.Contract(TODOLIST_ABI, TODOLIST_ADDRESS)
    setContract(contractInstance)

    // getting the current account we are going to use
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[1])

    // getting all the tasks from smart contract storage to the component
    let taskCount = await contractInstance.methods.getTaskCount().call({ from: accounts[1] })
    let allTasks = []

    for (let i = 0n; i < taskCount; i++) {
      let currentTask = await contractInstance.methods.getTask(i).call({ from: accounts[1] })
      allTasks.push({
        key: i,
        title: currentTask.task
      })
    }
    
    setTasks([...tasks, ...allTasks])

  }

  const handleInput = (event) => {
    setTask(event.target.value)

    if(event.key === 'Enter') {
      addTask()
      setTask("")
    }
  }

  // function to add new task on the blockchain
  const addTask = async () => {

    await contract.methods.addTask(task).send({ from: account })

    let taskCount = await contract.methods.getTaskCount().call({ from: account })

    let newTask = await contract.methods.getTask(taskCount - 1n).call({ from: account })

    setTasks(
      [...tasks,
      {
        key: taskCount - 1n,
        title: newTask.task
      }]
    )
  }

  // function to call deleteTask on Smart contract
  const deleteTask = async (taskIndex) => {

    await contract.methods.deleteTask(taskIndex).send({ from: account })

    setTasks(() => tasks.filter(t => t.key !== taskIndex))
  }


  return (
    <>
      <div className="card-container">
        <div className="icon-circle">
          <img src={addList} alt="icon" />
        </div>
        <h2 className="bloc title"><strong>TODO LIST APP</strong></h2>
        <p id="taskCount" className="task-count text-white">{tasks.length} Task</p>

        <div className="task-card">
          <div className="add-task-container">

            <input id="new-task"
              className="new-task"
              type="text"
              size={30}
              value={task}
              onChange={handleInput}
              onKeyDown={handleInput}
            />

            <button type="button"
              className="btn-primary"
              onClick={addTask}
            >Add Task</button>
          </div>

          <div className="list-group">
            {tasks.length === 0 ? (
              <div className="loader-container">
                <div className='loader'>
                </div>
              </div>)
              :
              (tasks.map((task) => {
                if (task) {
                  return (

                    <div key={task.key}
                      className='task-container'>
                      
                      <span>&#9755; &nbsp;{task.title}</span>
                      <button className='delete-btn'
                        onClick={() => { deleteTask(task.key) }}>Delete</button>
                    </div>
                  )
                }
              }))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
