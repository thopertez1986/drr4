import mysql from 'mysql2/promise';

interface MySQLConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port?: number;
}

class DatabaseManager {
  private mysqlConnection: mysql.Connection | null = null;
  private currentType: 'supabase' | 'mysql' = 'supabase';

  async connectMySQL(config: MySQLConfig): Promise<boolean> {
    try {
      // Disconnect existing connection first
      if (this.mysqlConnection) {
        await this.mysqlConnection.end();
      }
      
      this.mysqlConnection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port || 3306,
        ssl: false,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 10000
      });

      // Test connection
      await this.mysqlConnection.ping();
      this.currentType = 'mysql';
      return true;
    } catch (error) {
      console.error('MySQL connection failed:', error);
      this.mysqlConnection = null;
      return false;
    }
  }

  async disconnectMySQL(): Promise<void> {
    if (this.mysqlConnection) {
      await this.mysqlConnection.end();
      this.mysqlConnection = null;
      this.currentType = 'supabase';
    }
  }

  getCurrentType(): 'supabase' | 'mysql' {
    return this.currentType;
  }

  isConnected(): boolean {
    return this.currentType === 'supabase' || this.mysqlConnection !== null;
  }

  // MySQL query methods
  async mysqlQuery(sql: string, params: any[] = []): Promise<any> {
    if (!this.mysqlConnection) {
      throw new Error('MySQL not connected');
    }
    
    const [rows] = await this.mysqlConnection.execute(sql, params);
    return rows;
  }

  // News operations for MySQL
  async getNewsMySQL(): Promise<any[]> {
    return this.mysqlQuery('SELECT * FROM news ORDER BY created_at DESC');
  }

  async addNewsMySQL(news: any): Promise<any> {
    const sql = 'INSERT INTO news (title, excerpt, content, image, author, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [news.title, news.excerpt, news.content, news.image, news.author, news.status, news.date];
    const result = await this.mysqlQuery(sql, params);
    return { id: result.insertId, ...news };
  }

  // Services operations for MySQL
  async getServicesMySQL(): Promise<any[]> {
    const rows = await this.mysqlQuery('SELECT * FROM services ORDER BY created_at DESC');
    return rows.map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  }

  async addServiceMySQL(service: any): Promise<any> {
    const sql = 'INSERT INTO services (title, description, icon, tags, status) VALUES (?, ?, ?, ?, ?)';
    const params = [service.title, service.description, service.icon, JSON.stringify(service.tags), service.status];
    const result = await this.mysqlQuery(sql, params);
    return { id: result.insertId, ...service };
  }

  // Incident operations for MySQL
  async getIncidentsMySQL(): Promise<any[]> {
    return this.mysqlQuery('SELECT * FROM incident_reports ORDER BY date_reported DESC');
  }

  async addIncidentMySQL(incident: any): Promise<any> {
    const referenceNumber = `RD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
    const sql = 'INSERT INTO incident_reports (reference_number, reporter_name, contact_number, location, incident_type, description, urgency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [referenceNumber, incident.reporter_name, incident.contact_number, incident.location, incident.incident_type, incident.description, incident.urgency, incident.status];
    const result = await this.mysqlQuery(sql, params);
    return { id: result.insertId, reference_number: referenceNumber, ...incident };
  }

  // Gallery operations for MySQL
  async getGalleryMySQL(): Promise<any[]> {
    const rows = await this.mysqlQuery('SELECT * FROM gallery ORDER BY created_at DESC');
    return rows.map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : []
    }));
  }

  async addGalleryMySQL(item: any): Promise<any> {
    const sql = 'INSERT INTO gallery (title, description, image, category, date, location, tags, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [item.title, item.description, item.image, item.category, item.date, item.location, JSON.stringify(item.tags), item.status, item.featured];
    const result = await this.mysqlQuery(sql, params);
    return { id: result.insertId, ...item };
  }
}

export const databaseManager = new DatabaseManager();