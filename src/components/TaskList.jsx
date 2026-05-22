import { useEffect, useState } from "react";
import { useSupabaseClient } from "../utils/supabase";
import { useUser } from "@clerk/react";

const TaskList = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user]);

  async function fetchTasks() {
    const { data, error } = await supabase.from("tasks").select("*");
    console.log("Tasks:", data, "Error:", error); // check error too!
    if (!error) setTasks(data);
  }

  async function addTask() {
    if (!input.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from("tasks")
      .insert({ task: input.trim() });

    if (error) {
      console.error("Insert error:", error);
    } else {
      setInput("");
      await fetchTasks(); // refresh list after adding
    }
    setLoading(false);
  }

  return (
    <div className="pt-10 px-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">My Tasks</h2>

      {/* Add Task Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Enter a task..."
          className="border rounded px-3 py-2 flex-1 outline-none"
        />
        <button
          onClick={addTask}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet. Add one above!</p>
      ) : (
        tasks.map((t) => (
          <p key={t.id} className="border-b py-2">
            {t.task}
          </p>
        ))
      )}
    </div>
  );
};

export default TaskList;
