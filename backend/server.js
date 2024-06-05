const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const sockjs = require('sockjs');

const app = express();
app.use(bodyParser.json());

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Change this to your frontend URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // Allow credentials such as cookies
  }))
const server = http.createServer(app);
const sockjsServer = sockjs.createServer();

sockjsServer.on('connection', (conn) => {
    console.log('Client connected');
    
    conn.on('data', (data) => {
        console.log('Received data:', data);
        // Handle data received from the client
        // Example: Broadcasting the received data to all clients
        sockjsServer.clients.forEach((client) => {
            if (client !== conn) {
                client.write(data);
            }
        });
    });

    conn.on('close', () => {
        console.log('Client disconnected');
    });
});

sockjsServer.installHandlers(server, { prefix: '/sockjs' });


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "signup" 
});

app.use(bodyParser.json());


// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads'); // Specify the directory where you want to store the images
    },
    filename: function (req, file, cb) {
        const filename = file.fieldname + "_" + Date.now() + '-' + path.extname(file.originalname);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });



// Authentication middleware
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    console.log('Token:', token);
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'your-secret-key'); 

        req.user = decoded; 
        req.userId = decoded.id;
        console.log('user',req.user);

        if (!req.user.role) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};


// Signup endpoint
app.post('/signup', upload.single('profilePhoto'), (req, res) => {
    const {
        username, email, confirm_email, password, confirm_password, cin, confirm_cin, sexe, dateOfBirth,
        gouvernoratDeNaissance, paysDeNaissance, situation, rue, ville, codePostal, gouvernorat, telephone
    } = req.body;
    const profilePhoto = req.file ? req.file.path : null;

    const sql = `
        INSERT INTO login (
            username, email, password, cin, date_of_birth, sexe, gouvernorat_de_naissance,
            pays_de_naissance, situation, rue, ville, code_postal, gouvernorat, telephone, profile_photo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        username, email, password, cin, dateOfBirth, sexe, gouvernoratDeNaissance, paysDeNaissance,
        situation, rue, ville, codePostal, gouvernorat, telephone, profilePhoto
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }
        console.log('User registered successfully:', result);
        return res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});


// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error selecting from database:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }

        if (data.length > 0) {
            const token = jwt.sign({ id: data[0].id }, 'your-secret-key');
            
            console.log('User ID:', data[0].id);
            console.log('Username:', data[0].username); 
            req.userId = data[0].id;
            
            return res.status(200).json({ 
                success: true, 
                message: 'Login successful', 
                token, 
                userId: data[0].id, 
                username: data[0].username 
            }); 
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});


// Logout endpoint
app.post('/logout', (req, res) => {
    // Nothing to do here for now, can be expanded in the future
    return res.status(200).json({ success: true, message: 'Logout successful' });
});

// Profile endpoint
app.get('/users', (req, res) => {
    const sql = "SELECT * FROM login";
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching users from database:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
      }
  
      res.status(200).json({ success: true, users: results });
    });
  });
 // Update user information endpoint
 app.put('/users/:id', upload.single('profile_photo'), (req, res) => {
    const userId = req.params.id;
    const { email, cin, dateOfBirth, sexe, gouvernoratDeNaissance, paysDeNaissance, situation, rue, ville, codePostal, gouvernorat, telephone } = req.body;
    let profilePhotoPath = '';
  
    if (req.file) {
      profilePhotoPath = req.file.path;
  
      // Update the profile photo path in the database
      db.query('UPDATE login SET profile_photo = ? WHERE id = ?', [profilePhotoPath, userId], (err, result) => {
        if (err) {
          console.error('Error updating profile photo:', err);
          res.status(500).send('Error updating profile photo');
          return;
        }
      });
    }
  
    const sql = `UPDATE login SET email = ?, cin = ?, date_of_birth = ?, sexe = ?, gouvernorat_de_naissance = ?, pays_de_naissance = ?, situation = ?, rue = ?, ville = ?, code_postal = ?, gouvernorat = ?, telephone = ? WHERE id = ?`;
  
    db.query(sql, [email, cin, dateOfBirth, sexe, gouvernoratDeNaissance, paysDeNaissance, situation, rue, ville, codePostal, gouvernorat, telephone, userId], (err, result) => {
      if (err) {
        console.error('Error updating user information:', err);
        res.status(500).send('Error updating user information');
        return;
      }
      res.send({ message: 'User information updated successfully' });
    });
  });
 
// Endpoint to serve profile images
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filepath);
  });
  
  // Make sure the images are accessible through the correct URL
app.use('/uploads', express.static('uploads'));


// Save user information endpoint
app.post('/saveinfo', authenticateUser, (req, res) => {
    console.log("saveinfo");

    const loginId = req.login.id;
    const { nom, prenom, cin, sexe, dateNaissance, gouvernoratNaissance, paysNaissance, situation, rue, ville, codePostal, telephone } = req.body;
    console.log(loginId);

    // Check if the user record exists
    const checkSql = `SELECT * FROM personal_info WHERE login_id = ?`;
    db.query(checkSql, [loginId], (err, rows) => {
        if (err) {
            console.error('Error checking user information:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }

        // If the user record exists, perform an update
        if (rows.length > 0) {
            const updateSql = `
                UPDATE personal_info 
                SET nom = ?,
                    prenom = ?,
                    cin = ?,
                    sexe = ?,
                    dateNaissance = ?,
                    gouvernoratNaissance = ?,
                    paysNaissance = ?,
                    situation = ?,
                    rue = ?,
                    ville = ?,
                    codePostal = ?,
                    telephone = ?
                WHERE login_id = ?`;

            const values = [nom, prenom, cin, sexe, dateNaissance, gouvernoratNaissance, paysNaissance, situation, rue, ville, codePostal, telephone, loginId];

            db.query(updateSql, values, (err, result) => {
                if (err) {
                    console.error('Error updating user information:', err);
                    return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
                }

                console.log('User information updated successfully:', result);
                return res.status(200).json({ success: true, message: 'User information updated successfully' });
            });
        } else {
            // If the user record doesn't exist, perform an insert
            const insertSql = `
                INSERT INTO personal_info (nom, prenom, cin, sexe, dateNaissance, gouvernoratNaissance, paysNaissance, situation, rue, ville, codePostal, telephone, login_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [nom, prenom, cin, sexe, dateNaissance, gouvernoratNaissance, paysNaissance, situation, rue, ville, codePostal, telephone, loginId];

            db.query(insertSql, values, (err, result) => {
                if (err) {
                    console.error('Error inserting user information:', err);
                    return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
                }

                console.log('User information inserted successfully:', result);
                return res.status(200).json({ success: true, message: 'User information inserted successfully' });
            });
        }
    });
});



