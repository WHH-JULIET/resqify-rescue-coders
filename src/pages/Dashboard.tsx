import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { sosEvents } = useUser();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="text-warning" size={20} />;
      case 'resolved':
        return <CheckCircle className="text-safe" size={20} />;
      case 'cancelled':
        return <XCircle className="text-muted-foreground" size={20} />;
      default:
        return <Clock className="text-muted-foreground" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-warning/10 border-warning/30';
      case 'resolved':
        return 'bg-safe/10 border-safe/30';
      case 'cancelled':
        return 'bg-muted border-border';
      default:
        return 'bg-secondary border-border';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your safety activity history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card-safety text-center py-4">
            <p className="text-2xl font-bold text-foreground">{sosEvents.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Alerts</p>
          </div>
          <div className="card-safety text-center py-4">
            <p className="text-2xl font-bold text-safe">
              {sosEvents.filter(e => e.status === 'resolved').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Resolved</p>
          </div>
          <div className="card-safety text-center py-4">
            <p className="text-2xl font-bold text-warning">
              {sosEvents.filter(e => e.status === 'active').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Active</p>
          </div>
        </div>

        {/* Events List */}
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>

        {sosEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No activity yet</h3>
            <p className="text-muted-foreground text-sm">
              Your SOS alerts and safety events will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sosEvents.map((event) => (
              <div
                key={event.id}
                className={cn(
                  'p-4 rounded-2xl border-2 transition-all',
                  getStatusColor(event.status)
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-soft">
                    {getStatusIcon(event.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">SOS Alert</p>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full capitalize',
                        event.status === 'active' && 'bg-warning text-warning-foreground',
                        event.status === 'resolved' && 'bg-safe text-safe-foreground',
                        event.status === 'cancelled' && 'bg-muted text-muted-foreground'
                      )}>
                        {event.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(event.timestamp)}
                    </p>
                    
                    {event.location && (
                      <p className="text-xs text-muted-foreground mt-2">
                        📍 {event.location.lat.toFixed(4)}, {event.location.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
