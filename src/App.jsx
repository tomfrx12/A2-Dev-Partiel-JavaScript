import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
    const [kitchenTasks, setKitchenTasks] = useState(() => {
    const saved = localStorage.getItem('kitchenTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('kitchenTasks', JSON.stringify(kitchenTasks));
  }, [tasks, kitchenTasks]);

  const nomRef = useRef(null);
  const ingredientsRef = useRef(null);
  const sauceRef = useRef(null);

  const [openSauceIndex, setOpenSauceIndex] = useState(null);
  
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  function formatElapsed(startTime) {
    const totalSeconds = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} : ${seconds}`;
  }

  function addTask() {
    const nomContent = nomRef.current.value.trim();
    const ingredientsContent = ingredientsRef.current.value.trim();

    if (nomContent === "") {
      setError(true);
      return;
    }

    if (ingredientsContent === "") {
      setError(true);
      return;
    }

    setError(false);
    setTasks(prev => [...prev, { nomContent, ingredientsContent }]);
    nomRef.current.value = "";
    ingredientsRef.current.value = "";
  }

  function delTask(i) {
    const task = tasks[i];
    const newTasks = [...tasks];
    newTasks.splice(i, 1);
    setTasks(newTasks);

    setKitchenTasks(prev => prev.filter(
      kitchenTask => !(kitchenTask.nomContent === task.nomContent && kitchenTask.ingredientsContent === task.ingredientsContent)
    ));
  }

  function delKitchenTask(i) {
    const newKitchenTasks = [...kitchenTasks];
    newKitchenTasks.splice(i, 1);
    setKitchenTasks(newKitchenTasks);
  }

  function validateKitchenTask(i) {
    const kitchenTask = kitchenTasks[i];
    delKitchenTask(i);
    setTasks(prev => prev.filter(
      task => !(task.nomContent === kitchenTask.nomContent && task.ingredientsContent === kitchenTask.ingredientsContent)
    ));
  }

  async function addKitchenTasks(nomContent, ingredientsContent) {
    const sauceContent = sauceRef.current.value.trim();
    const alreadyIn = kitchenTasks.some(
      task => task.nomContent === nomContent && task.ingredientsContent === ingredientsContent
    );
    if (alreadyIn) return;
    const data = await getData();
    const dateTime = data.date + ' ' + data.time + ':' + data.seconds;
    setKitchenTasks(prev => [...prev, { nomContent, ingredientsContent, sauceContent, dateTime, startTime: new Date(data.dateTime).getTime() }]);
  }

  async function getData() {
    const url = "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Paris";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <main className="m-0 p-0 min-h-screen flex flex-col items-center bg-stone-100">
      <header className="w-full bg-stone-800 text-white py-6 text-center mb-6">
        <h1 className='font-bold text-4xl tracking-wide'>Kibab: plat des dieux</h1>
      </header>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); addTask(); }}>
          <label className="font-medium text-stone-700">Ajouter une recette :</label>
          <input ref={nomRef} className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" type="text" placeholder="Nom de la recette" />
          <textarea ref={ingredientsRef} className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-400" placeholder="Ingrédients" />
          {error && <p className="text-red-500 text-sm">Erreur: la recette a besoin d'un nom et d'ingrédients</p>}
          <button type="button" onClick={addTask} className="self-start bg-stone-700 text-white px-6 py-2 rounded-lg hover:bg-stone-600 transition-colors duration-200">
            Ajouter
          </button>
        </form>
      </div>

      <div className="min-w-full flex justify-around px-8 gap-8">
        <div className='max-w-[50%] w-full'>
          <h2 className="text-xl font-semibold text-stone-700 mb-3 border-b border-stone-300 pb-1">Recettes</h2>
          {tasks.map((task, i) => (
            <div key={i} className="task bg-white shadow-md rounded-xl px-4 py-3 my-2 flex gap-3 items-center">
              <p className="font-semibold min-w-0 overflow-hidden break-words flex-1">{task.nomContent}</p>
              <span className="shrink-0 text-stone-400">{`→`}</span>
              <p className="min-w-0 overflow-hidden break-words flex-1 text-stone-600">{task.ingredientsContent}</p>
              <button onClick={() => delTask(i)} className='shrink-0 rounded-lg px-3 py-1 text-sm transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-200'>Suppr</button>
              <button onClick={() => setOpenSauceIndex(openSauceIndex === i ? null : i)} className='shrink-0 rounded-lg px-3 py-1 text-sm transition-all duration-200 bg-blue-100 text-blue-600 hover:bg-blue-200'>Sauce</button>
              {openSauceIndex === i &&
                <div className="flex gap-2">
                  <input ref={sauceRef} className="border border-stone-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" type="text" placeholder="Nom de la sauce" />
                  <button onClick={() => {addKitchenTasks(task.nomContent, task.ingredientsContent, i), setOpenSauceIndex(!openSauceIndex)}} className='shrink-0 rounded-lg px-3 py-1 text-sm transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200'>Cuisine</button>
                </div>
              }
            </div>
          ))}
        </div>
        <div className='max-w-[50%] w-full'>
          <h2 className="text-xl font-semibold text-stone-700 mb-3 border-b border-stone-300 pb-1">Cuisines</h2>
          {kitchenTasks.map((kitchenTask, i) => (
            <div key={i} className="kitchenTask shadow-md rounded-xl bg-white px-4 py-3 my-2 flex gap-3 items-center">
              <p className="font-semibold min-w-0 overflow-hidden break-words flex-1">{kitchenTask.nomContent}</p>
              <span className="shrink-0 text-stone-400">{`→`}</span>
              <p className="min-w-0 overflow-hidden break-words flex-1 text-stone-600">{kitchenTask.ingredientsContent}</p>
              <span className="shrink-0 text-stone-400">+</span>
              <p className='min-w-0 overflow-hidden break-words text-stone-600'>{kitchenTask.sauceContent}</p>
              <p className='shrink-0 text-stone-500 text-sm'>{kitchenTask.dateTime}</p>
              <p className='shrink-0 font-bold text-amber-600'>{formatElapsed(kitchenTask.startTime)}</p>
              <button onClick={() => validateKitchenTask(i)} className='shrink-0 rounded-lg px-3 py-1 text-sm transition-all duration-200 bg-green-100 text-green-700 hover:bg-green-200'>Valider</button>
              <button onClick={() => delKitchenTask(i)} className='shrink-0 rounded-lg px-3 py-1 text-sm transition-all duration-200 bg-red-100 text-red-600 hover:bg-red-200'>Suppr</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