// Get user information endpoint
app.get('/getinfo', authenticateUser, (req, res) => {
    const loginId= req.user.id;
    const sql = `SELECT * FROM personal_info WHERE login_id = ?`;
    
    
    db.query(sql, [loginId], (err, result) => {
        if (err) {
            console.error('Error fetching user information:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching user information' });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'User information not found' });
        }

        const personalInfo = result[0];
        
        return res.status(200).json({ success: true, personalInfo });
    });
});



app.post('/adminLogin', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error selecting from database:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }

        if (data.length > 0) {
            return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});
// Coordinator Signup endpoint
app.post('/Coord_signup', (req, res) => {
    const { username, email,cin, password } = req.body;
    const sql = "INSERT INTO coordinatorlogin (username, email, cin, password) VALUES (?, ?, ?, ?)";
    const values = [username, email, cin, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }
        console.log('User registered successfully:', result);
        return res.status(200).json({ success: true, message: 'User registered successfully' });
    });
});

// Coordinator Login endpoint
app.post('/coordinatorLogin', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM coordinatorlogin WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error selecting from database:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }

        if (data.length > 0) {
            return res.status(200).json({ success: true, message: 'Login successful' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.post('/programMasters', (req, res) => {
    const { title, objectifs, duree, structure, cours_obligatoires, cours_optionnels, admission, contact } = req.body;
  
    console.log('Received data:', req.body); // Log the received data
  
    if (!title || !objectifs || !duree || !structure || !cours_obligatoires || !cours_optionnels || !admission || !contact) {
      console.error('Missing fields:', req.body);
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    const sql = "INSERT INTO program_masters (title, objectifs, duree, structure, cours_obligatoires, cours_optionnels, admission, contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [title, objectifs, duree, structure, cours_obligatoires, cours_optionnels, admission, contact];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error creating program master:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while creating the program master' });
      }
      console.log('Program master created successfully:', result);
      return res.status(200).json({ success: true, message: 'Program master created successfully' });
    });
  });
  


// Read all program masters
app.get('/programMasters', (req, res) => {
    const sql = "SELECT * FROM program_masters";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching program masters:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching program masters' });
        }
        console.log('Program masters fetched successfully:', result);
        return res.status(200).json({ success: true, programMasters: result });
    });
});
app.get('/programMasters', (req, res) => {
    const programMasterId = req.params.id;
    const sql = 'SELECT * FROM program_masters WHERE id = ?';
  
    connection.query(sql, [programMasterId], (err, results) => {
      if (err) {
        console.error('Error fetching program master details:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Program master not found' });
        return;
      }
  
      const programMaster = results[0];
      res.json(programMaster);
    });
  });
  app.put('/programMasters/:id', upload.none(), (req, res) => {
    const programId = req.params.id;
    const { title, details, objectifs, structure, cours_obligatoires, cours_optionnels, admission, contact, duree } = req.body;
  
    console.log('Received data:', req.body); // Log received data to debug
  
    // Query to update program details in the database
    const updateQuery = `
      UPDATE program_masters
      SET title = ?, details = ?, objectifs = ?, structure = ?, cours_obligatoires = ?, cours_optionnels = ?, admission = ?, contact = ?, duree = ?
      WHERE id = ?
    `;
  
    // Run the query
    db.query(updateQuery, [title, details, objectifs, structure, cours_obligatoires, cours_optionnels, admission, contact, duree, programId], (error, results) => {
      if (error) {
        console.error('Error updating program details:', error);
        res.status(500).json({ error: 'Failed to update program details' });
      } else {
        res.status(200).json({ message: 'Program details updated successfully' });
      }
    });
  });
  
