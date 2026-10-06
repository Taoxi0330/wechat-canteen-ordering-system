
const http = require('http');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

async function getDBData() {
  const conn = await mysql.createConnection(dbConfig);
  const [tables] = await conn.execute('SHOW TABLES');
  
  const data = {};
  const tableNames = [];
  
  for (let i = 0; i < tables.length; i++) {
    const t = Object.values(tables[i])[0];
    tableNames.push(t);
    const [rows] = await conn.execute('SELECT * FROM ' + t + ' LIMIT 20');
    data[t] = rows;
  }
  
  await conn.end();
  return { tables: tableNames, data: data };
}

function generateHTML(dbData) {
  let html = `
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;title&gt;校园食堂订餐系统 - 数据库查看器&lt;/title&gt;
  &lt;style&gt;
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    h1 { color: #333; text-align: center; }
    .container { max-width: 1200px; margin: 0 auto; }
    .db-info { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .table-section { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #4CAF50; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .table-name { font-size: 1.2em; font-weight: bold; color: #333; margin-bottom: 5px; }
    .table-count { color: #666; font-size: 0.9em; }
    .nav { position: fixed; top: 20px; right: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    .nav a { display: block; margin: 5px 0; color: #4CAF50; text-decoration: none; }
    .nav a:hover { text-decoration: underline; }
    .null { color: #999; font-style: italic; }
    .truncate { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div class="container"&gt;
    &lt;h1&gt;🍜 校园食堂订餐系统 - 数据库查看器&lt;/h1&gt;
    &lt;div class="db-info"&gt;
      &lt;strong&gt;数据库:&lt;/strong&gt; canteen_ordering&lt;br&gt;
      &lt;strong&gt;表数量:&lt;/strong&gt; ${dbData.tables.length}
    &lt;/div&gt;
    &lt;div class="nav"&gt;
      &lt;strong&gt;快速跳转:&lt;/strong&gt;
`;
  
  for (let i = 0; i < dbData.tables.length; i++) {
    const t = dbData.tables[i];
    html += '&lt;a href="#' + t + '"&gt;' + t + '&lt;/a&gt;';
  }
  
  html += '&lt;/div&gt;';
  
  for (let i = 0; i < dbData.tables.length; i++) {
    const tableName = dbData.tables[i];
    const rows = dbData.data[tableName];
    
    html += '&lt;div class="table-section" id="' + tableName + '"&gt;';
    html += '&lt;div class="table-name"&gt;' + tableName + '&lt;/div&gt;';
    html += '&lt;div class="table-count"&gt;记录数: ' + rows.length + (rows.length &gt;= 20 ? ' (显示前20条)' : '') + '&lt;/div&gt;';
    
    if (rows.length &gt; 0) {
      const cols = Object.keys(rows[0]);
      html += '&lt;table&gt;';
      html += '&lt;thead&gt;&lt;tr&gt;';
      for (let j = 0; j &lt; cols.length; j++) {
        html += '&lt;th&gt;' + cols[j] + '&lt;/th&gt;';
      }
      html += '&lt;/tr&gt;&lt;/thead&gt;';
      html += '&lt;tbody&gt;';
      
      for (let j = 0; j &lt; rows.length; j++) {
        const row = rows[j];
        html += '&lt;tr&gt;';
        for (let k = 0; k &lt; cols.length; k++) {
          let val = row[cols[k]];
          if (val === null) {
            html += '&lt;td class="null"&gt;NULL&lt;/td&gt;';
          } else {
            let strVal = String(val);
            if (strVal.length &gt; 50) {
              strVal = strVal.substring(0, 50) + '...';
            }
            html += '&lt;td class="truncate" title="' + strVal.replace(/"/g, '&amp;quot;') + '"&gt;' + strVal.replace(/&lt;/g, '&amp;lt;').replace(/&gt;/g, '&amp;gt;') + '&lt;/td&gt;';
          }
        }
        html += '&lt;/tr&gt;';
      }
      html += '&lt;/tbody&gt;&lt;/table&gt;';
    } else {
      html += '&lt;p style="color: #999;"&gt;表为空&lt;/p&gt;';
    }
    html += '&lt;/div&gt;';
  }
  
  html += `
  &lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;`;
  
  return html;
}

const server = http.createServer(async (req, res) =&gt; {
  try {
    const dbData = await getDBData();
    const html = generateHTML(dbData);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('&lt;h1&gt;错误: ' + e.message + '&lt;/h1&gt;');
  }
});

server.listen(3001, () =&gt; {
  console.log('========================================');
  console.log('  数据库查看器已启动！');
  console.log('========================================');
  console.log('');
  console.log('请在浏览器中打开:');
  console.log('  http://localhost:3001');
  console.log('');
  console.log('你也可以在局域网中访问:');
  console.log('  http://你的电脑IP:3001');
  console.log('');
  console.log('按 Ctrl+C 停止服务器');
  console.log('========================================');
});
