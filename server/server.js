const express = require("express");

const cors = require("cors");
const { supabase } = require("./supabase/supabaseClient");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.get('/api/tasks', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todo') // Ensure this is your table name
      .select('*');

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const newTask = req.body; // This is the object { taskName: "name", complete: false }
    const { data, error } = await supabase.from("todo").insert([newTask]); // insert requires an array
    
    if (error) {
      throw error;
    }

    console.log("Inserted task:", data);
    res.status(201).json({ message: "Task inserted successfully!", data });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.put('/api/tasks/update', async (req,res) => {
  try{
    const taskToUpdate = req.body;
    const {data,error} = await supabase.from("todo").update({complete:true}).eq('taskName', taskToUpdate.taskName)
    if (error) {
      throw error;
    }
    res.status(200).json({ message: "Task updated successfully!", data });
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
  });

app.listen(4000, () => {
  console.log("server started on port 4000");
});