// Delete a program master
app.delete('/programMasters/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM program_masters WHERE id = ?";

    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error deleting program master:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the program master' });
        }
        console.log('Program master deleted successfully:', result);
        return res.status(200).json({ success: true, message: 'Program master deleted successfully' });
    });
});
app.get('/programMasters/titles', (req, res) => {
    const sql = "SELECT title FROM program_masters";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching program master titles:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching program master titles' });
        }
        const titles = results.map(result => result.title);
        console.log('Program Master Titles:', titles);
        return res.status(200).json(titles);
    });
});
//  endpoint to fetch program courses

app.get('/programCourses',authenticateUser, (req, res) => {
    const teacherId = req.user.id; 

    const sql = `
        SELECT * 
        FROM program_masters 
        WHERE id = (
                SELECT program_master_id 
                FROM teachers 
                WHERE id = ?
        )`;

    db.query(sql, [teacherId], (err, result) => {
        console.log('Teacher ID:', teacherId);
        console.log('SQL Query Result:', result);
        if (err) {
            console.error('Error fetching program courses:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching program courses' });
        }

        return res.status(200).json({ success: true, programCourses: result });
    });
});



const moment = require('moment');
const multiple = upload.fields([
  { name: 'file1' },
  { name: 'file2' },
  { name: 'file3' },
  { name: 'fileBac' } // Add the new file field
]);

