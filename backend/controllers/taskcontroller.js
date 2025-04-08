import connection from "../config/db.js";

//add more tasks
export const addTask = async (req, res) => {
    const { title, description } = req.body
    const user_id = req.user.userId

    // Checking if any of the params is not received
    if (!title) {
        return res.status(400).json({ message: 'Every field is mandatory' });
    }

    try {
        const query = 'INSERT INTO TASKS (description,title,user_id) VALUES (?,?,?)'
        const [result] = await connection.promise().query(query, [description, title, user_id])

        //return newly added task data as response
        const newTask= await connection.promise().query('SELECT * FROM tasks WHERE id=?',[result.insertId])
        return res.status(201).json({ message: "Task added successfully", taskId: result.insertId,task:newTask[0] })

    }
    catch (error) {
        console.error('Error during adding task', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}


//list user tasks
export const listTask = async (req, res) => {
    const user_id = req.user.userId

    try {
        const [user]=await connection.promise().query('SELECT * FROM users WHERE id=?',[user_id])
        const query = 'SELECT * FROM TASKS WHERE user_id = ?  ORDER BY created_at ASC '
        const [result] = await connection.promise().query(query, [user_id])

        // If no tasks found for the user, return an appropriate message
        if (result.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user', user:user[0].email });
        }
        res.status(200).json({ tasks: result,user: user[0].email });
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}



//delete specific task
export const deleteTask = async (req, res) => {
    const task_id = req.params.id;
    console.log(task_id)
    const user_id = req.user.userId;


    try {
        const [task] = await connection.promise().query('SELECT * FROM TASKS WHERE id = ? AND user_id = ?', [task_id, user_id]);
        //query to delete task
        const query = 'DELETE FROM TASKS WHERE id = ? AND user_id = ?';
        const [result] = await connection.promise().query(query, [task_id, user_id]);


        res.status(200).json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
