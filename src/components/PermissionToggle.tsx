import { Bell, Phone, MapPin, Mic, Video, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PermissionType = 'notifications' | 'calls' | 'liveLocation' | 'audio' | 'video';

interface PermissionToggleProps {
  type: PermissionType;
  enabled: boolean;
  locked?: boolean;
  onToggle: () => void;
}

const permissionConfig: Record<PermissionType, { icon: typeof Bell; label: string }> = {
  notifications: { icon: Bell, label: 'Notifications' },
  calls: { icon: Phone, label: 'Calls' },
  liveLocation: { icon: MapPin, label: 'Live Location' },
  audio: { icon: Mic, label: 'Audio' },
  video: { icon: Video, label: 'Video' },
};

export function PermissionToggle({ type, enabled, locked, onToggle }: PermissionToggleProps) {
  const config = permissionConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center',
          enabled ? 'bg-primary' : 'bg-muted'
        )}>
          <Icon size={16} className={enabled ? 'text-primary-foreground' : 'text-muted-foreground'} />
        </div>
        <span className="text-sm font-medium text-foreground">{config.label}</span>
      </div>
      
      <button
        onClick={onToggle}
        disabled={locked}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors',
          enabled ? 'bg-primary' : 'bg-muted',
          locked && 'opacity-60 cursor-not-allowed'
        )}
      >
        <div
          className={cn(
            'absolute top-1 w-4 h-4 rounded-full bg-card shadow transition-transform',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
        {locked && (
          <Lock size={10} className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
