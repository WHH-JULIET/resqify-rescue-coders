import { useState } from 'react';
import { Plus, Phone, Trash2, Edit2, X, Shield, Star, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/PageWrapper';
import { PermissionToggle, PermissionType } from '@/components/PermissionToggle';
import { useUser, Contact } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const relationships = ['Mother', 'Father', 'Spouse', 'Sibling', 'Friend', 'Other'];

export default function Contacts() {
  const { contacts, addContact, updateContact, removeContact, user } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isBestFriend: false,
    permissions: {
      notifications: false,
      calls: false,
      liveLocation: false,
      audio: false,
      video: false,
    },
  });

  const isMinorMotherLocked = (relationship: string) => {
    return user?.isMinor && relationship === 'Mother';
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.relationship) {
      toast.error('Please fill in all required fields');
      return;
    }

    const isLocked = isMinorMotherLocked(formData.relationship);
    const finalBestFriend = isLocked ? true : formData.isBestFriend;
    const finalPermissions = finalBestFriend ? {
      notifications: true,
      calls: true,
      liveLocation: true,
      audio: true,
      video: true,
    } : formData.permissions;

    if (editingContact) {
      updateContact(editingContact.id, {
        name: formData.name,
        phone: formData.phone,
        relationship: formData.relationship,
        isBestFriend: finalBestFriend,
        permissions: finalPermissions,
      });
      toast.success('Contact updated');
    } else {
      addContact({
        name: formData.name,
        phone: formData.phone,
        relationship: formData.relationship,
        isBestFriend: finalBestFriend,
        permissions: finalPermissions,
      });
      
      if (isLocked) {
        toast.info('Best-Friend mode locked ON for Mother (Minor Safety)');
      }
      toast.success('Contact added');
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      relationship: '',
      isBestFriend: false,
      permissions: {
        notifications: false,
        calls: false,
        liveLocation: false,
        audio: false,
        video: false,
      },
    });
    setShowAddModal(false);
    setEditingContact(null);
  };

  const openEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isBestFriend: contact.isBestFriend,
      permissions: contact.permissions,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Remove this contact?')) {
      removeContact(id);
      toast.success('Contact removed');
    }
  };

  const toggleBestFriend = (contact: Contact) => {
    if (isMinorMotherLocked(contact.relationship)) {
      toast.error('Best-Friend mode is locked for Mother (Minor Safety)');
      return;
    }

    const newBestFriend = !contact.isBestFriend;
    updateContact(contact.id, {
      isBestFriend: newBestFriend,
      permissions: newBestFriend ? {
        notifications: true,
        calls: true,
        liveLocation: true,
        audio: true,
        video: true,
      } : contact.permissions,
    });
    
    toast.success(newBestFriend ? 'Best-Friend mode enabled' : 'Best-Friend mode disabled');
  };

  const togglePermission = (permission: PermissionType) => {
    if (formData.isBestFriend) return; // Can't toggle individual permissions in best friend mode
    
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const handleBestFriendToggle = () => {
    if (isMinorMotherLocked(formData.relationship)) {
      toast.error('Best-Friend mode is locked for Mother (Minor Safety)');
      return;
    }
    
    const newBestFriend = !formData.isBestFriend;
    setFormData(prev => ({
      ...prev,
      isBestFriend: newBestFriend,
      permissions: newBestFriend ? {
        notifications: true,
        calls: true,
        liveLocation: true,
        audio: true,
        video: true,
      } : {
        notifications: false,
        calls: false,
        liveLocation: false,
        audio: false,
        video: false,
      },
    }));
  };

  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-5 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trusted Contacts</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''} added
              </p>
            </div>
            <Button onClick={() => setShowAddModal(true)} size="icon">
              <Plus size={20} />
            </Button>
          </div>

          {/* Best Friend Info */}
          <div className="card-safety bg-accent/50 mb-6">
            <div className="flex items-start gap-3">
              <Star className="text-primary mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-foreground text-sm">Best-Friend Mode</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Enables ALL permissions + continuous live location sharing.
                </p>
              </div>
            </div>
          </div>

          {/* Contacts List */}
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">No contacts yet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add trusted contacts who will be notified during emergencies
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus size={18} />
                Add Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => {
                const isLocked = isMinorMotherLocked(contact.relationship);
                return (
                  <div
                    key={contact.id}
                    className={cn('card-safety', contact.isBestFriend && 'ring-2 ring-primary')}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        contact.isBestFriend ? 'bg-primary' : 'bg-accent'
                      )}>
                        <span className="text-lg">{contact.isBestFriend ? '⭐' : '👤'}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground truncate">{contact.name}</p>
                          {contact.isBestFriend && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                              Best Friend
                              {isLocked && <Lock size={10} />}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                        <p className="text-sm text-primary mt-1">{contact.phone}</p>
                        
                        {/* Permissions Summary */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {Object.entries(contact.permissions).map(([key, enabled]) => (
                            <span
                              key={key}
                              className={cn(
                                'text-[10px] px-2 py-0.5 rounded-full capitalize',
                                enabled ? 'bg-safe/20 text-safe' : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {key === 'liveLocation' ? 'Location' : key}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => toggleBestFriend(contact)}
                          disabled={isLocked}
                          className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                            contact.isBestFriend
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-muted-foreground hover:text-foreground',
                            isLocked && 'opacity-60 cursor-not-allowed'
                          )}
                        >
                          {isLocked ? <Lock size={14} /> : <Star size={16} />}
                        </button>
                        <a
                          href={`tel:${contact.phone}`}
                          className="w-8 h-8 rounded-lg bg-safe flex items-center justify-center"
                        >
                          <Phone size={16} className="text-safe-foreground" />
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEdit(contact)}>
                        <Edit2 size={14} />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-foreground/50 flex items-end justify-center z-50 animate-fade-in">
          <div className="bg-card w-full max-w-lg rounded-t-3xl animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {editingContact ? 'Edit Contact' : 'Add Contact'}
              </h2>
              <button onClick={resetForm} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contact name"
                  className="input-safety"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="input-safety"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Relationship *</label>
                <div className="grid grid-cols-3 gap-2">
                  {relationships.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, relationship: rel });
                        // Auto-enable best friend for minor's mother
                        if (user?.isMinor && rel === 'Mother') {
                          setFormData(prev => ({
                            ...prev,
                            relationship: rel,
                            isBestFriend: true,
                            permissions: {
                              notifications: true,
                              calls: true,
                              liveLocation: true,
                              audio: true,
                              video: true,
                            },
                          }));
                        }
                      }}
                      className={cn(
                        'py-2 px-3 rounded-xl text-sm font-medium transition-all',
                        formData.relationship === rel
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                      )}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Best Friend Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleBestFriendToggle}
                  disabled={isMinorMotherLocked(formData.relationship)}
                  className={cn(
                    'w-full p-4 rounded-xl flex items-center gap-4 transition-all',
                    formData.isBestFriend
                      ? 'bg-accent border-2 border-primary'
                      : 'bg-secondary border-2 border-transparent',
                    isMinorMotherLocked(formData.relationship) && 'opacity-80'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    formData.isBestFriend ? 'bg-primary' : 'bg-muted'
                  )}>
                    {isMinorMotherLocked(formData.relationship) ? (
                      <Lock size={20} className="text-primary-foreground" />
                    ) : (
                      <Star size={20} className={formData.isBestFriend ? 'text-primary-foreground' : 'text-muted-foreground'} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">Best-Friend Mode</p>
                    <p className="text-xs text-muted-foreground">
                      {isMinorMotherLocked(formData.relationship) 
                        ? 'Locked ON for Mother (Minor Safety)'
                        : 'Enable all permissions & live location'
                      }
                    </p>
                  </div>
                </button>
              </div>

              {/* Individual Permissions */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">Permissions</label>
                <p className="text-xs text-muted-foreground mb-3">
                  {formData.isBestFriend 
                    ? 'All permissions enabled with Best-Friend mode'
                    : 'Toggle individual permissions for this contact'
                  }
                </p>
                <div className="space-y-2">
                  {(['notifications', 'calls', 'liveLocation', 'audio', 'video'] as PermissionType[]).map((perm) => (
                    <PermissionToggle
                      key={perm}
                      type={perm}
                      enabled={formData.permissions[perm]}
                      locked={formData.isBestFriend}
                      onToggle={() => togglePermission(perm)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sticky Button */}
            <div className="p-6 pt-4 border-t border-border bg-card safe-bottom">
              <Button onClick={handleSubmit} className="w-full" size="lg">
                {editingContact ? 'Save Changes' : 'Add Contact'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
