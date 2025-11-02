import cron from "node-cron";
import exportService from "./exportService.js";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

class BackupService {
  constructor() {
    this.backupDir = path.join(process.cwd(), 'uploads', 'backups');
    this.ensureBackupDirectory();
    this.initializeScheduledBackups();
  }

  ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  // Initialize scheduled backup jobs
  initializeScheduledBackups() {
    // Daily data export backup at 2 AM
    cron.schedule('0 2 * * *', () => {
      console.log('Running daily data backup...');
      this.createDailyBackup();
    });

    // Weekly full backup on Sundays at 3 AM
    cron.schedule('0 3 * * 0', () => {
      console.log('Running weekly full backup...');
      this.createWeeklyBackup();
    });

    // Monthly cleanup of old backups on the 1st at 4 AM
    cron.schedule('0 4 1 * *', () => {
      console.log('Running monthly backup cleanup...');
      this.cleanupOldBackups();
    });

    console.log('Backup automation initialized');
  }

  // Create daily data backup
  async createDailyBackup() {
    try {
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      console.log(`Creating daily backup for ${timestamp}...`);

      const result = await exportService.createDataBackup();
      
      // Move backup to daily backup directory
      const dailyBackupDir = path.join(this.backupDir, 'daily');
      if (!fs.existsSync(dailyBackupDir)) {
        fs.mkdirSync(dailyBackupDir, { recursive: true });
      }

      const newFilename = `daily_backup_${timestamp}.zip`;
      const newFilepath = path.join(dailyBackupDir, newFilename);
      
      fs.renameSync(result.filepath, newFilepath);

      console.log(`Daily backup created: ${newFilename}`);
      
      return {
        success: true,
        filename: newFilename,
        filepath: newFilepath,
        size: result.size,
        files: result.files
      };
    } catch (error) {
      console.error('Failed to create daily backup:', error);
      throw error;
    }
  }

  // Create weekly full backup (includes database dump)
  async createWeeklyBackup() {
    try {
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      console.log(`Creating weekly backup for ${timestamp}...`);

      // Create data export backup
      const dataBackup = await exportService.createDataBackup();
      
      // Create database dump
      const dbBackup = await this.createDatabaseDump();

      // Create weekly backup directory
      const weeklyBackupDir = path.join(this.backupDir, 'weekly');
      if (!fs.existsSync(weeklyBackupDir)) {
        fs.mkdirSync(weeklyBackupDir, { recursive: true });
      }

      // Move files to weekly backup directory
      const dataFilename = `weekly_data_backup_${timestamp}.zip`;
      const dbFilename = `weekly_db_backup_${timestamp}.gz`;
      
      fs.renameSync(dataBackup.filepath, path.join(weeklyBackupDir, dataFilename));
      fs.renameSync(dbBackup.filepath, path.join(weeklyBackupDir, dbFilename));

      console.log(`Weekly backup created: ${dataFilename}, ${dbFilename}`);
      
      return {
        success: true,
        dataBackup: {
          filename: dataFilename,
          size: dataBackup.size,
          files: dataBackup.files
        },
        databaseBackup: {
          filename: dbFilename,
          size: dbBackup.size
        }
      };
    } catch (error) {
      console.error('Failed to create weekly backup:', error);
      throw error;
    }
  }

