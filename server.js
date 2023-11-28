
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 5000;

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

app.get('/', (req, res) => {
  //res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.sendFile(path.join(__dirname, 'index.html'));
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
  const query = `SELECT * FROM team where team_name LIKE '%${team_name_term}%'`;
  connection.query(query, (err, results) => {
    handleQueryResult(err, results, res);
  });
});

app.get('/getPlayerData', (req, res) => {
  const player_name_term = req.query.term;

  // Check if the player exists in the database
  const checkPlayerQuery = `SELECT COUNT(*) as playerCount FROM player WHERE full_name LIKE '%${player_name_term}%'`;

  connection.query(checkPlayerQuery, (err, countResult) => {
    if (err) {
      console.error('Error checking player existence:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const playerCount = countResult[0].playerCount;

      if (playerCount > 0) {
        // Player exists, now fetch the player data
        const query = `SELECT full_name,
          SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
          SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
          SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
          FROM goals_stat 
          INNER JOIN player ON author_of_goal_id = t2_id
          WHERE full_name LIKE '%${player_name_term}%'
          GROUP BY full_name;`;

        connection.query(query, (err, results) => {
          if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal Server Error');
          } else {
            res.json(results);
          }
        });
      } else {
        // Player does not exist
        res.json({ error: 'Player not found' });
      }
    }
  });
});

/*
app.get('/getPlayerData', (req, res) => {
  const player_name_term = req.query.term;
  const query2 = `SELECT full_name,
    SUM(CASE WHEN (minute_of_goal > 0 AND minute_of_goal < 100) THEN 1 ELSE 0 END) AS goals_scored,
    SUM(CASE WHEN penalty = 1 THEN 1 ELSE 0 END) AS penalties_scored,
    SUM(CASE WHEN autogoal = 1 THEN 1 ELSE 0 END) AS autogoals_scored
    FROM goals_stat 
    INNER JOIN player ON author_of_goal_id = t2_id
    WHERE full_name LIKE '%${player_name_term}%'
    GROUP BY full_name;`;

  connection.query(query2, (err, results) => {
    handleQueryResult(err, results, res);
  });
});
*/
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




// Маршрут для отримання даних з бази даних
app.listen(port, () => {
  console.log('Сервер запущено на порту 5000');
});

