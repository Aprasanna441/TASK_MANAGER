Tools Used
----------

*   **Frontend**: React.js ,Bootstrap 5.3
*   **Backend**: node.js and Express
*   **Database**: MySQL(Xampp Server)
*   **Authentication**: JWT token, bcrypt
*   **Libraries** Dotenv(env variables store),CORS(cross origin resource sharing),mysql2, React router dom

How to Set Up the Project
-------------------------

### 1\. Install Required Software

*   Install Node.js
*   Install MySQL(OR XAMPP server is good)

### Backend Setup (Node.js & Express)

#### Step 1: Clone the Project

    git clone 
    cd  backend

#### Step 2: Install Dependencies

    npm i

#### Step 4: Set Up  Environment Variables

Make a file called `.env` in the backend folder and add your database info and secret key:

    DATABASE_HOST=localhost
    DATABASE_USER=your-db-username
    DATABASE_PASSWORD=your-db-password
    DATABASE_NAME=your-db-name
    JWT_SECRET=your-secret-key

#### Step 5: Start the Backend Server

    npm start

Your backend server will run at `http://localhost:8000`.

### Frontend Setup (React)

#### Step 1: Install Frontend Dependencies

    npm i


#### Step 3: Start the Frontend Server

    npm start

### 1\. Register POST /api/user/signup

To create a new account, send a POST request with the user's email and password:

    {
          "email": "user@example.com",
          "password": "password123"
          "password_confirm:"password123"
        }


### 2\. Login User: POST /api/user/login

To log in, send a POST request with the user's email and password:

    {
          "email": "user@example.com",
          "password": "password123"
        }


### 3\. Get All Tasks: GET /api/tasks/list

To see all your tasks, send a GET request with the JWT token in the header:



### 4\. Add a New Task: POST /api/tasks/add

To add a new task, send a POST request with the task title and description:

    {
          "title": "New Task",
          "description": "Task description"
        }


### 5\. Delete a Task: DELETE /api/tasks/delete/:id

To delete a task, hit the Deletion button beside task list in each row.





