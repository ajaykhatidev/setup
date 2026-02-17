import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Users, Calendar, Hash, FileJson, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeads = async () => {
    setRefreshing(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/leads`);
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Lead Pulse
            </h1>
            <p className="text-slate-400 font-medium">Monitoring your Meta Lead Ads in real-time</p>
          </div>
          <button
            onClick={fetchLeads}
            disabled={refreshing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Syncing...' : 'Refresh Database'}
          </button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <div className="text-2xl font-bold">{leads.length}</div>
              <div className="text-sm text-slate-400">Total Leads</div>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {leads.length > 0 ? new Date(leads[0].created_time).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-slate-400">Latest Lead</div>
            </div>
          </div>
          <div className="glass-card p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <Hash className="w-8 h-8" />
            </div>
            <div>
              <div className="text-2xl font-bold">{leads.length > 0 ? [...new Set(leads.map(l => l.form_id))].length : 0}</div>
              <div className="text-sm text-slate-400">Active Forms</div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-indigo-400 flex flex-col items-center gap-4">
              <RefreshCw className="w-12 h-12 animate-spin" />
              <span className="font-bold tracking-widest uppercase text-sm">Initializing Interface...</span>
            </div>
          </div>
        ) : leads.length === 0 ? (
          <div className="glass-card p-20 text-center">
            <div className="mb-4 text-slate-500">
              <FileJson className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-semibold">Waiting for lead data...</p>
              <p className="text-slate-400">New leads from Meta will appear here automatically.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leads.map((lead, idx) => (
              <div
                key={lead.id}
                className="glass-card p-6 animate-in hover:border-indigo-500/50 transition-colors group cursor-default"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-1">Lead ID</div>
                    <div className="text-sm font-mono text-slate-300 truncate w-32">{lead.lead_id}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Submitted</div>
                    <div className="text-sm text-slate-300 font-medium">
                      {new Date(lead.created_time).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {Object.entries(lead.fields || {}).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-slate-200 font-medium">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-slate-500 font-mono">FORM: {lead.form_id}</span>
                  <button className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-xs font-bold uppercase transition-colors">
                    Details <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
