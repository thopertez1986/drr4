import React, { useState } from 'react';
import { Database, Settings, CheckCircle, XCircle, Loader, Save } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';

const DatabaseSelector: React.FC = () => {
  const { databaseType, isConnected, connectionError, switchDatabase } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mysqlConfig, setMysqlConfig] = useState({
    host: '',
    user: '',
    password: '',
    database: '',
    port: 3306
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const handleMySQLConnect = async () => {
    setIsConnecting(true);
    try {
      await switchDatabase({
        type: 'mysql',
        mysql: mysqlConfig
      });
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSupabaseConnect = async () => {
    setIsConnecting(true);
    try {
      await switchDatabase({ type: 'supabase' });
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };
  return (
    <>
      {/* Database Status Indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <Database size={16} />
        <span className="font-medium">
          {databaseType === 'supabase' ? 'Supabase' : 'MySQL'}
        </span>
        {isConnected ? (
          <CheckCircle size={16} className="text-green-500" />
        ) : (
          <XCircle size={16} className="text-red-500" />
        )}
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Settings size={16} />
        </button>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="text-xs text-yellow-600 mt-1">
          {connectionError}
        </div>
      )}

      {/* Database Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Database Configuration</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Current Status */}
              <div className={`border rounded-lg p-4 ${
                isConnected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <CheckCircle className="text-green-500" size={20} />
                  ) : (
                    <XCircle className="text-red-500" size={20} />
                  )}
                  <span className={`font-medium ${isConnected ? 'text-green-800' : 'text-red-800'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({databaseType === 'supabase' ? 'Supabase' : 'MySQL'})
                  </span>
                </div>
              </div>

              {/* Database Type Selection */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Select Database Type</h3>
                <div className="space-y-3">
                  <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    databaseType === 'supabase' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`} onClick={handleSupabaseConnect}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Supabase (Recommended)</h4>
                        <p className="text-sm text-gray-600">PostgreSQL with real-time features</p>
                      </div>
                      <input
                        type="radio"
                        checked={databaseType === 'supabase'}
                        readOnly
                        className="text-blue-600"
                      />
                    </div>
                  </div>

                  <div className={`border rounded-lg p-4 ${
                    databaseType === 'mysql' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">MySQL</h4>
                        <p className="text-sm text-gray-600">Traditional MySQL database</p>
                      </div>
                      <input
                        type="radio"
                        checked={databaseType === 'mysql'}
                        readOnly
                        className="text-blue-600"
                      />
                    </div>
                    
                    {/* MySQL Configuration Form */}
                    <div className="space-y-3 mt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Host"
                          value={mysqlConfig.host}
                          onChange={(e) => setMysqlConfig({...mysqlConfig, host: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Port"
                          value={mysqlConfig.port}
                          onChange={(e) => setMysqlConfig({...mysqlConfig, port: parseInt(e.target.value) || 3306})}
                          className="px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Username"
                        value={mysqlConfig.user}
                        onChange={(e) => setMysqlConfig({...mysqlConfig, user: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={mysqlConfig.password}
                        onChange={(e) => setMysqlConfig({...mysqlConfig, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Database Name"
                        value={mysqlConfig.database}
                        onChange={(e) => setMysqlConfig({...mysqlConfig, database: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={handleMySQLConnect}
                        disabled={isConnecting || !mysqlConfig.host || !mysqlConfig.user || !mysqlConfig.database}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isConnecting ? (
                          <>
                            <Loader className="animate-spin mr-2" size={16} />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2" size={16} />
                            Connect to MySQL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {connectionError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>Connection Error:</strong> {connectionError}
                  </p>
                  {databaseType === 'supabase' && (
                    <p className="text-xs text-red-600 mt-2">
                      Please check your Supabase configuration in the .env file.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DatabaseSelector;