app.post('/application', multiple, (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded files:', req.files);

  // Parse moyenne_totale and score_accumulator as strings
  const moyenne_totale = req.body.moyenne_totale ? req.body.moyenne_totale.toString() : null;
  const score_accumulator = req.body.score_accumulator ? req.body.score_accumulator.toString() : null;

  const { username, title, cin } = req.body;
  const file1 = req.files['file1'] ? req.files['file1'][0].path : null; // File path or null
  const file2 = req.files['file2'] ? req.files['file2'][0].path : null;
  const file3 = req.files['file3'] ? req.files['file3'][0].path : null;
  const fileBac = req.files['fileBac'] ? req.files['fileBac'][0].path : null; // File path or null

  // Ensure file paths are extracted correctly
  console.log('File paths:', file1, file2, file3, fileBac);

  // Query to select the cordID based on the program from the teachers table
  const selectCordIDQuery = `
    SELECT id 
    FROM teachers 
    WHERE program = ?`;

  const selectStudentIDQuery = `
    SELECT id 
    FROM login 
    WHERE username = ?`;

  // Execute the query to select cordID
  db.query(selectCordIDQuery, [title], (err, result) => {
    if (err) {
      console.error('Error selecting cordID:', err);
      return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'No teacher found with the specified program' });
    }

    db.query(selectStudentIDQuery, [username], (err, results) => {
      if (err) {
        console.error('Error selecting studentID:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'No student found with the specified username' });
      }

      const studentID = results[0].id;
      const cordID = result[0].id;
      const currentDate = moment().format('YYYY-MM-DD');

      // Insert into the application table with the obtained cordID
      const insertQuery = `
        INSERT INTO application (username, title, cin, file1, file2, file3, fileBac, cordID, moyenne_totale, score_accumulator, date, studentID) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(insertQuery, [username, title, cin, file1, file2, file3, fileBac, cordID, moyenne_totale, score_accumulator, currentDate, studentID], (err, result) => {
        if (err) {
          console.error('Error saving data:', err);
          return res.status(500).json({ success: false, message: 'Error saving data' });
        } else {
          console.log('Data saved successfully');
          // Return the saved data with moyenne_totale and score_accumulator
          return res.status(200).json({
            success: true,
            message: 'Data saved successfully',
            moyenne_totale: moyenne_totale,
            score_accumulator: score_accumulator,
          });
        }
      });
    });
  });
});


  
  
app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    console.log('Requested file:', filename); // Add this line to log requested file

    const filePath = path.join(__dirname, 'uploads', filename);
    
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', err);
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        // Stream the file to the client
        res.sendFile(filePath);
    });
});

  

  
  
app.get('/applications', (req, res) => {
    const sql = "SELECT * FROM application";

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching applications:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching applications' });
        }
        console.log('Applications fetched successfully:', result);
        return res.status(200).json({ success: true, applications: result });
    });
});

app.post('/admininfo', upload.single('image'), (req, res) => {
    const { fullName, email, phoneNumber, department, role, biography } = req.body;
    const image = req.file.filename;
  
    const sql = `INSERT INTO admininfo (fullName, email, phoneNumber, department, role, biography, profileImage) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [fullName, email, phoneNumber, department, role, biography, image];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error saving admin info:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while saving admin info' });
      }
  
      console.log('Admin info saved successfully:', result);
      return res.status(200).json({ success: true, message: 'Admin info saved successfully' });
    });
  });
  app.post('/teachers', (req, res) => {
    const { name, email, cin, city, contact, address, dob, gender, expertise, selectedProgram, loginEmail, loginPassword } = req.body;
    const query = 'INSERT INTO teachers (name, email, cin, city, contact, address, dob, gender, expertise, program, login_email, login_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, cin, city, contact, address, dob, gender, expertise, selectedProgram, loginEmail, loginPassword], (err, results) => {
      if (err) {
        console.error('Error saving teacher:', err);
        res.status(500).json({ success: false, message: 'Error saving teacher' });
        return;
      }
      console.log('Teacher saved successfully');
      res.status(200).json({ success: true, message: 'Teacher saved successfully' });
    });
  });
  // Teacher Login endpoint
  app.post('/teachers/login', (req, res) => {
    const { loginEmail, loginPassword } = req.body;

    const query = 'SELECT * FROM teachers WHERE login_email = ? AND login_password = ?';
    db.query(query, [loginEmail, loginPassword], (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, message: 'An error occurred during login' });
        }
    
        if (results.length > 0) {
            const teacherId = results[0].id;
            console.log('teacherid:',teacherId);
            const program = results[0].program;
            console.log('Program:', program);
            const tokenTeacher = jwt.sign({ email: loginEmail, role: 'teacher', id:teacherId }, 'your-secret-key');
            const decoded = jwt.verify(tokenTeacher, 'your-secret-key'); 

            req.user = decoded; 
            console.log('teacher token',tokenTeacher);
            return res.status(200).json({ success: true, program, token: tokenTeacher }); 
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});


  app.get('/teacher', (req, res) => {
    const { name, cin, program } = req.query;

    let sql = 'SELECT * FROM teachers';

    // If any query parameter is provided, filter the results accordingly
    if (name || cin || program) {
        sql += ' WHERE';
        if (name) sql += ` name = '${name}'`;
        if (cin) {
            if (name) sql += ' AND';
            sql += ` cin = '${cin}'`;
        }
        if (program) {
            if (name || cin) sql += ' AND';
            sql += ` program = '${program}'`;
        }
    }

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching teachers:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching teachers' });
        }

        return res.status(200).json({ success: true, teachers: results });
    });
});
app.delete('/teachers/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM teachers WHERE id = ?";

    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error deleting teacher:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the teacher' });
        }
        console.log('teacher deleted successfully:', result);
        return res.status(200).json({ success: true, message: 'teacher deleted successfully' });
    });
});
app.get('/teachers/:id', (req, res) => {
    const teacherId = req.params.id; // Correctly accessing the ID from req.params
    db.query('SELECT * FROM teachers WHERE id = ?', [teacherId], (error, results) => {
      if (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.length > 0) {
          res.json(results[0]); // Assuming you only expect one teacher with the given ID
        } else {
          res.status(404).json({ error: 'Teacher not found' });
        }
      }
    });
  });
  
  // PUT method to update teacher information
  app.put('/teachers/:id', (req, res) => {
    const teacherId = req.params.id; // Correctly accessing the ID from req.params
    const updatedTeacher = req.body;
    db.query('UPDATE teachers SET ? WHERE id = ?', [updatedTeacher, teacherId], (error, results) => {
      if (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        if (results.affectedRows > 0) {
          res.json({ message: 'Teacher updated successfully' });
        } else {
          res.status(404).json({ error: 'Teacher not found' });
        }
      }
    });
  });
  
