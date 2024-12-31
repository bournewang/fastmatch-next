import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

async function migrate() {
  try {
    // Read all migration files
    const migrationsDir = path.join(process.cwd(), 'db', 'migrations')
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort()

    // Execute each migration
    for (const file of files) {
      console.log(`Executing migration: ${file}`)
      const sql = fs.readFileSync(
        path.join(migrationsDir, file), 
        'utf-8'
      )

      // Write SQL to a temporary file
      const tempFile = path.join(process.cwd(), '.temp.sql')
      fs.writeFileSync(tempFile, sql)

      // Execute SQL using wrangler
      try {
        execSync(`npx wrangler d1 execute fastmatch --file=${tempFile}`, {
          stdio: 'inherit'
        })
      } finally {
        // Clean up temp file
        fs.unlinkSync(tempFile)
      }
    }

    console.log('Migrations completed successfully')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate() 