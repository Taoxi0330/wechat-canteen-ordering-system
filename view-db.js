
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'canteen_ordering'
};

async function main() {
  console.log('========================================');
  console.log('  Canteen Ordering System - DB Viewer');
  console.log('========================================\n');

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('[OK] Database connected successfully!\n');
    
    await listTables(connection);
    await showTableData(connection);
    await showTableStructure(connection);
    
  } catch (error) {
    console.error('[ERROR] Database connection failed:', error.message);
    console.error('\nPlease make sure:');
    console.error('1. MySQL service is running');
    console.error('2. Database canteen_ordering exists');
    console.error('3. Username and password are correct');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function listTables(connection) {
  try {
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('[Tables] List of tables:');
    console.log('------------------------');
    const tableNames = [];
    for (let i = 0; i &lt; tables.length; i++) {
      const table = tables[i];
      const name = Object.values(table)[0];
      tableNames.push(name);
      console.log(`${i + 1}. ${name}`);
    }
    console.log('------------------------\n');
    return tableNames;
  } catch (error) {
    console.error('[ERROR] Failed to get tables:', error.message);
    return [];
  }
}

async function showTableData(connection) {
  const tableNames = await listTables(connection);
  
  for (let i = 0; i &lt; tableNames.length; i++) {
    const tableName = tableNames[i];
    try {
      const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
      const total = countResult[0].total;
      
      console.log(`\n[Data] Table: ${tableName} (Total: ${total} records)`);
      
      if (total === 0) {
        console.log('   (Table is empty)');
        continue;
      }
      
      const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT 10`);
      
      if (rows.length === 0) {
        console.log('   (Table is empty)');
        continue;
      }
      
      const columns = Object.keys(rows[0]);
      const separator = '-'.repeat(100);
      
      console.log(separator);
      const header = columns.map(col =&gt; {
        const shortCol = col.length &gt; 15 ? col.substring(0, 15) : col;
        return shortCol.padEnd(15);
      }).join(' | ');
      console.log(header);
      console.log(separator);
      
      for (let j = 0; j &lt; rows.length; j++) {
        const row = rows[j];
        const values = columns.map(col =&gt; {
          let value = row[col];
          if (value === null) {
            return 'NULL'.padEnd(15);
          }
          let strValue = String(value);
          if (strValue.length &gt; 15) {
            strValue = strValue.substring(0, 12) + '...';
          }
          return strValue.padEnd(15);
        });
        console.log(values.join(' | '));
      }
      
      console.log(separator);
      if (total &gt; 10) {
        console.log(`   (Showing first 10 of ${total} records)`);
      }
      
    } catch (error) {
      console.error(`[ERROR] Failed to get data for ${tableName}:`, error.message);
    }
  }
}

async function showTableStructure(connection) {
  const tableNames = await listTables(connection);
  
  console.log('\n[Structure] Table structure information:');
  console.log('='.repeat(100));
  
  for (let i = 0; i &lt; tableNames.length; i++) {
    const tableName = tableNames[i];
    try {
      const [columns] = await connection.execute(`DESCRIBE ${tableName}`);
      
      console.log(`\nTable: ${tableName}`);
      console.log('-'.repeat(100));
      console.log(
        'Field'.padEnd(20) + ' | ' +
        'Type'.padEnd(20) + ' | ' +
        'Null'.padEnd(10) + ' | ' +
        'Key'.padEnd(10) + ' | ' +
        'Default'.padEnd(15)
      );
      console.log('-'.repeat(100));
      
      for (let j = 0; j &lt; columns.length; j++) {
        const col = columns[j];
        const field = col.Field.length &gt; 20 ? col.Field.substring(0, 20) : col.Field;
        const type = col.Type.length &gt; 20 ? col.Type.substring(0, 20) : col.Type;
        const defaultValue = col.Default !== null ? String(col.Default) : 'NULL';
        
        console.log(
          field.padEnd(20) + ' | ' +
          type.padEnd(20) + ' | ' +
          col.Null.padEnd(10) + ' | ' +
          (col.Key || '').padEnd(10) + ' | ' +
          defaultValue.padEnd(15)
        );
      }
      
    } catch (error) {
      console.error(`[ERROR] Failed to get structure for ${tableName}:`, error.message);
    }
  }
  
  console.log('='.repeat(100));
}

main();