app.post('/cordinatorinfo', upload.single('image'), (req, res) => {
    const { fullName, email, phoneNumber, department, role, biography } = req.body;
    const image = req.file.filename;
  
    const sql = `INSERT INTO cordinator_info (fullName, email, phoneNumber, department, role, biography, profileImage) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [fullName, email, phoneNumber, department, role, biography, image];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error saving admin info:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while saving admin info' });
      }
  
      console.log('Admin info saved successfully:', result);
      return res.status(200).json({ success: true, message: 'Admin info saved successfully' });
    });
  });

// Endpoint to fetch demandes for a specific teacher
app.get('/teacherDemandes', authenticateUser, (req, res) => {
    const teacherId = req.user.id;

    const sql = `
        SELECT * 
        FROM application
        WHERE cordID = ?`;

    db.query(sql, [teacherId], (err, result) => {
        if (err) {
            console.error('Error fetching demandes:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching demandes' });
        }

        return res.status(200).json({ success: true, demandes: result });
    });
});

  // API endpoint to save application data
app.post('/resultat', (req, res) => {
    const { username, cin, cordID, title, moyenne_totale, score_accumulator } = req.body;
  
    // SQL query to insert data into the table
    const sql = `INSERT INTO resultat (username, cin, cordID, title, moyenne_totale, score_accumulator) VALUES (?, ?, ?, ?, ?, ?)`;
  
    // Execute the SQL query
    db.query(sql, [username, cin, cordID, title, moyenne_totale, score_accumulator], (err, result) => {
      if (err) {
        console.error('Error saving data to database:', err);
        res.status(500).send('Error saving data to database');
        return;
      }
      console.log('Data saved successfully');
      res.status(200).send('Data saved successfully');
    });
  });
  app.get('/Getresultat', (req, res) => {
    // SQL query to fetch all applications
    const sql = `SELECT * FROM resultat`;
  
    // Execute the SQL query
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching applications:', err);
        res.status(500).send('Error fetching applications');
        return;
      }
  
      res.status(200).json(results); // Send the results as JSON response
    });
  });
  app.get('/cordresult', authenticateUser, (req, res) => {
    const teacherId = req.user.id;

    const sql = `
        SELECT * 
        FROM resultat
        WHERE cordID = ?`;

    db.query(sql, [teacherId], (err, result) => {
        if (err) {
            console.error('Error fetching demandes:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching demandes' });
        }

        return res.status(200).json({ success: true, demandes: result });
    });
});
app.get('/applications_count', (req, res) => {
    const sql = 'SELECT title, COUNT(*) AS count FROM application GROUP BY title';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching applications count by title:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});

  app.get('/successfulApplications_count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM resultat';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching successful applications count:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      const count = results[0].count;
      res.json({ count });
    });
  });
  app.get('/demand_count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM application';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching demand count:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const count = results[0].count;
        res.json({ count });
    });
});

app.get('/teacher_count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM teachers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching teacher count:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const count = results[0].count;
        res.json({ count });
    });
});
app.get('/resultat_count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS count FROM resultat';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching teacher count:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        const count = results[0].count;
        res.json({ count });
    });
});
app.get('/userapplications', (req, res) => {
    
    const sql = `
        SELECT username, title, date
        FROM application
    `;
    db.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
})
app.get('/resultat/titles', (req, res) => {
    const sql = "SELECT title FROM resultat";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching program master titles:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while fetching program master titles' });
        }
        const titles = results.map(result => result.title);
        console.log('Program Master Titles:', titles);
        return res.status(200).json(titles);
    });
});

app.delete('/applications/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM application WHERE id = ?";

    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error deleting teacher:', err);
            return res.status(500).json({ success: false, message: 'An error occurred while deleting the teacher' });
        }
        console.log('teacher deleted successfully:', result);
        return res.status(200).json({ success: true, message: 'teacher deleted successfully' });
    });
});
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