  // Create database dump
  async createDatabaseDump() {
    try {
      const timestamp = Date.now();
      const filename = `db_dump_${timestamp}.gz`;
      const filepath = path.join(this.backupDir, filename);

      // Get MongoDB URI from environment
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MongoDB URI not found in environment variables');
      }

      // Extract database name from URI
      const dbName = mongoUri.split('/').pop().split('?')[0];

      // Create mongodump command
      const dumpCommand = `mongodump --uri="${mongoUri}" --archive="${filepath}" --gzip`;

      console.log('Creating database dump...');
      await execAsync(dumpCommand);

      const stats = fs.statSync(filepath);
      
      console.log(`Database dump created: ${filename} (${stats.size} bytes)`);
      
      return {
        filename,
        filepath,
        size: stats.size
      };
    } catch (error) {
      console.error('Failed to create database dump:', error);
      
      // If mongodump is not available, create a fallback backup
      console.log('Falling back to data export backup...');
      return await exportService.createDataBackup();
    }
  }

  // Restore database from dump
  async restoreDatabase(dumpFilepath) {
    try {
      const mongoUri = process.env.MONGO_URI;
      if (!mongoUri) {
        throw new Error('MongoDB URI not found in environment variables');
      }

      if (!fs.existsSync(dumpFilepath)) {
        throw new Error('Dump file not found');
      }

      const restoreCommand = `mongorestore --uri="${mongoUri}" --archive="${dumpFilepath}" --gzip --drop`;

      console.log('Restoring database from dump...');
      await execAsync(restoreCommand);

      console.log('Database restored successfully');
      
      return {
        success: true,
        message: 'Database restored successfully'
      };
    } catch (error) {
      console.error('Failed to restore database:', error);
      throw error;
    }
  }

  // Clean up old backups
  async cleanupOldBackups() {
    try {
      const dailyRetentionDays = 7; // Keep daily backups for 7 days
      const weeklyRetentionDays = 30; // Keep weekly backups for 30 days

      let deletedCount = 0;

      // Clean up daily backups
      const dailyBackupDir = path.join(this.backupDir, 'daily');
      if (fs.existsSync(dailyBackupDir)) {
        deletedCount += await this.cleanupDirectory(dailyBackupDir, dailyRetentionDays);
      }

      // Clean up weekly backups
      const weeklyBackupDir = path.join(this.backupDir, 'weekly');
      if (fs.existsSync(weeklyBackupDir)) {
        deletedCount += await this.cleanupDirectory(weeklyBackupDir, weeklyRetentionDays);
      }

      // Clean up export files
      const exportCleanup = await exportService.cleanupOldExports(7);
      deletedCount += exportCleanup.deletedCount;

      console.log(`Cleanup completed: ${deletedCount} files deleted`);
      
      return {
        success: true,
        deletedCount
      };
    } catch (error) {
      console.error('Failed to cleanup old backups:', error);
      throw error;
    }
  }

  // Helper method to clean up a directory
  async cleanupDirectory(directory, retentionDays) {
    const files = fs.readdirSync(directory);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    let deletedCount = 0;

    files.forEach(file => {
      const filepath = path.join(directory, file);
      const stats = fs.statSync(filepath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filepath);
        deletedCount++;
        console.log(`Deleted old backup: ${file}`);
      }
    });

    return deletedCount;
  }

  // List all backups
  async listBackups() {
    try {
      const backups = {
        daily: [],
        weekly: []
      };

      // List daily backups
      const dailyBackupDir = path.join(this.backupDir, 'daily');
      if (fs.existsSync(dailyBackupDir)) {
        backups.daily = fs.readdirSync(dailyBackupDir).map(filename => {
          const filepath = path.join(dailyBackupDir, filename);
          const stats = fs.statSync(filepath);
          
          return {
            filename,
            size: stats.size,
            createdAt: stats.birthtime,
            type: 'daily'
          };
        }).sort((a, b) => b.createdAt - a.createdAt);
      }

      // List weekly backups
      const weeklyBackupDir = path.join(this.backupDir, 'weekly');
      if (fs.existsSync(weeklyBackupDir)) {
        backups.weekly = fs.readdirSync(weeklyBackupDir).map(filename => {
          const filepath = path.join(weeklyBackupDir, filename);
          const stats = fs.statSync(filepath);
          
          return {
            filename,
            size: stats.size,
            createdAt: stats.birthtime,
            type: 'weekly'
          };
        }).sort((a, b) => b.createdAt - a.createdAt);
      }

      return backups;
    } catch (error) {
      console.error('Failed to list backups:', error);
      throw error;
    }
  }

  // Manual backup trigger
  async createManualBackup(type = 'full') {
    try {
      switch (type) {
        case 'data':
          return await exportService.createDataBackup();
        case 'database':
          return await this.createDatabaseDump();
        case 'full':
        default:
          const [dataBackup, dbBackup] = await Promise.all([
            exportService.createDataBackup(),
            this.createDatabaseDump()
          ]);
          
          return {
            success: true,
            dataBackup,
            databaseBackup: dbBackup
          };
      }
    } catch (error) {
      console.error('Failed to create manual backup:', error);
      throw error;
    }
  }
}

export default new BackupService();
