
const http = require('http');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

const server = http.createServer(async function(req, res) {
  let conn;
  try {
    conn = await mysql.createConnection(dbConfig);
    
    let html = '<html><head><meta charset="utf-8"><title>DB Viewer</title>';
    html += '<style>body{font-family:Arial;margin:20px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ddd;padding:8px;}th{background:#4CAF50;color:white;}tr:nth-child(even){background:#f9f9f9;}</style>';
    html += '</head><body>';
    html += '<h1>Database Viewer</h1>';
    
    const [tables] = await conn.execute('SHOW TABLES');
    const names = [];
    for (let i = 0; i < tables.length; i++) {
      const n = Object.values(tables[i])[0];
      names.push(n);
    }
    
    for (let i = 0; i < names.length; i++) {
      const t = names[i];
      html += '<h2>' + t + '</h2>';
      const [data] = await conn.execute('SELECT * FROM ' + t + ' LIMIT 10');
      html += '<p>Count: ' + data.length + '</p>';
      
      if (data.length > 0) {
        html += '<table>';
        const cols = Object.keys(data[0]);
        html += '<tr>';
        for (let j = 0; j < cols.length; j++) {
          html += '<th>' + cols[j] + '</th>';
        }
        html += '</tr>';
        
        for (let j = 0; j < data.length; j++) {
          html += '<tr>';
          const row = data[j];
          for (let k = 0; k < cols.length; k++) {
            let v = row[cols[k]];
            if (v === null) {
              html += '<td>NULL</td>';
            } else {
              let s = String(v);
              if (s.length > 50) {
                s = s.substring(0, 50) + '...';
              }
              html += '<td>' + s + '</td>';
            }
          }
          html += '</tr>';
        }
        html += '</table>';
      }
    }
    
    html += '</body></html>';
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(html);
    
  } catch (e) {
    res.writeHead(500, {'Content-Type': 'text/html; charset=utf-8'});
    res.end('<h1>Error: ' + e.message + '</h1>');
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

server.listen(3001, function() {
  console.log('');
  console.log('========================================');
  console.log('  Database Viewer is running!');
  console.log('========================================');
  console.log('');
  console.log('Open in your browser:');
  console.log('  http://localhost:3001');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('========================================');
  console.log('');
});
