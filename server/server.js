
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cookieParser());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234567890MamaTato',
  database: 'cursova',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

const handleQueryResult = (err, results, res) => {
  if (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Internal Server Error');
  } else {
    res.json(results);
  }
};


app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/clientModeJS', express.static(path.join(__dirname, '../clientModeJS')));
app.use('/clientModeHTML', express.static(path.join(__dirname, '../clientModeHTML')));
app.use('/adminModeHTML', express.static(path.join(__dirname, '../adminModeHTML')));
app.use('/adminModeJS', express.static(path.join(__dirname, '../adminModeJS')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../clientModeHTML', 'index.html'));
});


app.get('/getMatchData', (req, res) => {
  const home_team_term = req.query.term1;
  const guest_team_term = req.query.term2;

  const query = `select championat_round, home_team, guest_team, h_scored_goals, h_possesion_in_percents, 
  h_total_attempts, h_shots_on_target, h_total_attacks, h_dangerous_attacks,
  g_scored_goals,g_possesion_in_percents,g_total_attempts, g_shots_on_target,
  g_total_attacks, g_dangerous_attacks from football_matches 
  inner join home_statistics on t1_id=home_id
  inner join guest_statistics on t1_id = guest_id WHERE home_team LIKE '%${home_team_term}%' AND guest_team LIKE '%${guest_team_term}%'`;
  
  connection.query(query, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getTeamData', (req, res) => {
  const team_name_term = req.query.term;
  const query = `
  SELECT
    team,
    CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
    CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
    cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
    CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
    CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
    CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
        home_team AS team,
        AVG(h_scored_goals) AS avg_scored_goals,
        AVG(h_possesion_in_percents) AS avg_possession,
        AVG(h_total_attempts) AS avg_total_attempts,
        AVG(h_shots_on_target) AS avg_shots_on_target,
        AVG(h_total_attacks) AS avg_total_attacks,
        AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
        football_matches
  INNER JOIN
        home_statistics ON t1_id = home_id
  WHERE
        home_team like '%${team_name_term}%'
  GROUP BY
        home_team

  UNION

  SELECT
        guest_team AS team,
        AVG(g_scored_goals) AS avg_scored_goals,
        AVG(g_possesion_in_percents) AS avg_possession,
        AVG(g_total_attempts) AS avg_total_attempts,
        AVG(g_shots_on_target) AS avg_shots_on_target,
        AVG(g_total_attacks) AS avg_total_attacks,
        AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
        football_matches
  INNER JOIN
        guest_statistics ON t1_id = guest_id
  WHERE
        guest_team like '%${team_name_term}%'
  GROUP BY
        guest_team
    ) AS subquery
  GROUP BY
    team;`
  
  
  connection.query(query, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getAllTeamData', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
  team;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton2', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
  overall_avg_scored_goals desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton3', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
  overall_avg_possession desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton4', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
  overall_avg_total_attempts desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton5', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
 overall_avg_shots_on_target desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton6', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
 overall_avg_total_attacks desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getSortButton7', (req, res) => {
  
  const query2 = `
  SELECT
  team,
      CAST(AVG(avg_scored_goals) as decimal(10,3)) AS overall_avg_scored_goals,
      CAST(AVG(avg_possession) as decimal(10,3)) AS overall_avg_possession,
      cast(AVG(avg_total_attempts) as decimal(10,3)) AS overall_avg_total_attempts,
      CAST(AVG(avg_shots_on_target) as decimal(10,3)) AS overall_avg_shots_on_target,
      CAST(AVG(avg_total_attacks) as decimal(10,3)) AS overall_avg_total_attacks,
      CAST(AVG(avg_dangerous_attacks) as decimal(10,3)) AS overall_avg_dangerous_attacks
  FROM (
  SELECT
      home_team AS team,
      AVG(h_scored_goals) AS avg_scored_goals,
      AVG(h_possesion_in_percents) AS avg_possession,
      AVG(h_total_attempts) AS avg_total_attempts,
      AVG(h_shots_on_target) AS avg_shots_on_target,
      AVG(h_total_attacks) AS avg_total_attacks,
      AVG(h_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      home_statistics ON t1_id = home_id
  GROUP BY
      home_team

  UNION

  SELECT
      guest_team AS team,
      AVG(g_scored_goals) AS avg_scored_goals,
      AVG(g_possesion_in_percents) AS avg_possession,
      AVG(g_total_attempts) AS avg_total_attempts,
      AVG(g_shots_on_target) AS avg_shots_on_target,
      AVG(g_total_attacks) AS avg_total_attacks,
      AVG(g_dangerous_attacks) AS avg_dangerous_attacks
  FROM
      football_matches
  INNER JOIN
      guest_statistics ON t1_id = guest_id
  GROUP BY
      guest_team
) AS subquery
GROUP BY
  team
Order by 
 overall_avg_dangerous_attacks desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});


app.get('/getPlayerData', (req, res) => {
  const player_name_term = req.query.term;

  const checkPlayerQuery = `SELECT COUNT(*) as playerCount FROM player WHERE full_name LIKE '%${player_name_term}%'`;

  connection.query(checkPlayerQuery, (err, countResult) => {
    if (err) {
      console.error('Error checking player existence:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const playerCount = countResult[0].playerCount;

      if (playerCount > 0) {
        
        const query = `SELECT full_name,
          SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
          SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
          SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
          FROM goals_stat 
          INNER JOIN player ON author_of_goal_id = t2_id
          WHERE full_name LIKE '%${player_name_term}%'
          GROUP BY full_name;`;

        connection.query(query, (err, results) => {
          handleQueryResult(err, results, res);
        });
      } else {
        res.json({ error: 'Player not found' });
      }
    }
  });
});

app.get('/getAllPlayerData', (req, res) => {
  
  const query2 = `SELECT full_name,
    SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
    SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
    SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
    FROM goals_stat 
    INNER JOIN player ON author_of_goal_id = t2_id
    GROUP BY full_name;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getHiddenButtonData', (req, res) => {
  
  const query2 = `SELECT full_name,
    SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
    SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
    SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
    FROM goals_stat 
    INNER JOIN player ON author_of_goal_id = t2_id
    GROUP BY full_name
    order by full_name;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getHiddenButton2Data', (req, res) => {
  
  const query2 = `SELECT full_name,
    SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
    SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
    SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
    FROM goals_stat 
    INNER JOIN player ON author_of_goal_id = t2_id
    GROUP BY full_name
    order by goals_scored desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getHiddenButton3Data', (req, res) => {
  
  const query2 = `SELECT full_name,
    SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
    SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
    SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
    FROM goals_stat 
    INNER JOIN player ON author_of_goal_id = t2_id
    GROUP BY full_name
    order by penalties_scored desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getHiddenButton4Data', (req, res) => {
  
  const query2 = `SELECT full_name,
    SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
    SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
    SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
    FROM goals_stat 
    INNER JOIN player ON author_of_goal_id = t2_id
    GROUP BY full_name
    order by autogoals_scored desc;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

// Handling SELECT statements
app.get('/executeSelect', (req, res) => {
  const sqlQuery = req.query.sql;

  connection.query(sqlQuery, (err, results) => {
      if (err) {
          console.error('Error executing SELECT statement:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(results);
  });
});

// Handling UPDATE statements
app.put('/executeUpdate', (req, res) => {
  const sqlQuery = req.query.sql; // Change to req.query to match client-side

  connection.query(sqlQuery, (err, results) => {
      if (err) {
          console.error('Error executing UPDATE statement:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json(results);
  });
});



app.post('/executeInsert', (req, res) => {
  const sqlQuery = req.body.sql;

  connection.query(sqlQuery, (err, results) => {
      if (err) {
          console.error('Error executing INSERT INTO statement:', err);
          return res.status(500).json({ error: `Internal Server Error: ${err.message}` });
      }

      res.json(results);
  });
});




const adminUsername = 'admin';
const adminPassword = 'adminPassword';

// Middleware to check if user is authenticated
function authenticate(req, res, next) {
  if (req.cookies && req.cookies.authenticated) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.redirect('/adminModeHTML/index5.html')
  }
}


// Set no-cache headers
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use(session({
  secret: '12345', // Change this to a secure secret
  resave: false,
  saveUninitialized: false
}));


// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if credentials are correct (in a real-world scenario, you'd hash and compare passwords)
  if (username === adminUsername && password === adminPassword) {
    // Set a cookie to mark the user as authenticated
    
    
    res.cookie('authenticated', true);
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // Clear the authentication cookie
  res.clearCookie('authenticated');
  res.json({ message: 'Logout successful' });
});

// Example admin-only endpoint
app.get('/admin', authenticate, (req, res) => {
  res.sendFile(path.join(__dirname, '../adminModeHTML/index6.html'));
});


app.listen(port, () => {
  console.log('Сервер запущено на порту 5000');
});

